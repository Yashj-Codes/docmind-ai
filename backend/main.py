from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, documents
from services.db_service import init_db
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PolicyMind API", description="Chat with your documents using AI")

# Configure CORS for Vite frontend and Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://docmind-ai-taupe.vercel.app",
        "https://docmind-gjmhfafbn-yashj-codes-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
init_db()

# Include Routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "PolicyMind API is running!"}
