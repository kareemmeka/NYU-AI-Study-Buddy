"use client";

import { useState, useEffect } from 'react';
import { FileMetadata } from '@/types';
import { FileItem } from './FileItem';
import { FileUpload } from './FileUpload';
import { Loader2, FolderOpen } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { formatFileSize } from '@/lib/utils';

interface FileListProps {
  onFilesChange?: () => void;
}

export function FileList({ onFilesChange }: FileListProps) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setDeleting(fileId);
    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast({
          title: 'Success',
          description: 'File deleted successfully',
          variant: 'success',
        });
        onFilesChange?.();
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Course Materials</h2>
        <p className="text-muted-foreground">
          Upload your course files (PDF, PPTX, DOCX, XLSX, TXT) to enable the AI to answer questions about them.
        </p>
      </div>

      <FileUpload onUploadComplete={() => {
        loadFiles();
        onFilesChange?.();
      }} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {files.length} file(s) • {formatFileSize(totalSize)} total
            </p>
          </div>
          <div className="space-y-3">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


