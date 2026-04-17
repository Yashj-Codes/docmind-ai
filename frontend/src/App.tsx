import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import DocumentList from './components/DocumentList';
import FileUploader from './components/FileUploader';
import { documentAPI, chatAPI } from './services/api';
import { DocumentInfo, ChatMessage } from './types';
import { BookOpen } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState<string>('session-' + Math.random().toString(36).substring(7));
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const fetchDocuments = async () => {
    try {
      const docs = await documentAPI.list();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // Pre-seed greeting
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am PolicyMind. Upload some documents and ask me anything about them.'
    }]);
  }, []);

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const clearChat = async () => {
    try {
      await chatAPI.clearHistory(sessionId);
      setMessages([{
        role: 'assistant',
        content: 'Chat history cleared. How can I help you next?'
      }]);
    } catch (error) {
      console.error("Failed to clear chat", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans text-gray-100">
      {/* Sidebar Focus Area */}
      <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col shadow-2xl z-10">
        <div className="p-6 pb-4 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-600/30">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
            PolicyMind
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 px-1">Upload Document</h2>
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-6 mb-3 px-1">Knowledge Base</h2>
            <DocumentList 
              documents={documents} 
              onDeleteSuccess={fetchDocuments}
              isLoading={isLoadingDocs}
            />
          </section>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex bg-gray-900 relative">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none"></div>

        <ChatWindow 
          messages={messages}
          setMessages={setMessages}
          sessionId={sessionId}
          onClear={clearChat}
        />
      </div>
    </div>
  );
}

export default App;
