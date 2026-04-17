# 🧠 DocMind AI — Chat with Your Documents, Intelligently

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<p align="center">
  <strong>A production-grade, full-stack RAG (Retrieval-Augmented Generation) chatbot that lets you upload PDF/Text documents and hold intelligent, context-aware conversations with your data — powered by OpenAI, LangChain, and ChromaDB.</strong>
</p>

---

## 🎬 Live Demo

> Upload any PDF → Ask questions about it → Get cited, accurate answers in real time.

**Tech Stack:** FastAPI · React 18 · LangChain · ChromaDB · OpenAI GPT-3.5 · Docker · TypeScript · TailwindCSS

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **Document Upload & Management** | Upload PDFs & Text files with drag-and-drop. Full CRUD — list, preview, delete. |
| 🔍 **Semantic Chunking** | LangChain's `RecursiveCharacterTextSplitter` intelligently chunks documents preserving context. |
| 🧠 **Vector Search (ChromaDB)** | Persistent, SQLite-backed ChromaDB performs high-speed semantic similarity search. |
| 💡 **Smart Fallback Logic** | If similarity score < 0.7, falls back to general LLM with a transparency note shown in UI. |
| 💬 **Contextual Chat History** | Maintains last 5 conversational turns for coherent multi-turn dialogue. |
| 📑 **In-UI Source Citations** | Every answer cites exact document chunks and page numbers for full transparency. |
| 🐳 **One-Command Docker Deploy** | Entire stack (backend + frontend) launches with `docker-compose up --build`. |
| 🎨 **Premium Dark UI** | React 18 + Vite + TailwindCSS with smooth animations, micro-interactions, and glassmorphism. |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      User Browser                        │
│           React 18 + Vite + TailwindCSS UI              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP REST API
┌───────────────────────▼─────────────────────────────────┐
│              FastAPI Backend (Python 3.11)               │
│                                                          │
│   ┌─────────────────┐     ┌──────────────────────────┐  │
│   │ /api/documents  │     │      /api/chat            │  │
│   │ Upload, List,   │     │  RAG Pipeline             │  │
│   │ Delete          │     │  + Chat History           │  │
│   └────────┬────────┘     └──────────────┬───────────┘  │
│            │                             │               │
│   ┌────────▼──────────────────────────── ▼──────────┐   │
│   │         LangChain Services Layer                 │   │
│   │  EmbeddingService  │  RAGService  │  DBService   │   │
│   └────────┬─────────────────┬────────┬─────────────┘   │
└────────────┼─────────────────┼────────┼─────────────────┘
             │                 │        │
    ┌────────▼──────┐  ┌───────▼────┐  ┌─▼──────────────┐
    │   ChromaDB    │  │  OpenAI    │  │   SQLite DB     │
    │  (Vectors +   │  │  GPT-3.5   │  │  (Metadata +    │
    │  Embeddings)  │  │  text-     │  │  Chat History)  │
    │               │  │  embed-3   │  │                 │
    └───────────────┘  └────────────┘  └─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance async Python web framework
