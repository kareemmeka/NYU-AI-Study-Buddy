import { NextRequest } from 'next/server';
import { uploadFiles } from '@/lib/storage';
import { isValidFileType, formatFileSize } from '@/lib/utils';
import { UploadResponse } from '@/types';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('[UPLOAD] Upload request received');
  
  try {
    console.log('[UPLOAD] Parsing form data...');
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    console.log('[UPLOAD] Files received:', files.length);
    files.forEach((file, index) => {
      console.log(`[UPLOAD] File ${index + 1}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    });

    if (files.length === 0) {
      console.error('[UPLOAD] Error: No files provided');
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
    console.log('[UPLOAD] Starting file upload to Vercel Blob...');
    const uploadedFiles = await uploadFiles(files);
    console.log('[UPLOAD] Successfully uploaded files:', uploadedFiles.length);
    uploadedFiles.forEach((file, index) => {
      console.log(`[UPLOAD] Uploaded ${index + 1}: ${file.name}, URL: ${file.url}`);
    });

    const duration = Date.now() - startTime;
    console.log(`[UPLOAD] Upload completed in ${duration}ms`);

    return new Response(
      JSON.stringify({ success: true, files: uploadedFiles } as UploadResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[UPLOAD] Error after ${duration}ms:`, error);
    console.error('[UPLOAD] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      } as UploadResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


