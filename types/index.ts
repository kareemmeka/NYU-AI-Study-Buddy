export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  model?: string; // Optional: AI model to use
  user?: {
    name: string;
    preferences: UserPreferences;
    memory: UserMemory;
  } | null;
}

export interface UploadResponse {
  success: boolean;
  files?: FileMetadata[];
  error?: string;
}

export interface FileListResponse {
  files: FileMetadata[];
}

export type FileType = 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'txt' | 'unknown';

export interface ExtractedText {
  filename: string;
  text: string;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // Optional user association
}

// User Account Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
  memory: UserMemory;
}

export interface UserPreferences {
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  academicLevel: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
  major: string;
  preferredLanguage: string;
  responseStyle: 'concise' | 'detailed' | 'step-by-step';
  tone: 'formal' | 'casual' | 'encouraging';
}

export interface UserMemory {
  topics: string[]; // Topics the user has studied
  strengths: string[]; // Areas user is strong in
  weaknesses: string[]; // Areas user needs help with
  recentQuestions: string[]; // Last 20 questions asked
  notes: string; // Custom notes about the user
  lastUpdated: Date;
}
