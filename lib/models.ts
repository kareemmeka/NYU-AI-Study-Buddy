// Available AI models configuration
export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

// Models available through NYU Portkey gateway
export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: '@gpt-4o/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s most capable model, best for complex reasoning',
    provider: 'OpenAI',
  },
  {
    id: '@vertexai/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google\'s most advanced model for complex tasks',
    provider: 'Google',
  },
  {
    id: '@vertexai/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and efficient, great balance of speed and quality',
    provider: 'Google',
  },
  {
    id: '@vertexai/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Fastest option, best for quick simple questions',
    provider: 'Google',
  },
  {
    id: '@vertexai/meta.llama-3.1-405b-instruct-maas',
    name: 'Llama 3.1 405B',
    description: 'Meta\'s largest open model, excellent for diverse tasks',
    provider: 'Meta',
  },
];

export const DEFAULT_MODEL = '@gpt-4o/gpt-4o';

// Local storage key for selected model
const MODEL_STORAGE_KEY = 'nyu-study-buddy-selected-model';

export function getSelectedModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL;
}

export function setSelectedModel(modelId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODEL_STORAGE_KEY, modelId);
}

export function getModelById(id: string): AIModel | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}
