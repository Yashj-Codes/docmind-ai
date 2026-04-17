from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.rag_service import generate_rag_response
from services.db_service import save_message, get_chat_history, clear_chat_history
import uuid

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        session_id = request.session_id
        
        # Save user message to SQLite
        save_message(session_id, "user", request.message)
        
        # Retrieve recent history
        chat_history = get_chat_history(session_id, limit=5)
        
        # Generate RAG response
        answer, sources = generate_rag_response(request.message, chat_history[:-1]) # exclude the current message from history because we append it manually in rag_service
        
        # Save AI message to SQLite
        save_message(session_id, "assistant", answer)
        
        return ChatResponse(
            answer=answer,
            sources=sources,
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(session_id: str):
    try:
        history = get_chat_history(session_id, limit=50) # Return more for UI usage if needed
        return {"session_id": session_id, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history")
async def clear_history(session_id: str):
    try:
        clear_chat_history(session_id)
        return {"message": "Chat history cleared", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
