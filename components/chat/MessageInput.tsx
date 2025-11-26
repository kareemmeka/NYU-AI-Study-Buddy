"use client";

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
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
    <div className="border-t bg-background p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your course..."
            disabled={disabled}
            maxLength={maxLength}
            className="min-h-[44px]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className={cn(
              "text-xs",
              message.length > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"
            )}>
              {message.length}/{maxLength}
            </span>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || message.length > maxLength}
          size="icon"
          className="h-11 w-11"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}


