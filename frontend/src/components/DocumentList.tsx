import React, { useState } from 'react';
import { DocumentInfo } from '../types';
import { FileText, Inbox, Trash2, Loader2 } from 'lucide-react';
import { documentAPI } from '../services/api';

interface DocumentListProps {
  documents: DocumentInfo[];
  onDeleteSuccess: () => void;
  isLoading: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDeleteSuccess, isLoading }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document from the vector store?")) return;
    
    setDeletingId(id);
    try {
      await documentAPI.delete(id);
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete the document.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 text-gray-500">
        <Loader2 className="animate-spin w-5 h-5" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-xl border-dashed">
        <Inbox className="mx-auto h-8 w-8 text-gray-600 mb-2" />
        <p className="text-sm text-gray-500">No documents yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="group flex items-center justify-between bg-gray-900 border border-gray-800 p-3 rounded-xl hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg shrink-0">
               <FileText size={16} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-gray-200" title={doc.filename}>{doc.filename}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 flex gap-2">
                 <span>{doc.num_chunks} chunks</span>
                 <span>•</span>
                 <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => handleDelete(doc.id, e)}
            disabled={deletingId === doc.id}
            className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Delete Document"
          >
            {deletingId === doc.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
