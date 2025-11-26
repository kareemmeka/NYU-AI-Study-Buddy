import PizZip from 'pizzip';
import { parseString } from 'xml2js';
import { ExtractedText } from '@/types';

export async function extractTextFromPPTX(buffer: Buffer): Promise<ExtractedText> {
  try {
    const zip = new PizZip(buffer);
    const slides = zip.file(/ppt\/slides\/slide\d+\.xml/);
    let text = '';

    for (const slide of slides) {
      const slideContent = slide.asText();
      const slideNumber = slide.name.match(/slide(\d+)\.xml/)?.[1] || 'unknown';
      text += `\n--- Slide ${slideNumber} ---\n`;

      await new Promise<void>((resolve, reject) => {
        parseString(slideContent, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const extractText = (obj: any): string => {
            if (typeof obj === 'string') return obj;
            if (Array.isArray(obj)) {
              return obj.map(extractText).join(' ');
            }
            if (obj && typeof obj === 'object') {
              return Object.values(obj).map(extractText).join(' ');
            }
            return '';
          };

          text += extractText(result);
          resolve();
        });
      });
    }

    return {
      filename: 'pptx',
      text: text.trim(),
    };
  } catch (error) {
    return {
      filename: 'pptx',
      text: '',
      error: error instanceof Error ? error.message : 'Failed to extract PPTX text',
    };
  }
}


