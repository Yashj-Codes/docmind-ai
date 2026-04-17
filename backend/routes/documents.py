from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from models.schemas import DocumentInfo
from services.embedding_service import process_file_and_embed, delete_embeddings_for_doc
from services.db_service import save_document, get_all_documents, delete_document
import os

router = APIRouter()

MAX_FILE_SIZE_MB = int(os.environ.get("MAX_FILE_SIZE_MB", 10))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only .pdf and .txt files are supported")
        
    try:
        # Check file size by reading
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {MAX_FILE_SIZE_MB}MB")
        
        # Reset cursor
        await file.seek(0)
        
        doc_id, num_chunks = process_file_and_embed(file)
        
        save_document(doc_id, file.filename, num_chunks)
        
        return {
            "message": "File processed successfully",
            "doc_id": doc_id,
            "filename": file.filename,
            "chunks": num_chunks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[DocumentInfo])
async def list_documents():
    try:
        docs = get_all_documents()
        return [DocumentInfo(**doc) for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{doc_id}")
async def remove_document(doc_id: str):
    try:
        delete_embeddings_for_doc(doc_id)
        delete_document(doc_id)
        return {"message": f"Document {doc_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
