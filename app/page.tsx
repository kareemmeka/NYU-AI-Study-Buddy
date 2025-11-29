"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { FileList } from '@/components/files/FileList';
import { WelcomeSection } from '@/components/WelcomeSection';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showFileManager, setShowFileManager] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    setShowFileManager(true);
    setShowWelcome(false);
  };

  const handleFileManagerClose = () => {
    setShowFileManager(false);
    if (showWelcome) {
      setShowWelcome(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header 
        onFileManagerClick={() => {
          setShowFileManager(true);
          setShowWelcome(false);
        }}
        onHelpClick={() => setShowHelp(!showHelp)}
      />
      
      <main className="flex-1 overflow-hidden">
        {showHelp ? (
          <div className="h-full overflow-auto bg-white/50 dark:bg-gray-900/50">
            <div className="container max-w-4xl mx-auto p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#57068C] to-[#8B2FC9] bg-clip-text text-transparent">
                  How It Works
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <WelcomeSection onGetStarted={handleGetStarted} />
            </div>
          </div>
        ) : showFileManager ? (
          <div className="h-full overflow-auto bg-white/50 dark:bg-gray-900/50">
            <div className="container max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#57068C] to-[#8B2FC9] bg-clip-text text-transparent">
                    Course Materials
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Upload and manage your course files
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileManagerClose}
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
        ) : showWelcome ? (
          <div className="h-full overflow-auto">
            <div className="min-h-full flex items-center justify-center py-12">
              <WelcomeSection onGetStarted={handleGetStarted} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col max-w-5xl mx-auto w-full min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden p-6">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


