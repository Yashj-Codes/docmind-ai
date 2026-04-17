import os
import uuid
import pdfplumber
import tempfile
from fastapi import UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import chromadb
from chromadb.config import Settings

CHROMA_PERSIST_PATH = os.environ.get("CHROMA_PERSIST_PATH", "./chroma_db")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_PATH)
collection_name = "policymind_docs"
# We'll use langchain's OpenAI Embeddings utility for chunking, 
# but storing embeddings directly via chroma collection is also fine.
embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)

# Get or create collection
collection = chroma_client.get_or_create_collection(
    name=collection_name,
    metadata={"hnsw:space": "cosine"}
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", " ", ""]
)

def process_file_and_embed(file: UploadFile) -> tuple[str, int]:
    """
    Parses the file, chunks the text, and stores in ChromaDB.
    Returns the generated document ID and number of chunks.
    """
    doc_id = str(uuid.uuid4())
    chunks = []
    texts_to_embed = []
    metadatas = []
    ids = []
    
    file_extension = file.filename.split('.')[-1].lower() if file.filename else ''
    
    # Use a NamedTemporaryFile to save the upload, which allows pdfplumber to read it
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as tmp_file:
        tmp_file.write(file.file.read())
        tmp_path = tmp_file.name

    try:
        if file_extension == 'pdf':
            with pdfplumber.open(tmp_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    if text:
                        page_chunks = text_splitter.split_text(text)
                        for chunk_idx, chunk_text in enumerate(page_chunks):
                            texts_to_embed.append(chunk_text)
                            metadatas.append({
                                "doc_id": doc_id,
                                "filename": file.filename,
                                "page_number": i + 1,
                                "chunk_index": chunk_idx
                            })
                            ids.append(f"{doc_id}_p{i+1}_c{chunk_idx}")
                            
        elif file_extension == 'txt':
            with open(tmp_path, 'r', encoding='utf-8') as f:
                text = f.read()
                file_chunks = text_splitter.split_text(text)
                for chunk_idx, chunk_text in enumerate(file_chunks):
                    texts_to_embed.append(chunk_text)
                    metadatas.append({
                        "doc_id": doc_id,
                        "filename": file.filename,
                        "page_number": 1,
                        "chunk_index": chunk_idx
                    })
                    ids.append(f"{doc_id}_p1_c{chunk_idx}")
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        if texts_to_embed:
            # Generate embeddings and add to ChromaDB
            embeddings = embeddings_model.embed_documents(texts_to_embed)
            collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=texts_to_embed
            )
            
    finally:
        # Cleanup temporary file
        os.unlink(tmp_path)
        
    return doc_id, len(texts_to_embed)

def delete_embeddings_for_doc(doc_id: str):
    """Deletes all chunks belonging to a document from ChromaDB"""
    # ChromaDB delete by metadata filter
    collection.delete(where={"doc_id": doc_id})

