# Portkey Setup Guide - Step by Step

## The Problem
Endpoints not working - likely API key or model format issue.

## Step 1: Get Your Portkey API Key

1. Go to: **https://app.portkey.ai**
2. Login to your account
3. Go to: **API Keys** (in sidebar)
4. Find your **Virtual Key** (not the main API key)
5. Click **Copy** next to your Virtual Key
6. **This is your `PORTKEY_API_KEY`**

**Example format:**
```
3QNI3x+PPoiQlnL5Jh348nMmUtz8
```
(Should be ~32 characters, alphanumeric with possible + or -)

---

## Step 2: Get Your Model Identifier

1. In Portkey Dashboard, go to: **Models** (in sidebar)
2. Find **GPT-4o** or **gpt-4o**
3. Look for the **Model Identifier** or **Model Code**
4. **Copy the EXACT identifier**

**Common formats:**
- `@gpt-4o/gpt-4o` ✅ (Most common for NYU gateway)
- `gpt-4o` (without @ prefix)
- `@openai/gpt-4o`
- `@gpt-4o/gpt-4o-2024-08-06`

**IMPORTANT:** Copy the EXACT format shown in Portkey dashboard!

---

## Step 3: Verify Your Configuration

After setting variables in Vercel, visit:
```
https://your-app.vercel.app/api/portkey-config
```

This will show:
- ✅ Your exact API key (preview)
- ✅ Your exact model value
- ✅ Whether they match expected format
- ✅ Test result (if configuration works)

---

## Step 4: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Variable 1: PORTKEY_API_KEY
- **Name:** `PORTKEY_API_KEY` (exact, case-sensitive)
- **Value:** Paste your Virtual Key from Step 1
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variable 2: PORTKEY_BASE_URL
- **Name:** `PORTKEY_BASE_URL`
- **Value:** `https://ai-gateway.apps.cloud.rt.nyu.edu/v1`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variable 3: AI_MODEL
- **Name:** `AI_MODEL`
- **Value:** Paste the EXACT model identifier from Step 2
  - Example: `@gpt-4o/gpt-4o`
  - **Must match EXACTLY what you copied from Portkey**
- **Environments:** ✅ Production ✅ Preview ✅ Development

---

## Step 5: Common Mistakes

### ❌ Wrong API Key
- Using main API key instead of Virtual Key ❌
- Using API key from wrong project ❌
- **Fix:** Use Virtual Key from Portkey Dashboard → API Keys

### ❌ Wrong Model Format
- `gpt-4o` instead of `@gpt-4o/gpt-4o` ❌
- `GPT-4o` (wrong case) ❌
- Adding extra spaces or quotes ❌
- **Fix:** Copy EXACT model identifier from Portkey Dashboard

### ❌ Wrong Variable Names
- `portkey_api_key` (lowercase) ❌
- `PORTKEY-API-KEY` (dashes) ❌
- `Portkey_Api_Key` (mixed case) ❌
- **Fix:** Use exact: `PORTKEY_API_KEY` (all uppercase, underscores)

### ❌ Not Set for All Environments
- Only set for Production ❌
- **Fix:** Must set for Production, Preview, AND Development

### ❌ Forgot to Redeploy
- Added variables but didn't redeploy ❌
- **Fix:** Always redeploy after adding/updating variables

---

## Step 6: Test Your Configuration

After setting variables and redeploying:

1. **Check configuration:**
   ```
   /api/portkey-config
   ```
   Should show your values and test result

2. **Test Portkey connection:**
   ```
   /api/test
   ```
   Should return: `{"success": true, ...}`

3. **If test fails:**
   - Check `/api/portkey-config` for specific error
   - Verify API key is correct Virtual Key
   - Verify model matches EXACTLY from Portkey dashboard
   - Check Vercel function logs for detailed error

---

## Step 7: What to Share for Help

If still not working, share:

1. **From `/api/portkey-config`:**
   - What does `configuration` show?
   - What does `testResult` show?
   - What `issues` are listed?

2. **From Portkey Dashboard:**
   - Screenshot of API Keys section (hide full key)
   - Screenshot of Models section showing model identifier

3. **From Vercel:**
   - Screenshot of Environment Variables (hide values)
   - Which environments are checked (Production/Preview/Development)

---

## Quick Checklist

- [ ] Got Virtual Key from Portkey Dashboard → API Keys
- [ ] Got model identifier from Portkey Dashboard → Models
- [ ] Set `PORTKEY_API_KEY` in Vercel (all 3 environments)
- [ ] Set `AI_MODEL` in Vercel (exact format from dashboard)
- [ ] Set `PORTKEY_BASE_URL` in Vercel
- [ ] Redeployed after setting variables
- [ ] Tested `/api/portkey-config` endpoint
- [ ] Checked test result in response

---

## Expected Results

### `/api/portkey-config` should show:
```json
{
  "configuration": {
    "apiKey": {
      "exists": true,
      "length": 32,
      "preview": "3QNI3x+PPoiQl...Utz8"
    },
    "model": {
      "value": "@gpt-4o/gpt-4o",
      "matches": true
    }
  },
  "testResult": {
    "success": true,
    "message": "test"
  }
}
```

If you see different results, follow the recommendations in the response!