- **[LangChain](https://langchain.com/)** — LLM orchestration: chunking, embedding chains, RAG pipeline
- **[ChromaDB](https://www.trychroma.com/)** — Persistent vector store for semantic search
- **[OpenAI API](https://openai.com/)** — `gpt-3.5-turbo` for generation, `text-embedding-3-small` for embeddings
- **[pdfplumber](https://github.com/jsvine/pdfplumber)** — Reliable PDF text extraction
- **[SQLAlchemy](https://www.sqlalchemy.org/)** — ORM for document metadata and chat history persistence
- **[Pydantic v2](https://docs.pydantic.dev/)** — Runtime data validation and settings management
- **[Uvicorn](https://www.uvicorn.org/)** — ASGI server

### Frontend
- **[React 18](https://react.dev/)** + **TypeScript** — Type-safe component-based UI
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tooling and HMR
- **[TailwindCSS](https://tailwindcss.com/)** — Utility-first CSS with custom dark palette
- **[Axios](https://axios-http.com/)** — HTTP client with interceptors

### DevOps
- **[Docker](https://www.docker.com/)** + **Docker Compose** — Containerized, reproducible deployments

---

## 📁 Project Structure

```
docmind-ai/
├── backend/
│   ├── main.py                    # FastAPI app entry, CORS, router registration
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Backend container definition
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response schemas
│   ├── routes/
│   │   ├── documents.py           # Upload / list / delete document endpoints
│   │   └── chat.py                # Chat, history fetch, history clear endpoints
│   └── services/
│       ├── embedding_service.py   # PDF parsing → chunking → ChromaDB ingestion
│       ├── rag_service.py         # Query embedding → similarity search → LLM generation
│       └── db_service.py          # SQLAlchemy models, document & chat history CRUD
│
├── frontend/
│   ├── index.html                 # Vite entry HTML
│   ├── package.json
│   ├── vite.config.ts             # API proxy config
│   ├── tailwind.config.js         # TailwindCSS theme
│   └── src/
│       ├── App.tsx                # Root component, layout, tab routing
│       ├── main.tsx               # React 18 root render
│       ├── index.css              # Global styles + Tailwind directives
│       ├── components/
│       │   ├── ChatWindow.tsx     # Chat interface with session management
│       │   ├── MessageBubble.tsx  # User / AI message rendering
│       │   ├── SourceCitation.tsx # Inline source chunk display
│       │   ├── FileUploader.tsx   # Drag-and-drop upload with progress
│       │   └── DocumentList.tsx   # Document list with delete capability
│       ├── services/
│       │   └── api.ts             # Typed Axios API client
│       └── types/
│           └── index.ts           # Shared TypeScript interfaces
│
├── docker-compose.yml             # Orchestrates backend + frontend containers
├── .env.example                   # Environment variable template
└── .gitignore
```

---

## 🚀 Quick Start

### Option A: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Yashj-Codes/docmind-ai.git
cd docmind-ai

# 2. Configure environment variables
cp .env.example .env
# Open .env and fill in your OPENAI_API_KEY

# 3. Launch the full stack
docker-compose up --build
```

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:8000
- **API Docs (Swagger)** → http://localhost:8000/docs

---

### Option B: Manual Setup (Development)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Export your API key
export OPENAI_API_KEY=sk-...   # Windows: set OPENAI_API_KEY=sk-...

uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/documents/upload` | Upload and embed a `.pdf` or `.txt` file |
| `GET` | `/api/documents` | List all uploaded documents |
| `DELETE` | `/api/documents/{id}` | Delete document + its embeddings |
| `POST` | `/api/chat` | Send a message, get a RAG-powered response |
| `GET` | `/api/chat/history?session_id=` | Retrieve chat history for a session |
| `DELETE` | `/api/chat/history?session_id=` | Clear chat history for a session |

Full interactive API docs available at `/docs` (Swagger UI) when running locally.

---

## 🌐 Environment Variables

Copy `.env.example` → `.env` and fill in your values:

```env
OPENAI_API_KEY=sk-your-key-here
CHROMA_PERSIST_PATH=./chroma_db
MAX_FILE_SIZE_MB=10
TOP_K_RESULTS=4
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | — | Your OpenAI API secret key |
| `CHROMA_PERSIST_PATH` | No | `./chroma_db` | ChromaDB persistence directory |
| `MAX_FILE_SIZE_MB` | No | `10` | Max upload file size in MB |
| `TOP_K_RESULTS` | No | `4` | Number of semantic chunks retrieved per query |

---

## 🔬 How the RAG Pipeline Works

```
User Query
    │
    ▼
Embed Query (text-embedding-3-small)
    │
    ▼
Semantic Search in ChromaDB → Top-K Chunks
    │
    ├── similarity_score >= 0.7 → Use chunks as context
    └── similarity_score < 0.7  → Fallback to general LLM knowledge + notify user
    │
    ▼
Prompt Construction:
  [System Prompt] + [Chat History (last 5 turns)] + [Retrieved Context] + [User Query]
    │
    ▼
GPT-3.5-Turbo → Streamed Answer
    │
    ▼
Response includes: Answer + Source Citations (document name, page, chunk)
```

---

## 🔮 Roadmap

- [ ] **Streaming Responses** — Server-Sent Events for real-time token streaming
- [ ] **Multi-LLM Support** — Plug-and-play for Claude, Llama 3, HuggingFace models
- [ ] **User Authentication** — JWT-based sessions with per-user document isolation
- [ ] **Reranking Pipeline** — Cohere Rerank for precision retrieval improvement
- [ ] **Cloud Deployment** — AWS ECS / Railway one-click deploy guide

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Yashj-Codes">Yash Joshi</a></strong><br/>
  <em>Full-Stack RAG Application · LangChain · OpenAI · FastAPI · React 18</em>
</p>
