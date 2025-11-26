# How to Verify Environment Variables in Vercel

## The Problem
"Vercel is not even know the api key from portkey" - This means environment variables aren't being read.

## Step-by-Step Verification

### Step 1: Check Environment Variables in Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Click your project: **NYU-AI-Study-Buddy**
3. Go to: **Settings** → **Environment Variables**
4. **Check each variable:**

#### Variable 1: PORTKEY_API_KEY
- **Name:** `PORTKEY_API_KEY` (exact spelling, case-sensitive)
- **Value:** `3QNI3x+PPoiQlnL5Jh348nMmUtz8`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 2: PORTKEY_BASE_URL
- **Name:** `PORTKEY_BASE_URL`
- **Value:** `https://ai-gateway.apps.cloud.rt.nyu.edu/v1`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 3: AI_MODEL
- **Name:** `AI_MODEL`
- **Value:** `@gpt-4o/gpt-4o`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 4: Files_READ_WRITE_TOKEN
- **Name:** `Files_READ_WRITE_TOKEN` (exact spelling)
- **Value:** `vercel_blob_rw_SQrULv5f505YfLOW_osTffHgOi4prYyTIEoFKOooYxxYrFu`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 5: NEXT_PUBLIC_APP_URL
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://nyu-ai-study-buddy-eugo02n15-kareem-elsenosys-projects.vercel.app`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Step 2: After Adding/Updating Variables

**CRITICAL:** You MUST redeploy after adding variables!

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"..."** (three dots) → **Redeploy**
4. Select **"Use existing Build Cache"** = OFF (to ensure fresh build)
5. Click **Redeploy**
6. Wait 2-3 minutes

### Step 3: Test Environment Variables

After redeploy, visit:

```
https://nyu-ai-study-buddy-eugo02n15-kareem-elsenosys-projects.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "envCheck": {
    "hasPortkeyKey": true,
    "portkeyKeyLength": 32,
    "portkeyKeyPrefix": "3QNI3x+PPo",
    "hasPortkeyBaseUrl": true,
    "portkeyBaseUrl": "https://ai-gateway.apps.cloud.rt.nyu.edu/v1",
    "hasAiModel": true,
    "aiModel": "@gpt-4o/gpt-4o",
    "hasBlobToken": true,
    "blobTokenPrefix": "vercel_blob_rw_SQrU",
    "hasAppUrl": true
  }
}
```

**If any show `false` or `"not set"`:**
- That variable is missing or incorrect
- Go back to Step 1 and verify it's added correctly
- Make sure it's set for ALL environments
- Redeploy again

### Step 4: Test Portkey Connection

Visit:
```
https://nyu-ai-study-buddy-eugo02n15-kareem-elsenosys-projects.vercel.app/api/test
```

**Expected (Success):**
```json
{
  "success": true,
  "message": "Hello",
  "model": "@gpt-4o/gpt-4o"
}
```

**If Error:**
- Check the error message
- Verify `PORTKEY_API_KEY` is correct
- Verify `PORTKEY_BASE_URL` matches your gateway
- Verify `AI_MODEL` is `@gpt-4o/gpt-4o`

## Common Mistakes

### ❌ Wrong Variable Names
- `PORTKEY_API_KEY` not `portkey_api_key` (case-sensitive!)
- `Files_READ_WRITE_TOKEN` not `BLOB_READ_WRITE_TOKEN` (unless you set both)

### ❌ Not Set for All Environments
- Must set for: Production, Preview, AND Development
- If only set for Production, Preview deployments won't work

### ❌ Forgot to Redeploy
- Variables added but not redeployed = variables not available
- **Always redeploy after adding/updating variables**

### ❌ Extra Spaces
- `PORTKEY_API_KEY = value` ❌ (space around =)
- `PORTKEY_API_KEY=value` ✅ (no spaces)

### ❌ Quotes Around Values
- `PORTKEY_API_KEY="value"` ❌ (don't use quotes)
- `PORTKEY_API_KEY=value` ✅ (no quotes)

## Quick Fix Checklist

1. [ ] Go to Vercel → Settings → Environment Variables
2. [ ] Verify all 5 variables exist
3. [ ] Check each is set for Production, Preview, Development
4. [ ] Verify no extra spaces or quotes
5. [ ] Verify exact spelling (case-sensitive)
6. [ ] **Redeploy** the project
7. [ ] Wait 2-3 minutes
8. [ ] Test `/api/health` endpoint
9. [ ] Test `/api/test` endpoint
10. [ ] If still not working, check Vercel function logs

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Deployments → Latest → Functions tab
   - Look for errors in `/api/chat` or `/api/test`

2. **Verify Variable Values:**
   - Copy values exactly (no typos)
   - Check for hidden characters

3. **Try Manual Redeploy:**
   - Deployments → "..." → Redeploy
   - Make sure "Use existing Build Cache" is OFF

4. **Check Variable Names:**
   - Must match exactly: `PORTKEY_API_KEY` (not `PORTKEY_API_KEY ` with space)

