import { NextRequest } from 'next/server';
import { getPortkeyClient, AI_MODEL } from '@/lib/portkey';
import { Message } from '@/types';

const TITLE_GENERATION_PROMPT = `Generate a concise, descriptive title (maximum 6 words) for this conversation based on its content. The title should capture the main topic or theme being discussed. Return ONLY the title, nothing else.`;

export async function POST(req: NextRequest) {
  let messages: Message[] = [];
  
  try {
    const body = await req.json() as { messages: Message[] };
    messages = body.messages || [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ title: 'New Chat' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const recentMessages = messages.slice(-10);
    const conversationContext = recentMessages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 200)}`)
      .join('\n');

    const titlePrompt = `${TITLE_GENERATION_PROMPT}\n\nConversation:\n${conversationContext}`;

    try {
      const portkey = await getPortkeyClient();
      const response = await portkey.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: TITLE_GENERATION_PROMPT },
          { role: 'user', content: titlePrompt },
        ],
        max_tokens: 20,
        temperature: 0.7,
        stream: false,
      });

      const title = response.choices[0]?.message?.content?.trim() || 'New Chat';
      return new Response(JSON.stringify({ title: cleanTitle(title) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (apiError: any) {
      console.log('[TITLE] API error, using smart fallback:', apiError?.message);
      return new Response(JSON.stringify({ 
        title: generateSmartTitle(messages) 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[TITLE] Error generating title:', error);
    return new Response(JSON.stringify({ 
      title: generateSmartTitle(messages) 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function cleanTitle(title: string): string {
  return title
    .replace(/^["']|["']$/g, '')
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 60);
}

function generateSmartTitle(messages: Message[]): string {
  if (messages.length === 0) return 'New Chat';

  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  const content = firstUserMessage.content.trim();
  
  const commonWords = new Set(['what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'can', 'could', 'should', 'would', 'will', 'this', 'that', 'these', 'those', 'do', 'does', 'did', 'explain', 'tell', 'me', 'help', 'please']);
  
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !commonWords.has(w))
    .slice(0, 6);

  if (words.length === 0) {
    return content.substring(0, 40).trim() || 'New Chat';
  }

  const title = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return title || content.substring(0, 40).trim() || 'New Chat';
}
