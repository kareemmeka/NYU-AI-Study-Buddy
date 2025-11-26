import pdf from 'pdf-parse';
import { ExtractedText } from '@/types';

export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedText> {
  try {
    const data = await pdf(buffer);
    return {
      filename: 'pdf',
      text: data.text,
    };
  } catch (error) {
    return {
      filename: 'pdf',
      text: '',
      error: error instanceof Error ? error.message : 'Failed to extract PDF text',
    };
  }
}


