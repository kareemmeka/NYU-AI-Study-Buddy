import mammoth from 'mammoth';
import { ExtractedText } from '@/types';

export async function extractTextFromDOCX(buffer: Buffer): Promise<ExtractedText> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      filename: 'docx',
      text: result.value,
    };
  } catch (error) {
    return {
      filename: 'docx',
      text: '',
      error: error instanceof Error ? error.message : 'Failed to extract DOCX text',
    };
  }
}


