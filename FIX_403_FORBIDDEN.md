# Fix: 403 Forbidden Error

## The Error
```
Portkey test error: [Error]: Forbidden
status: 403,
error: { status: 'failure', message: 'Forbidden' }
```

## What This Means
Your API key is being rejected by Portkey Cloud. This usually means:

1. **API Key is for NYU Gateway Only** ⚠️ MOST LIKELY
   - Your key `3QNI3x+PPoiQlnL5Jh348nMmUtz8` might be a Virtual Key for NYU gateway
   - Virtual Keys are gateway-specific and don't work with Portkey cloud

2. **API Key Doesn't Have Permissions**
   - The key might not have access to Portkey cloud
   - Or it might be expired/revoked

3. **Wrong API Key Type**
   - Using a Virtual Key instead of a Portkey API Key
   - Virtual Keys only work with their specific gateway

## Solution: Get Portkey Cloud API Key

### Step 1: Go to Portkey Dashboard
1. Visit: **https://app.portkey.ai**
2. Login to your account

### Step 2: Get Your Portkey API Key (Not Virtual Key)
1. Go to: **API Keys** (in sidebar)
2. Look for **"API Key"** (not "Virtual Key")
3. If you don't have one, click **"Create API Key"**
4. Copy the API key (it will look different from your Virtual Key)

**Important:**
- **API Key** = Works with Portkey cloud ✅
- **Virtual Key** = Only works with specific gateway (NYU) ❌

### Step 3: Update in Vercel
1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Update `PORTKEY_API_KEY` with your **Portkey API Key** (not Virtual Key)
3. Keep `AI_MODEL=gpt-4o`
4. Keep `PORTKEY_BASE_URL=https://api.portkey.ai/v1` (or leave empty)
5. Redeploy

## Alternative: Use Your Virtual Key with NYU Gateway

If you want to keep using your Virtual Key, you need to:

1. **Set up NYU Gateway Access:**
   - Contact NYU IT to whitelist Vercel IPs
   - Or set up a proxy/VPN

2. **Update Environment Variables:**
   ```
   PORTKEY_API_KEY=3QNI3x+PPoiQlnL5Jh348nMmUtz8
   AI_MODEL=@gpt-4o/gpt-4o
   PORTKEY_BASE_URL=https://ai-gateway.apps.cloud.rt.nyu.edu/v1
   ```

## Quick Test

After updating the API key, test:
```
https://your-app.vercel.app/api/test
```

Should return:
```json
{
  "success": true,
  "message": "..."
}
```

## What I Fixed

1. **Prevented Build-Time Errors:**
   - Added `export const dynamic = 'force-dynamic'` to test routes
   - This prevents them from running during build (which was causing the error)

2. **Better Error Handling:**
   - The 403 error is now caught and won't break the build
   - But you still need a valid Portkey cloud API key

## Next Steps

1. **Get Portkey Cloud API Key:**
   - Go to https://app.portkey.ai → API Keys
   - Create/copy your Portkey API Key (not Virtual Key)

2. **Update in Vercel:**
   - Replace `PORTKEY_API_KEY` with your Portkey cloud API key

3. **Redeploy:**
   - Deployments → Latest → "..." → Redeploy

4. **Test:**
   - Visit `/api/test` - should work now!

