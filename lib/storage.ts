import { put, list, del } from '@vercel/blob';
import { FileMetadata } from '@/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function uploadFile(file: File): Promise<FileMetadata> {
  console.log(`[STORAGE] Uploading file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
  
  if (file.size > MAX_FILE_SIZE) {
    const errorMsg = `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    console.error(`[STORAGE] ${errorMsg} for file: ${file.name}`);
    throw new Error(errorMsg);
  }

  // Support Files_READ_WRITE_TOKEN (Vercel's default) and BLOB_READ_WRITE_TOKEN
  const token = process.env.Files_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    const errorMsg = 'Files_READ_WRITE_TOKEN or BLOB_READ_WRITE_TOKEN is not set. Please add it to Vercel environment variables.';
    console.error(`[STORAGE] ${errorMsg}`);
    console.error('[STORAGE] Available env vars:', {
      hasFilesToken: !!process.env.Files_READ_WRITE_TOKEN,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    });
    throw new Error(errorMsg);
  }

  // Log token info for debugging (first few chars only)
  console.log('[STORAGE] Using blob token:', token.substring(0, 20) + '...');
  console.log('[STORAGE] Token length:', token.length);
  console.log('[STORAGE] Token starts with vercel_blob_rw_:', token.startsWith('vercel_blob_rw_'));

  try {
    console.log(`[STORAGE] Calling Vercel Blob put() for: ${file.name}`);
    const blob = await put(file.name, file, {
      access: 'public',
      token: token,
    });
    console.log(`[STORAGE] Successfully uploaded: ${file.name}`);
    console.log(`[STORAGE] Blob URL: ${blob.url}`);
    console.log(`[STORAGE] Blob pathname: ${blob.pathname}`);
    
    return {
      id: blob.pathname,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      url: blob.url,
    };
  } catch (error) {
    console.error(`[STORAGE] Vercel Blob upload error for ${file.name}:`, error);
    console.error('[STORAGE] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      const errorMsg = 'Blob storage access denied. Please verify BLOB_READ_WRITE_TOKEN is correct in Vercel environment variables. Token should start with "vercel_blob_rw_".';
      console.error(`[STORAGE] ${errorMsg}`);
      throw new Error(errorMsg);
    }
    throw error;
  }
}

export async function uploadFiles(files: File[]): Promise<FileMetadata[]> {
  console.log(`[STORAGE] Starting batch upload of ${files.length} files`);
  const startTime = Date.now();
  
  try {
    const uploadPromises = files.map((file, index) => {
      console.log(`[STORAGE] Queuing file ${index + 1}/${files.length}: ${file.name}`);
      return uploadFile(file);
    });
    
    const results = await Promise.all(uploadPromises);
    const duration = Date.now() - startTime;
    console.log(`[STORAGE] Batch upload completed: ${results.length} files in ${duration}ms`);
    return results;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[STORAGE] Batch upload failed after ${duration}ms:`, error);
    throw error;
  }
}

export async function listFiles(): Promise<FileMetadata[]> {
  console.log('[STORAGE] Listing files from Vercel Blob...');
  
  // Support Files_READ_WRITE_TOKEN (Vercel's default) and BLOB_READ_WRITE_TOKEN
  const token = process.env.Files_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn('[STORAGE] Files_READ_WRITE_TOKEN not set, returning empty file list');
    console.warn('[STORAGE] Available env vars:', {
      hasFilesToken: !!process.env.Files_READ_WRITE_TOKEN,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    });
    return [];
  }

  try {
    console.log('[STORAGE] Calling Vercel Blob list()...');
    const { blobs } = await list({
      token: token,
    });
    console.log(`[STORAGE] Found ${blobs.length} files in blob storage`);

    return blobs.map(blob => {
      // Extract file type from filename extension
      const filename = blob.pathname.split('/').pop() || 'unknown';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      const contentTypeMap: Record<string, string> = {
        'pdf': 'application/pdf',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain',
      };

      const fileMetadata = {
        id: blob.pathname,
        name: filename,
        type: contentTypeMap[extension] || 'unknown',
        size: blob.size,
        uploadedAt: new Date(), // Use current date as fallback
        url: blob.url,
      };
      
      console.log(`[STORAGE] File: ${filename}, size: ${blob.size}, type: ${fileMetadata.type}`);
      return fileMetadata;
    });
  } catch (error) {
    console.error('[STORAGE] Error listing files:', error);
    console.error('[STORAGE] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function deleteFile(fileId: string, fileUrl?: string): Promise<void> {
  console.log(`[STORAGE] Deleting file: ${fileId}${fileUrl ? ` (URL: ${fileUrl})` : ''}`);
  
  // Support Files_READ_WRITE_TOKEN (Vercel's default) and BLOB_READ_WRITE_TOKEN
  const token = process.env.Files_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    const errorMsg = 'Files_READ_WRITE_TOKEN or BLOB_READ_WRITE_TOKEN is not set. Please add it to Vercel environment variables.';
    console.error(`[STORAGE] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    // Vercel Blob del() can accept either a URL or a pathname
    // Prefer URL if provided (more reliable), otherwise use fileId
    let deleteTarget = fileUrl || fileId;
    
    // If we have a URL, use it directly (most reliable)
    if (fileUrl) {
      console.log(`[STORAGE] Using provided URL for deletion: ${fileUrl}`);
      deleteTarget = fileUrl;
    } else if (fileId.startsWith('/')) {
      // If fileId is a pathname (starts with /), try to find the URL
      console.log(`[STORAGE] File ID is a pathname, looking up URL...`);
      const { blobs } = await list({
        token: token,
      });
      
      const matchingBlob = blobs.find(blob => blob.pathname === fileId);
      if (matchingBlob) {
        deleteTarget = matchingBlob.url;
        console.log(`[STORAGE] Found matching blob, using URL: ${deleteTarget}`);
      } else {
        // If not found by pathname, try using the pathname directly
        console.log(`[STORAGE] Blob not found by pathname, trying pathname directly`);
        deleteTarget = fileId;
      }
    } else if (fileId.startsWith('http')) {
      // If fileId is already a URL, use it directly
      console.log(`[STORAGE] File ID is already a URL, using directly`);
      deleteTarget = fileId;
    }
    
    console.log(`[STORAGE] Attempting to delete with target: ${deleteTarget}`);
    await del(deleteTarget, {
      token: token,
    });
    console.log(`[STORAGE] ✅ Successfully deleted file: ${fileId} (target: ${deleteTarget})`);
  } catch (error) {
    console.error(`[STORAGE] ❌ Error deleting file ${fileId}:`, error);
    console.error('[STORAGE] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fileId,
      fileUrl,
      deleteTarget: fileUrl || fileId,
    });
    throw error;
  }
}


