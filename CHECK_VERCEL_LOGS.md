# How to Check Vercel Logs for 404 Errors

## Step 1: Access Vercel Function Logs

1. Go to: **https://vercel.com/dashboard**
2. Click your project: **NYU-AI-Study-Buddy**
3. Go to: **Deployments** tab
4. Click on the **latest deployment**
5. Click: **Functions** tab
6. Look for: `/api/chat` or `/api/test`

## Step 2: Check the Error Details

In the logs, look for:
- **404 errors** - "page not found"
- **URL being called** - What endpoint is being hit?
- **Error messages** - Full error details

## Step 3: Common 404 Causes

### Issue: Wrong Base URL
**Error:** `404 - https://ai-gateway.apps.cloud.rt.nyu.edu/v1/chat/completions`

**Possible fixes:**
1. Try without `/v1`: `https://ai-gateway.apps.cloud.rt.nyu.edu`
2. Check with NYU IT for correct URL
3. Verify the gateway is accessible

### Issue: Wrong Endpoint Path
**Error:** `404 - /chat/completions not found`

**Possible fixes:**
1. Check if NYU gateway uses different endpoint
2. Verify Portkey SDK is compatible with NYU gateway
3. May need to use direct fetch instead of Portkey SDK

### Issue: API Key Not Valid for Gateway
**Error:** `404` or `403`

**Possible fixes:**
1. Verify API key is for NYU gateway (not Portkey cloud)
2. Check if key needs different format
3. Contact NYU IT to verify key is correct

## Step 4: What to Look For in Logs

Look for these log messages:
```
Initializing Portkey client...
Portkey config: { baseURL: '...', hasApiKey: true }
Portkey API error: 404 Not Found
```

This will tell you:
- What base URL is being used
- If API key is loaded
- What the exact error is

## Step 5: Share Logs for Help

If you need help, share:
1. The exact error message from logs
2. The URL that's being called (from logs)
3. What the `/api/test` endpoint returns
4. What the `/api/health` endpoint shows

