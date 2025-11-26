"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { FileList } from '@/components/files/FileList';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showFileManager, setShowFileManager] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onFileManagerClick={() => setShowFileManager(true)} />
      
      <main className="flex-1 overflow-hidden">
        {showFileManager ? (
          <div className="h-full overflow-auto">
            <div className="container max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">File Manager</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFileManager(false)}
                  aria-label="Close file manager"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <FileList
                onFilesChange={() => {
                  // Optionally refresh chat when files change
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
            <div className="flex-1 overflow-hidden p-4">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


