export interface Source {
  filename: string;
  snippet: string;
  page?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export interface DocumentInfo {
  id: string;
  filename: string;
  num_chunks: number;
  uploaded_at: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  session_id: string;
}
