# Troubleshooting AI Chat Issues

## Your Site is Live But AI Not Working?

### Step 1: Test Portkey Connection

Visit this URL to test if Portkey is working:
```
https://nyu-ai-study-buddy-eugo02n15-kareem-elsenosys-projects.vercel.app/api/test-portkey
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hello",
  "model": "@gpt-4o/gpt-4o"
}
```

**If you get an error:**
- Check environment variables in Vercel
- Verify PORTKEY_API_KEY is correct
- Check PORTKEY_BASE_URL is set

### Step 2: Check Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
```
PORTKEY_API_KEY = 3QNI3x+PPoiQlnL5Jh348nMmUtz8
PORTKEY_BASE_URL = https://ai-gateway.apps.cloud.rt.nyu.edu/v1
AI_MODEL = @gpt-4o/gpt-4o
BLOB_READ_WRITE_TOKEN = (your Vercel Blob token)
NEXT_PUBLIC_APP_URL = https://nyu-ai-study-buddy-eugo02n15-kareem-elsenosys-projects.vercel.app
```

**Important:**
- Make sure variables are added for **Production**, **Preview**, and **Development**
- After adding/updating variables, **redeploy** your project

### Step 3: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Check logs for `/api/chat` route
5. Look for error messages

### Step 4: Common Issues

#### Issue: "Blank responses"
**Possible causes:**
- Portkey API key is invalid
- Model name is wrong
- Network timeout
- Streaming response not working

**Solutions:**
1. Test Portkey connection: `/api/test-portkey`
2. Check Vercel function logs
3. Verify environment variables are set correctly
4. Try a simple question first

#### Issue: "Very slow responses"
**Possible causes:**
- Loading too many course materials
- Large files taking time to extract
- Network latency to Portkey API

**Solutions:**
1. Upload fewer files initially
2. Check file sizes (should be < 50MB each)
3. Wait for first response (subsequent ones may be faster)

#### Issue: "Error messages"
**Check the error message:**
- "PORTKEY_API_KEY is not set" → Add to Vercel env vars
- "403 Forbidden" → Check API key is correct
- "Model not found" → Check AI_MODEL is correct
- "Timeout" → File extraction taking too long

### Step 5: Quick Fixes

1. **Redeploy after adding env vars:**
   - Vercel → Project → Deployments → Click "..." → Redeploy

2. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

3. **Test with simple question:**
   - "Hello" or "What can you help me with?"

4. **Check browser console:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

### Step 6: Verify Portkey Configuration

Your Portkey setup:
- Base URL: `https://ai-gateway.apps.cloud.rt.nyu.edu/v1`
- API Key: `3QNI3x+PPoiQlnL5Jh348nMmUtz8`
- Model: `@gpt-4o/gpt-4o`

Make sure these match exactly in Vercel environment variables.

### Still Not Working?

1. Check Vercel function logs for detailed errors
2. Test the `/api/test-portkey` endpoint
3. Verify all environment variables are set
4. Try redeploying the project

