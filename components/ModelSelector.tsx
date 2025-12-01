"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AVAILABLE_MODELS, 
  getSelectedModel, 
  setSelectedModel, 
  getModelById,
  AIModel 
} from '@/lib/models';

// Custom event name for model changes
const MODEL_CHANGE_EVENT = 'model-selection-changed';

// Dispatch custom event when model changes
function dispatchModelChange(modelId: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MODEL_CHANGE_EVENT, { detail: modelId }));
  }
}

interface ModelSelectorProps {
  onModelChange?: (modelId: string) => void;
  compact?: boolean; // For inline/compact display
}

export function ModelSelector({ onModelChange, compact = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedModelId(getSelectedModel());
  }, []);

  // Listen for model changes from other instances
  useEffect(() => {
    const handleModelChange = (e: CustomEvent<string>) => {
      setSelectedModelId(e.detail);
    };

    window.addEventListener(MODEL_CHANGE_EVENT as any, handleModelChange);
    return () => window.removeEventListener(MODEL_CHANGE_EVENT as any, handleModelChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = (model: AIModel) => {
    setSelectedModelId(model.id);
    setSelectedModel(model.id);
    setIsOpen(false);
    onModelChange?.(model.id);
    // Notify other instances
    dispatchModelChange(model.id);
  };

  const currentModel = getModelById(selectedModelId);

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-[#57068C] dark:hover:text-purple-400 bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg transition-colors"
          aria-label="Select AI Model"
        >
          <Cpu className="h-3.5 w-3.5" />
          <span className="max-w-[80px] truncate">{currentModel?.name || 'Model'}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Select Model</p>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className={`w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors ${
                    selectedModelId === model.id
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {model.name}
                    </span>
                    {selectedModelId === model.id && (
                      <span className="text-[10px] bg-[#57068C] text-white px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {model.provider}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-purple-50 dark:hover:bg-purple-950/20 min-w-[120px]"
        aria-label="Select AI Model"
      >
        <Cpu className="h-4 w-4" />
        <span className="hidden md:inline text-xs font-medium truncate max-w-[100px]">
          {currentModel?.name || 'Model'}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Select AI Model
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose the model that best fits your needs
            </p>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors ${
                  selectedModelId === model.id
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {model.name}
                  </span>
                  {selectedModelId === model.id && (
                    <span className="text-xs bg-[#57068C] text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {model.description}
                </p>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {model.provider}
                </span>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              GPT-4o is recommended for complex academic questions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
