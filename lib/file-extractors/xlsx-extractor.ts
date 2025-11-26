import * as XLSX from 'xlsx';
import { ExtractedText } from '@/types';

export async function extractTextFromXLSX(buffer: Buffer): Promise<ExtractedText> {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let text = '';

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      text += `\n\n--- Sheet: ${sheetName} ---\n`;
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      jsonData.forEach((row: any) => {
        if (Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined)) {
          text += row.map(cell => String(cell || '')).join(' | ') + '\n';
        }
      });
    });

    return {
      filename: 'xlsx',
      text: text.trim(),
    };
  } catch (error) {
    return {
      filename: 'xlsx',
      text: '',
      error: error instanceof Error ? error.message : 'Failed to extract XLSX text',
    };
  }
}


