# Fix: "fetch failed" Error

## The Error
```
AI Error: Could not instantiate the Portkey client.
CAUSE: TypeError: fetch failed
MESSAGE: undefined
```

## What This Means
The Portkey SDK is trying to connect to the NYU gateway during initialization, but the connection is failing. This is a **network connectivity issue**, not an API key issue.

## Possible Causes

### 1. **NYU Gateway Requires VPN/Network Access** ⚠️ MOST LIKELY
The NYU gateway (`https://ai-gateway.apps.cloud.rt.nyu.edu/v1`) might only be accessible from:
- NYU network
- VPN connection
- Specific IP addresses

**Vercel servers are NOT on NYU network**, so they can't reach the gateway.

**Solution:**
- Contact NYU IT to whitelist Vercel IPs
- Or use a different gateway that's publicly accessible
- Or set up a proxy/VPN

### 2. **Gateway URL is Wrong**
The base URL might be incorrect.

**Check:**
- Verify with NYU IT the correct gateway URL
- It might be: `https://ai-gateway.apps.cloud.rt.nyu.edu` (without /v1)
- Or a different URL entirely

### 3. **Gateway is Down or Unavailable**
The gateway might be temporarily unavailable.

**Check:**
- Try accessing the gateway URL directly
- Contact NYU IT to verify gateway status

### 4. **Portkey SDK Initialization Issue**
The SDK might be trying to validate the connection during initialization.

**Solution:**
- The code now uses direct fetch as fallback
- This bypasses SDK initialization issues

## What I Fixed

1. **Better Error Messages**: Now shows specific error details
2. **Direct Fetch Fallback**: If SDK fails, automatically tries direct fetch
3. **Network Error Detection**: Detects fetch/connection errors specifically

## Next Steps

### Option 1: Contact NYU IT (Recommended)
Ask them:
1. "Is the AI gateway (`https://ai-gateway.apps.cloud.rt.nyu.edu/v1`) accessible from external servers (like Vercel)?"
2. "Do I need to whitelist Vercel IP addresses?"
3. "Is there a public endpoint I should use instead?"

### Option 2: Test Gateway Connectivity
Try accessing the gateway directly:
```bash
curl https://ai-gateway.apps.cloud.rt.nyu.edu/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"@gpt-4o/gpt-4o","messages":[{"role":"user","content":"test"}]}'
```

If this fails from your local machine, the gateway requires VPN/network access.

### Option 3: Use Direct Fetch (Already Implemented)
The code now automatically falls back to direct fetch if SDK fails. This should work if:
- The gateway URL is correct
- The gateway is accessible from Vercel
- Your API key is valid

### Option 4: Check Vercel Function Logs
1. Go to Vercel Dashboard → Deployments → Latest
2. Click Functions → `/api/chat`
3. Look for error logs showing:
   - Exact error message
   - Network error details
   - What URL it's trying to reach

## Expected Behavior Now

With the fix:
1. SDK tries to initialize
2. If it fails with "fetch failed", automatically tries direct fetch
3. Direct fetch bypasses SDK initialization
4. Should work if gateway is accessible

## Test After Fix

Visit `/api/test` - it should now:
- Try SDK first
- If SDK fails, automatically use direct fetch
- Return success if gateway is accessible

## If Still Not Working

The issue is likely that **Vercel cannot reach the NYU gateway** because:
- Gateway requires VPN/network access
- Gateway only allows specific IPs
- Gateway is behind a firewall

**You need to contact NYU IT** to:
1. Whitelist Vercel IP addresses, OR
2. Get a publicly accessible gateway URL, OR
3. Set up a proxy/VPN solution

