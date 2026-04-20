/// <reference types="vite/client" />
import axios from 'axios';
import { ChatResponse, DocumentInfo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://docmind-ai-zvph.onrender.com';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  list: async (): Promise<DocumentInfo[]> => {
    const response = await api.get('/documents');
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export const chatAPI = {
  sendMessage: async (message: string, sessionId: string): Promise<ChatResponse> => {
    try {
      const response = await api.post('/chat', {
        message,
        session_id: sessionId,
      });
      return response.data;
    } catch (error) {
      // Log the error for debugging
      console.error('API error:', error);
      throw error;
    }
  },
  getHistory: async (sessionId: string) => {
    const response = await api.get(`/chat/history?session_id=${sessionId}`);
    return response.data;
  },
  clearHistory: async (sessionId: string) => {
    const response = await api.delete(`/chat/history?session_id=${sessionId}`);
    return response.data;
  },
};
