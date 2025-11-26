import { NextRequest } from 'next/server';
import { uploadFiles } from '@/lib/storage';
import { isValidFileType, formatFileSize } from '@/lib/utils';
import { UploadResponse } from '@/types';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No files provided' } as UploadResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (files.length > MAX_FILES) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Maximum ${MAX_FILES} files allowed at once`,
        } as UploadResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate files
    const invalidFiles: string[] = [];
    const oversizedFiles: string[] = [];

    for (const file of files) {
      if (!isValidFileType(file.name)) {
        invalidFiles.push(file.name);
      }
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid file types: ${invalidFiles.join(', ')}. Supported: PDF, PPTX, DOCX, XLSX, TXT`,
        } as UploadResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (oversizedFiles.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Files too large: ${oversizedFiles.join(', ')}. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`,
        } as UploadResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Upload files
    const uploadedFiles = await uploadFiles(files);

    return new Response(
      JSON.stringify({ success: true, files: uploadedFiles } as UploadResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage } as UploadResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


