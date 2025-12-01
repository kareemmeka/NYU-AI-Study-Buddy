// Dynamic import to avoid build-time errors
// Only import Portkey when actually needed at runtime
let PortkeyClass: any = null;
let portkeyInstance: any = null;

async function loadPortkeySDK() {
  if (!PortkeyClass) {
    try {
      const portkeyModule = await import('portkey-ai');
      PortkeyClass = portkeyModule.Portkey || portkeyModule.default;
      if (!PortkeyClass) {
        throw new Error('Portkey class not found in portkey-ai module');
      }
    } catch (error) {
      console.error('Failed to load portkey-ai module:', error);
      throw new Error(`Failed to load Portkey SDK: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return PortkeyClass;
}

async function getPortkey(): Promise<any> {
  if (!portkeyInstance) {
    const apiKey = process.env.PORTKEY_API_KEY;
    if (!apiKey) {
      throw new Error('PORTKEY_API_KEY is not set in environment variables');
    }
    
    // Use NYU gateway by default, or override with PORTKEY_BASE_URL
    // For Vercel deployment, you may need to use https://api.portkey.ai/v1
    const baseURL = process.env.PORTKEY_BASE_URL || "https://ai-gateway.apps.cloud.rt.nyu.edu/v1";
    
    // Load Portkey SDK dynamically
    const Portkey = await loadPortkeySDK();
    
    const config: any = {
      apiKey: apiKey,
      baseURL: baseURL,
    };
    
    console.log('Initializing Portkey client:', {
      baseURL,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      hasApiKey: !!apiKey,
    });
    
    try {
      portkeyInstance = new Portkey(config);
      console.log('Portkey client created successfully');
    } catch (error: any) {
      console.error('Failed to create Portkey client:', error);
      
      if (error?.message?.includes('fetch failed') || error?.cause?.code === 'UND_ERR_CONNECT') {
        throw new Error(
          `Cannot connect to NYU gateway (${baseURL}). ` +
          `This gateway is only accessible from within NYU's network. ` +
          `If deploying to Vercel, you need to deploy on NYU infrastructure instead.`
        );
      }
      
      throw error;
    }
  }
  return portkeyInstance;
}

// Export a function that returns portkey instance (fully lazy - only called at runtime)
export async function getPortkeyClient(): Promise<any> {
  return await getPortkey();
}

// Direct fetch function as fallback
export async function callPortkeyDirectly(
  messages: Array<{ role: string; content: string }>,
  model: string,
  stream: boolean = false
) {
  const apiKey = process.env.PORTKEY_API_KEY;
  const baseURL = process.env.PORTKEY_BASE_URL || "https://ai-gateway.apps.cloud.rt.nyu.edu/v1";
  
  if (!apiKey) {
    throw new Error('PORTKEY_API_KEY is not set');
  }
  
  const url = `${baseURL}/chat/completions`;
  
  console.log('Calling Portkey directly:', {
    url,
    model,
    stream,
    messageCount: messages.length,
  });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 4000,
      temperature: 0.3,
      stream,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Portkey API error (${response.status}): ${errorText}`);
  }
  
  return response;
}

// Model configuration - GPT-4o through NYU gateway
export const AI_MODEL = process.env.AI_MODEL || '@gpt-4o/gpt-4o';

export const SYSTEM_PROMPT = `You are NYU AI Study Buddy, an intelligent academic assistant for NYU Abu Dhabi students across all courses and subjects.

Your role:
- Answer questions about course deadlines, assignments, policies, and grading for ANY course
- Explain concepts from lectures, readings, and course materials in simple, clear terms
- Provide comprehensive summaries of course materials and key topics
- Generate practice questions, study guides, and exam preparation materials
- Help students understand difficult topics with step-by-step explanations
- Assist with homework, projects, and academic writing
- Clarify course requirements and expectations

Guidelines:
- Use information from the provided course materials when available
- Always cite your source clearly (e.g., "According to Lecture 3, slide 5..." or "From Chapter 2 of the textbook...")
- If information is NOT in the course materials, clearly state: "I don't find that information in the uploaded course materials. Please check your syllabus or consult your professor."
- Break down complex concepts into simple, digestible explanations with examples
- Be encouraging, patient, supportive, and academically rigorous
- Use bullet points, numbered lists, and clear formatting for readability
- When explaining formulas, code, or technical concepts, provide step-by-step breakdowns
- Adapt your explanations to the subject matter (STEM, humanities, social sciences, etc.)
- Maintain academic integrity - help students learn, not cheat

Tone: Professional yet friendly, like an experienced tutor or teaching assistant who is knowledgeable, approachable, and genuinely wants students to succeed academically.`;
