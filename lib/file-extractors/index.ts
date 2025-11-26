import { extractTextFromPDF } from './pdf-extractor';
import { extractTextFromDOCX } from './docx-extractor';
import { extractTextFromXLSX } from './xlsx-extractor';
import { extractTextFromPPTX } from './pptx-extractor';
import { ExtractedText } from '@/types';
import { getFileType } from '@/lib/utils';

export async function extractTextFromFile(
  filename: string,
  buffer: Buffer
): Promise<ExtractedText> {
  const fileType = getFileType(filename).toLowerCase();

  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(buffer);
    case 'docx':
      return extractTextFromDOCX(buffer);
    case 'xlsx':
      return extractTextFromXLSX(buffer);
    case 'pptx':
      return extractTextFromPPTX(buffer);
    case 'txt':
      return {
        filename,
        text: buffer.toString('utf-8'),
      };
    default:
      return {
        filename,
        text: '',
        error: `Unsupported file type: ${fileType}`,
      };
  }
}

export { extractTextFromPDF, extractTextFromDOCX, extractTextFromXLSX, extractTextFromPPTX };


