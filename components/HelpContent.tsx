"use client";

import { Upload, MessageSquare, Brain, FileText, Zap, Shield, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HelpContentProps {
  onGetStarted?: () => void;
  onStartChat?: () => void;
}

export function HelpContent({ onGetStarted, onStartChat }: HelpContentProps) {
  return (
    <div className="space-y-8">
      {/* Quick Start */}
      <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Start</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Get started in 3 simple steps</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full bg-[#57068C] text-white flex items-center justify-center text-xs font-bold">1</div>
            Upload files
          </div>
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full bg-[#57068C] text-white flex items-center justify-center text-xs font-bold">2</div>
            Ask questions
          </div>
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full bg-[#57068C] text-white flex items-center justify-center text-xs font-bold">3</div>
            Learn faster
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">What You Can Do</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { 
              icon: FileText, 
              title: 'Upload Any Document', 
              desc: 'PDF, PowerPoint, Word, Excel, and text files are all supported' 
            },
            { 
              icon: MessageSquare, 
              title: 'Natural Conversations', 
              desc: 'Ask questions in plain language, just like talking to a tutor' 
            },
            { 
              icon: Brain, 
              title: 'AI Memory', 
              desc: 'Remembers your strengths and weaknesses for personalized help' 
            },
            { 
              icon: Zap, 
              title: 'Instant Answers', 
              desc: 'Get responses in seconds, sourced from your own materials' 
            },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-[#57068C] dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">{feature.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pro Tips</h3>
        <div className="space-y-3">
          {[
            'Upload your syllabus first for context about your course structure',
            'Be specific in your questions for more accurate answers',
            'Ask for explanations "in simple terms" if something is confusing',
            'Request practice questions to test your understanding',
            'Set up your profile to get personalized responses',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Example Questions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Try Asking</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Summarize Chapter 3",
            "What's on the midterm?",
            "Explain recursion simply",
            "Create flashcards for this topic",
            "What are the key concepts?",
            "Quiz me on this material",
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('example-question', { detail: q }));
                }
                onStartChat?.();
              }}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-[#57068C] hover:text-[#57068C] dark:hover:text-purple-400 transition-colors"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Supported File Types</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { ext: 'PDF', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            { ext: 'PPTX', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
            { ext: 'DOCX', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            { ext: 'XLSX', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
            { ext: 'TXT', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
          ].map((f, i) => (
            <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${f.color}`}>
              .{f.ext.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={onGetStarted}
          className="flex-1 h-12 bg-[#57068C] hover:bg-[#6A0BA8] text-white rounded-xl shadow-lg shadow-purple-500/20"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Materials
        </Button>
        <Button 
          onClick={onStartChat}
          variant="outline"
          className="flex-1 h-12 rounded-xl border-2"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Chatting
        </Button>
      </div>
    </div>
  );
}

