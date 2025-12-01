"use client";

import { Message as MessageType, User } from '@/types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  user?: User | null;
}

export function MessageList({ messages, isTyping, user }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or typing indicator appears
    const scrollToBottom = () => {
      if (scrollRef.current) {
        const element = scrollRef.current;
        element.scrollTop = element.scrollHeight;
      }
    };
    
    // Multiple attempts to ensure scroll works
    scrollToBottom();
    const timeout1 = setTimeout(scrollToBottom, 50);
    const timeout2 = setTimeout(scrollToBottom, 150);
    const timeout3 = setTimeout(scrollToBottom, 300);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [messages, isTyping]);

  // Get personalized greeting
  const getGreeting = () => {
    if (user) {
      const firstName = user.name.split(' ')[0];
      return `Welcome, ${firstName}!`;
    }
    return 'Ready to Get Started?';
  };

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6" 
      ref={scrollRef}
      data-message-list
      style={{ 
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        position: 'relative'
      }}
    >
      <div className="py-6 max-w-4xl mx-auto">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-12">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-[#57068C] dark:text-purple-400">
                  {getGreeting()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {user 
                    ? `Ask anything about your course materials, ${user.name.split(' ')[0]}!`
                    : 'Ask a question about your course materials or try one of these examples:'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
                    className="text-left p-5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-[#57068C] hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all text-sm font-medium shadow-sm hover:shadow-lg group backdrop-blur-sm"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const event = new CustomEvent('example-question', { detail: question });
                        window.dispatchEvent(event);
                      }
                    }}
                  >
                    <span className="group-hover:text-[#57068C] dark:group-hover:text-purple-400 transition-colors text-gray-700 dark:text-gray-300">
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
