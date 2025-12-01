"use client";

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelSelector } from '@/components/ModelSelector';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onModelChange?: (modelId: string) => void;
}

export function MessageInput({ onSend, disabled, onModelChange }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const maxLength = 2000;

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 md:p-6">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your course materials..."
              disabled={disabled}
              maxLength={maxLength}
              className="flex-1 min-h-[52px] text-base rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#57068C] focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled || message.length > maxLength}
              size="icon"
              className="h-[52px] w-[52px] bg-gradient-to-br from-[#57068C] to-[#6A0BA8] hover:from-[#6A0BA8] hover:to-[#7B1BC9] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="flex items-center gap-3">
              <ModelSelector compact onModelChange={onModelChange} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Press Enter to send
              </span>
            </div>
            <span className={cn(
              "text-xs font-medium",
              message.length > maxLength * 0.9 ? "text-red-500" : "text-gray-400 dark:text-gray-500"
            )}>
              {message.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
