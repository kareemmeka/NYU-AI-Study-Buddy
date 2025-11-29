import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
  // Handle both Date objects and date strings (from JSON serialization)
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Unknown date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext || 'unknown';
}

export function isValidFileType(filename: string): boolean {
  const validTypes = ['pdf', 'pptx', 'docx', 'xlsx', 'txt'];
  const fileType = getFileType(filename);
  return validTypes.includes(fileType);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}


