import { NextRequest } from 'next/server';
import { listFiles, deleteFile } from '@/lib/storage';
import { FileListResponse } from '@/types';

export async function GET() {
  try {
    const files = await listFiles();
    return new Response(
      JSON.stringify({ files } as FileListResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('List files error:', error);
    return new Response(
      JSON.stringify({ files: [], error: 'Failed to list files' } as FileListResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'File ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await deleteFile(fileId);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete file error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


