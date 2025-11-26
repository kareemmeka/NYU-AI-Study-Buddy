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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 px-4 overflow-auto" ref={scrollRef}>
      <div className="py-4">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Study Buddy!</h3>
            <p className="text-muted-foreground mb-6">
              Upload your course materials and ask questions to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                "When is Assignment 1 due?",
                "Explain the concept from Lecture 3 in simple terms",
                "Summarize the main topics from this week's slides",
                "Generate 5 practice questions about computer architecture",
                "What is the grading breakdown for this course?",
                "Help me understand pointers in C++",
              ].map((question, idx) => (
                <button
                  key={idx}
                  className="text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-sm"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const event = new CustomEvent('example-question', { detail: question });
                      window.dispatchEvent(event);
                    }
                  }}
                >
                  {question}
                </button>
              ))}
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

