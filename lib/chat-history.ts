import { ChatSession, Message } from '@/types';

const STORAGE_KEY = 'nyu-study-buddy-chat-sessions';
const MAX_SESSIONS = 50; // Limit to prevent storage bloat

export function getAllChatSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored) as ChatSession[];
    // Convert date strings back to Date objects
    return sessions.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('[ChatHistory] Error loading sessions:', error);
    return [];
  }
}

export function getChatSession(id: string): ChatSession | null {
  const sessions = getAllChatSessions();
  return sessions.find(s => s.id === id) || null;
}

export function saveChatSession(session: ChatSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getAllChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      // Update existing session
      sessions[existingIndex] = {
        ...session,
        updatedAt: new Date(),
      };
    } else {
      // Add new session
      sessions.unshift({
        ...session,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Limit number of sessions
      if (sessions.length > MAX_SESSIONS) {
        sessions.splice(MAX_SESSIONS);
      }
    }
    
    // Sort by updatedAt (most recent first)
    sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('[ChatHistory] Error saving session:', error);
  }
}

export function deleteChatSession(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getAllChatSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[ChatHistory] Error deleting session:', error);
  }
}

export function createNewChatSession(title?: string): ChatSession {
  const session: ChatSession = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    title: title || 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  saveChatSession(session);
  return session;
}

export function updateChatSessionTitle(id: string, title: string): void {
  const session = getChatSession(id);
  if (session) {
    session.title = title;
    saveChatSession(session);
  }
}

export async function generateChatTitle(messages: Message[]): Promise<string> {
  if (messages.length === 0) return 'New Chat';
  
  // If only 1-2 messages, use smart algorithm (faster)
  if (messages.length <= 2) {
    return generateSmartTitle(messages);
  }

  // For longer conversations, use AI to generate contextual title
  try {
    const response = await fetch('/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.title || generateSmartTitle(messages);
    }
  } catch (error) {
    console.error('[ChatHistory] Error generating AI title:', error);
  }

  // Fallback to smart algorithm
  return generateSmartTitle(messages);
}

function generateSmartTitle(messages: Message[]): string {
  if (messages.length === 0) return 'New Chat';

  // Get first user message
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  const content = firstUserMessage.content.trim();
  
  // Extract key phrases (remove common words)
  const commonWords = new Set(['what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'can', 'could', 'should', 'would', 'will', 'this', 'that', 'these', 'those', 'do', 'does', 'did', 'explain', 'tell', 'me', 'help', 'please']);
  
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !commonWords.has(w))
    .slice(0, 6);

  if (words.length === 0) {
    // Fallback: use first 40 chars
    return content.substring(0, 40).trim() || 'New Chat';
  }

  // Capitalize first letter of each word and join
  const title = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return title || content.substring(0, 40).trim() || 'New Chat';
}

export function searchChatSessions(query: string): ChatSession[] {
  const sessions = getAllChatSessions();
  const lowerQuery = query.toLowerCase();
  
  return sessions.filter(session => {
    // Search in title
    if (session.title.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in messages
    return session.messages.some(msg => 
      msg.content.toLowerCase().includes(lowerQuery)
    );
  });
}

