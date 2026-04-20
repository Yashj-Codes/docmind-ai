import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { documentAPI } from '../services/api';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setError("Only PDF and TXT files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      await documentAPI.upload(file);
      onUploadSuccess();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative mt-2 flex justify-center rounded-xl border-2 border-dashed px-6 py-6 transition-all duration-200 cursor-pointer
          ${isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          {isUploading ? (
            <Loader2 className="mx-auto h-8 w-8 text-cyan-400 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
          )}
          <div className="mt-3 flex text-sm leading-6 text-gray-400 justify-center">
            <span className="relative rounded-md font-semibold text-indigo-400 hover:text-indigo-300">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </span>
            <p className="pl-1">{!isUploading && 'or drag and drop'}</p>
          </div>
          <p className="text-xs leading-5 text-gray-500 mt-1">PDF, TXT up to 10MB</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handeFileSelect}
        />
      </div>
      
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 p-2 rounded items-start">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
