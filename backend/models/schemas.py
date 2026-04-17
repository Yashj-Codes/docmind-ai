from typing import List, Optional
from pydantic import BaseModel, Field

class Source(BaseModel):
    filename: str
    snippet: str
    page: Optional[int] = None

class ChatRequest(BaseModel):
    message: str
    session_id: str = Field(default="default_session")

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    session_id: str

class DocumentInfo(BaseModel):
    id: str
    filename: str
    num_chunks: int
    uploaded_at: str
