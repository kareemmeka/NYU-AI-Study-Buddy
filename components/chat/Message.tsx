"use client";

import { Message as MessageType } from '@/types';
import { formatDate } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-5 transition-all duration-200",
          isUser
            ? "bg-gradient-to-br from-[#57068C] to-[#6A0BA8] text-white shadow-lg hover:shadow-xl"
            : "bg-white dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl border border-gray-200/60 dark:border-gray-700/60"
        )}
      >
        <div className={cn(
          "prose prose-sm dark:prose-invert max-w-none",
          isUser ? "prose-invert" : ""
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-[15px] text-gray-800 dark:text-gray-200">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1 text-gray-800 dark:text-gray-200">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1 text-gray-800 dark:text-gray-200">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 dark:bg-gray-700/50 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold mb-1 mt-2 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h3>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-300 dark:border-purple-600 pl-4 italic my-2 text-gray-700 dark:text-gray-300">{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-between mt-4 pt-3",
          isUser ? "border-t border-white/20" : "border-t border-gray-200 dark:border-gray-700"
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-semibold",
              isUser ? "text-white/90" : "text-gray-600 dark:text-gray-300"
            )}>
              {message.role === 'user' ? 'You' : 'AI Assistant'}
            </span>
            <span className={cn(
              "text-xs",
              isUser ? "text-white/50" : "text-gray-400 dark:text-gray-500"
            )}>
              •
            </span>
            <span className={cn(
              "text-xs",
              isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"
            )}>
              {formatDate(message.timestamp)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 transition-all opacity-70 hover:opacity-100",
              isUser 
                ? "text-white/80 hover:text-white hover:bg-white/20" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            onClick={handleCopy}
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


