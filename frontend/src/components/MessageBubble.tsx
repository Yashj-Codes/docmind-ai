import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import SourceCitation from './SourceCitation';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-4 group`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
          isUser ? 'bg-indigo-600 text-indigo-100' : 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>
        
        {/* Bubble */}
        <div className={`
          flex flex-col gap-2 
          ${isUser 
            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm px-5 py-3' 
            : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-2xl rounded-bl-sm p-5'}
          shadow-md
        `}>
          {/* Content */}
          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed 
            prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 prose-li:my-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {/* Citations block */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700/50">
               <SourceCitation sources={message.sources} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
