import { NextRequest } from 'next/server';
import { listFiles, deleteFile } from '@/lib/storage';
import { FileListResponse } from '@/types';

export async function GET() {
  const startTime = Date.now();
  console.log('[FILES] GET request - Listing files...');
  
  try {
    const files = await listFiles();
    const duration = Date.now() - startTime;
    console.log(`[FILES] Successfully listed ${files.length} files in ${duration}ms`);
    
    return new Response(
      JSON.stringify({ files } as FileListResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[FILES] Error after ${duration}ms:`, error);
    console.error('[FILES] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return new Response(
      JSON.stringify({ 
        files: [], 
        error: 'Failed to list files',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      } as FileListResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const startTime = Date.now();
  console.log('[FILES] DELETE request received');
  
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    console.log(`[FILES] Delete request for file ID: ${fileId}`);

    if (!fileId) {
      console.error('[FILES] Error: File ID is required');
      return new Response(
        JSON.stringify({ error: 'File ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await deleteFile(fileId);
    const duration = Date.now() - startTime;
    console.log(`[FILES] Successfully deleted file ${fileId} in ${duration}ms`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[FILES] Error deleting file after ${duration}ms:`, error);
    console.error('[FILES] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete file',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


