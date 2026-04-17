import React, { useState } from 'react';
import { Source } from '../types';
import { ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';

interface SourceCitationProps {
  sources: Source[];
}

const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="text-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-medium uppercase tracking-wide opacity-80 hover:opacity-100"
      >
        <LinkIcon size={14} />
        {sources.length} sources referenced
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 cursor-text">
          {sources.map((source, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-300 w-full truncate pr-2">
                  {source.filename}
                </span>
                {source.page !== undefined && source.page !== null && (
                   <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded shrink-0">
                     Page {source.page}
                   </span>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-snug italic">
                "{source.snippet}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceCitation;
