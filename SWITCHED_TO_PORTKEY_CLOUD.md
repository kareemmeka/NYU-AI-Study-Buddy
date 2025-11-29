# Switched to Portkey Cloud

## What Changed

✅ **Removed NYU Gateway dependency**
- No longer requires NYU network/VPN access
- No longer needs whitelisted IPs
- Works from anywhere (Vercel, local, etc.)

✅ **Now using Portkey Cloud**
- Publicly accessible: `https://api.portkey.ai/v1`
- No network restrictions
- Works immediately

## New Configuration

### Environment Variables (Updated)

In Vercel, set these:

1. **PORTKEY_API_KEY**
   - Your Portkey API key (from https://app.portkey.ai/api-keys)
   - Same as before

2. **AI_MODEL** (CHANGED)
   - **New default:** `gpt-4o` (simple format)
   - **Old format:** `@gpt-4o/gpt-4o` (only for custom gateways)
   - For Portkey cloud, use: `gpt-4o`

3. **PORTKEY_BASE_URL** (OPTIONAL)
   - **Leave empty** = Uses Portkey cloud automatically
   - Or set to: `https://api.portkey.ai/v1`
   - Only set if you want to use a custom gateway

## What You Need to Do

### Step 1: Update Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Update `AI_MODEL`:**
- **Old:** `@gpt-4o/gpt-4o`
- **New:** `gpt-4o`

**Optional - Remove or update `PORTKEY_BASE_URL`:**
- **Option 1:** Delete it (will use Portkey cloud automatically)
- **Option 2:** Set to: `https://api.portkey.ai/v1`

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click latest deployment → **"..."** → **Redeploy**
3. Turn OFF **"Use existing Build Cache"**
4. Click **Redeploy**
5. Wait 2-3 minutes

### Step 3: Test

After redeploy, test:
- `/api/test` - Should work now!
- `/api/chat` - Should work now!
- `/api/portkey-config` - Check configuration

## Benefits

✅ **No Network Restrictions**
- Works from Vercel immediately
- No VPN needed
- No IP whitelisting needed

✅ **Simpler Configuration**
- Model name: `gpt-4o` (instead of `@gpt-4o/gpt-4o`)
- No base URL needed (uses default)

✅ **More Reliable**
- Publicly accessible
- No dependency on NYU infrastructure

## Model Names

For **Portkey Cloud** (default):
- `gpt-4o` ✅
- `gpt-4` ✅
- `gpt-3.5-turbo` ✅

For **Custom Gateways** (if you set PORTKEY_BASE_URL):
- `@gpt-4o/gpt-4o` ✅
- `@openai/gpt-4o` ✅

## Verify It's Working

Visit `/api/portkey-config` - it should show:
```json
{
  "configuration": {
    "baseURL": {
      "value": "https://api.portkey.ai/v1",
      "note": "Using Portkey cloud by default"
    },
    "model": {
      "value": "gpt-4o",
      "matches": true
    }
  },
  "testResult": {
    "success": true,
    "message": "test"
  }
}
```

## If You Still Want NYU Gateway

If you need to use NYU gateway later:
1. Set `PORTKEY_BASE_URL = https://ai-gateway.apps.cloud.rt.nyu.edu/v1`
2. Set `AI_MODEL = @gpt-4o/gpt-4o`
3. Contact NYU IT to whitelist Vercel IPs

But for now, Portkey cloud should work immediately!

