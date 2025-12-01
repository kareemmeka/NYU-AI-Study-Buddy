import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// This endpoint tests your Portkey configuration
export async function GET(req: NextRequest) {
  const apiKey = process.env.PORTKEY_API_KEY;
  // Default to Portkey's public cloud (works from anywhere)
  const baseURL = process.env.PORTKEY_BASE_URL || "https://api.portkey.ai/v1";
  const model = process.env.AI_MODEL || '@gpt-4o/gpt-4o';
  
  const config = {
    provider: 'Portkey AI Gateway',
    apiKey: {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      preview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET',
    },
    baseURL: {
      value: baseURL,
      isPublicCloud: baseURL.includes('api.portkey.ai'),
      isNYUGateway: baseURL.includes('nyu.edu'),
      note: baseURL.includes('api.portkey.ai') 
        ? '✅ Using Portkey Public Cloud (works from Vercel)' 
        : baseURL.includes('nyu.edu')
        ? '⚠️ Using NYU Gateway (only works from NYU network)'
        : 'Custom gateway',
    },
    model: {
      value: model,
      note: 'GPT-4o through Portkey',
    },
  };
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (!apiKey) {
    issues.push('❌ PORTKEY_API_KEY is not set');
    recommendations.push('Add your NYU Portkey API key to Vercel environment variables');
  }
  
  if (baseURL.includes('nyu.edu')) {
    issues.push('⚠️ NYU Gateway is only accessible from NYU network');
    recommendations.push('Change PORTKEY_BASE_URL to https://api.portkey.ai/v1 for Vercel deployment');
  }
  
  // Test the connection
  let testResult: any = null;
  if (apiKey) {
    try {
      const testResponse = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Say "working" in one word' }],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(15000),
      });
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        testResult = {
          success: true,
          message: data.choices?.[0]?.message?.content || 'Response received',
          model: data.model,
        };
      } else {
        const errorText = await testResponse.text();
        testResult = {
          success: false,
          status: testResponse.status,
          error: errorText.substring(0, 300),
        };
        
        if (testResponse.status === 401) {
          issues.push('❌ Invalid API key or unauthorized');
          recommendations.push('Check that your API key is correct');
        } else if (testResponse.status === 404) {
          issues.push('❌ Model or endpoint not found');
          recommendations.push('Verify the model name and base URL');
        }
      }
    } catch (error: any) {
      testResult = {
        success: false,
        error: error?.message || String(error),
      };
      
      if (error?.message?.includes('fetch failed') || error?.name === 'AbortError') {
        issues.push('❌ Cannot connect to gateway');
        if (baseURL.includes('nyu.edu')) {
          recommendations.push('NYU gateway requires NYU network access');
          recommendations.push('Try setting PORTKEY_BASE_URL=https://api.portkey.ai/v1');
        }
      }
    }
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    configuration: config,
    issues: issues.length > 0 ? issues : ['✅ No issues detected'],
    recommendations: recommendations.length > 0 ? recommendations : ['✅ Ready to use!'],
    testResult,
    howToFix: {
      forVercel: {
        step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
        step2: 'Add: PORTKEY_API_KEY = your-nyu-portkey-key',
        step3: 'Add: PORTKEY_BASE_URL = https://api.portkey.ai/v1',
        step4: 'Add: AI_MODEL = @gpt-4o/gpt-4o',
        step5: 'Redeploy your application',
      },
      note: 'If your NYU key does not work with api.portkey.ai, you need to deploy on NYU infrastructure instead of Vercel.',
    },
  });
}
