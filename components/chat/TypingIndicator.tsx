"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <div className="bg-white dark:bg-gray-800/95 rounded-2xl px-6 py-4 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="h-2.5 w-2.5 bg-[#57068C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2.5 w-2.5 bg-[#57068C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2.5 w-2.5 bg-[#57068C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-1">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}


