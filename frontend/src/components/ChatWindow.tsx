import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Sparkles } from 'lucide-react';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sessionId: string;
  onClear: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, setMessages, sessionId, onClear }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(userMessage, sessionId);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer,
        sources: response.sources
      }]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error communicating with the server. Please check your setup and try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full h-full z-10 p-4">
      {/* Top Header Row with Clear Button */}
      <div className="flex justify-end p-2 pb-4">
        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 transition-all duration-200"
        >
          <Trash2 size={16} />
          Clear Chat
        </button>
      </div>
      
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto rounded-xl scrollbar-thin">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isTyping && (
           <div className="flex justify-start my-4 px-4">
             <div className="bg-gray-800 text-gray-300 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
               <Loader2 size={18} className="animate-spin text-indigo-400" />
               <span className="text-sm">PolicyMind is thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="mt-4 max-w-4xl mx-auto w-full relative">
        <div className="relative flex items-end gradient-border bg-gray-800 rounded-2xl p-2 shadow-xl shrink-0 border border-gray-700/50 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your documents..."
            className="w-full max-h-32 min-h-[44px] bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none py-3 px-4"
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="ml-2 mb-1 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white rounded-xl transition-colors shrink-0"
          >
            {isTyping ? <Sparkles size={20} className="animate-pulse" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-3 font-medium">PolicyMind can make mistakes. Consider verifying important information.</p>
      </div>
    </div>
  );
};

export default ChatWindow;
