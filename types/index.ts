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


