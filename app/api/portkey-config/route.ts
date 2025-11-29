import { NextRequest, NextResponse } from 'next/server';

// Prevent this route from being pre-rendered during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// This endpoint shows the EXACT configuration being used for Portkey
// Use this to verify your API key and model are correct
export async function GET(req: NextRequest) {
  const apiKey = process.env.PORTKEY_API_KEY;
  // Use Portkey cloud by default (publicly accessible)
  const baseURL = process.env.PORTKEY_BASE_URL || "https://api.portkey.ai/v1";
  const model = process.env.AI_MODEL || 'gpt-4o'; // Portkey cloud uses simpler model names
  
  // Show what we're using
  const config = {
    apiKey: {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      preview: apiKey ? `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT SET',
      expectedFormat: 'Should be your Portkey Virtual Key API key',
      yourValue: apiKey || 'NOT SET',
    },
    baseURL: {
      value: baseURL,
      expected: 'https://api.portkey.ai/v1 (Portkey cloud - publicly accessible)',
      matches: baseURL === 'https://api.portkey.ai/v1' || !baseURL,
      note: 'Using Portkey cloud by default (no NYU gateway needed)',
    },
    model: {
      value: model,
      expected: 'gpt-4o (or @gpt-4o/gpt-4o for custom gateways)',
      matches: model === 'gpt-4o' || model === '@gpt-4o/gpt-4o',
      note: 'For Portkey cloud, use: gpt-4o. For custom gateways, use: @gpt-4o/gpt-4o',
    },
  };
  
  // Common mistakes
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (!apiKey) {
    issues.push('❌ PORTKEY_API_KEY is not set');
    recommendations.push('1. Go to Portkey Dashboard → API Keys → Copy your Virtual Key');
    recommendations.push('2. In Vercel: Settings → Environment Variables → Add PORTKEY_API_KEY');
  } else if (apiKey.length < 20) {
    issues.push('⚠️ API Key seems too short (should be ~32+ characters)');
  }
  
  if (!config.baseURL.matches) {
    issues.push('⚠️ PORTKEY_BASE_URL does not match expected value');
  }
  
  if (!config.model.matches) {
    issues.push('⚠️ AI_MODEL format may be incorrect');
    recommendations.push('For Portkey cloud, use: gpt-4o');
    recommendations.push('For custom gateways, use: @gpt-4o/gpt-4o');
    recommendations.push('Check Portkey Dashboard → Models → Copy the exact model identifier');
  }
  
  // Try to test the configuration
  let testResult: any = null;
  if (apiKey && baseURL && model) {
    try {
      const testUrl = `${baseURL}/chat/completions`;
      const testResponse = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: 'Say "test" in one word' }
          ],
          max_tokens: 5,
        }),
      });
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        testResult = {
          success: true,
          message: testData.choices?.[0]?.message?.content || 'No response',
        };
      } else {
        const errorText = await testResponse.text();
        testResult = {
          success: false,
          status: testResponse.status,
          error: errorText.substring(0, 200),
        };
      }
    } catch (error) {
      testResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    configuration: config,
    issues,
    recommendations: recommendations.length > 0 ? recommendations : ['✅ Configuration looks correct!'],
    testResult,
    instructions: {
      step1: 'Go to Portkey Dashboard (https://app.portkey.ai)',
      step2: 'Copy your Virtual Key API key (from API Keys section)',
      step3: 'Go to Models section and find gpt-4o',
      step4: 'For Portkey cloud, use model: gpt-4o (simple format)',
      step5: 'In Vercel: Settings → Environment Variables',
      step6: 'Set PORTKEY_API_KEY = (your Portkey API key)',
      step7: 'Set AI_MODEL = gpt-4o (for Portkey cloud)',
      step8: 'Leave PORTKEY_BASE_URL empty (uses Portkey cloud by default)',
      step9: 'Redeploy after setting variables',
    },
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

