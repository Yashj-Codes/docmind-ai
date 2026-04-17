import os
from typing import List, Dict, Any, Tuple
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from services.embedding_service import collection, embeddings_model
from models.schemas import Source

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TOP_K_RESULTS = int(os.environ.get("TOP_K_RESULTS", 4))

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, openai_api_key=OPENAI_API_KEY)

def generate_rag_response(query: str, chat_history: List[Dict[str, str]]) -> Tuple[str, List[Source]]:
    """
    Retrieves context for the query, format chat history context, and queries the LLM.
    Returns the answer and the sources used.
    """
    # Embed query
    query_embedding = embeddings_model.embed_query(query)
    
    # Retrieve top-k results
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=TOP_K_RESULTS,
        include=["documents", "metadatas", "distances"]
    )
    
    docs = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0] # ChromaDB uses distance. Smaller is more similar (typically). For cosine distance, similarity = 1 - distance.
    
    # Smart Fallback capability
    # In ChromaDB cosine space, distance is 1 - cosine_similarity.
    # So similarity score = 1 - distance.
    # Let's check max similarity
    
    max_similarity = 0
    if distances:
        # If it's pure cosine distance where 0 is identical and 2 is opposite
        # Similarity = 1 - (distance / 2) usually if normalized, or just 1 - distance
        # Assuming typical ChromaDB cosine distance:
        max_similarity = 1 - min(distances) if distances else 0

    sources = []
    context_text = ""
    
    # Threshold for fallback based on Prompt rules
    if not docs or max_similarity < 0.7:
        # Smart fallback -> Answer generally but mention lacking context
        fallback_prompt = (
            "You are PolicyMind, an intelligent document assistant. The user asked a question, "
            "but there are no relevant documents found in the current context base. "
            "Answer the user's question to the best of your general knowledge, but clearly state at the "
            "beginning that you are not answering based on any uploaded documents."
        )
        system_prompt = fallback_prompt
    else:
        # Build context
        for i, doc in enumerate(docs):
            meta = metadatas[i]
            context_text += f"\n--- Document Element {i+1} ---\nSource: {meta.get('filename', 'Unknown')}\n{doc}\n"
            sources.append(Source(
                filename=meta.get("filename", "Unknown"),
                snippet=doc[:150] + "...", 
                page=meta.get("page_number")
            ))
            
        system_prompt = (
            "You are PolicyMind, an intelligent document assistant. "
            "Use the following retrieved context elements to answer the user's question. "
            "If the answer cannot be found in the context, do not make something up. Instead, tell the user "
            "that the context does not contain the answer. "
            "Cite your sources if relevant.\n\n"
            f"Context Context:\n{context_text}"
        )

    # Prepare messages 
    # Current mapping: "user" -> HumanMessage, "assistant" -> AIMessage
    messages = [SystemMessage(content=system_prompt)]
    
    for msg in chat_history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))
            
    messages.append(HumanMessage(content=query))
    
    # Call OpenAI
    response = llm.invoke(messages)
    
    return response.content, sources
