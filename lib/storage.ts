import { put, list, del } from '@vercel/blob';
import { FileMetadata } from '@/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function uploadFile(file: File): Promise<FileMetadata> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    id: blob.pathname,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: new Date(blob.uploadedAt),
    url: blob.url,
  };
}

export async function uploadFiles(files: File[]): Promise<FileMetadata[]> {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

export async function listFiles(): Promise<FileMetadata[]> {
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blobs.map(blob => ({
    id: blob.pathname,
    name: blob.pathname.split('/').pop() || 'unknown',
    type: blob.contentType || 'unknown',
    size: blob.size,
    uploadedAt: new Date(blob.uploadedAt),
    url: blob.url,
  }));
}

export async function deleteFile(fileId: string): Promise<void> {
  await del(fileId, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}


