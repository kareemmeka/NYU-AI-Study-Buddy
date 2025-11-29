"use client";

import { Message as MessageType } from '@/types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or typing indicator appears
    if (scrollRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages, isTyping]);

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden px-4" 
      ref={scrollRef}
      style={{ 
        maxHeight: '100%',
        WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
      }}
    >
      <div className="py-4 min-h-full">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#57068C] to-[#8B2FC9] bg-clip-text text-transparent">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground">
                  Ask a question about your course materials or try one of these examples:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "What are the main topics covered in this course?",
                  "Explain the key concepts from the latest lecture",
                  "Summarize the important points from the syllabus",
                  "Generate practice questions for the upcoming exam",
                  "What is the grading breakdown for this course?",
                  "Help me understand a difficult concept step by step",
                ].map((question, idx) => (
                  <button
                    key={idx}
                    className="text-left p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 hover:border-[#57068C] hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all text-sm font-medium shadow-sm hover:shadow-md group"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const event = new CustomEvent('example-question', { detail: question });
                        window.dispatchEvent(event);
                      }
                    }}
                  >
                    <span className="group-hover:text-[#57068C] dark:group-hover:text-purple-400 transition-colors">
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

