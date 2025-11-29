# How to Trigger Manual Deployment in Vercel

## Why Deployment Might Not Run Automatically

Sometimes Vercel doesn't automatically deploy after a git push. This can happen if:
- There's a delay in webhook processing
- The webhook wasn't triggered
- Vercel is waiting for a specific condition

## How to Trigger Manual Deployment

### Method 1: Redeploy from Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: **NYU-AI-Study-Buddy**

2. **Go to Deployments Tab:**
   - Click on **"Deployments"** tab at the top

3. **Find Latest Deployment:**
   - Look for the most recent deployment (should show the latest commit)
   - Click on the **three dots (...)** menu on the right

4. **Click "Redeploy":**
   - Select **"Redeploy"** from the dropdown menu
   - **IMPORTANT:** Turn OFF **"Use existing Build Cache"**
   - Click **"Redeploy"** button

5. **Wait for Build:**
   - Watch the build progress
   - Should take 2-3 minutes
   - Status will change from "Building" → "Ready"

### Method 2: Create Empty Commit to Trigger

If redeploy doesn't work, create a new commit:

```bash
cd ai-study-buddy
git commit --allow-empty -m "Trigger deployment"
git push
```

This creates an empty commit that will trigger Vercel's webhook.

### Method 3: Use Vercel CLI (If Installed)

```bash
vercel --prod
```

## Check Deployment Status

After triggering:

1. **Watch Build Logs:**
   - Click on the deployment
   - Click **"Build Logs"** tab
   - Watch for any errors

2. **Check Function Logs:**
   - Click **"Functions"** tab
   - Check if routes are listed

3. **Test Endpoints:**
   - After deployment completes, test:
     - `/api/health`
     - `/api/test`
     - `/api/chat`

## Troubleshooting

### If Redeploy Button is Disabled:
- Make sure you're on the latest commit
- Try Method 2 (empty commit)

### If Build Fails:
- Check build logs for errors
- Verify environment variables are set
- Check for TypeScript/compilation errors

### If Deployment Shows "Ready" but Endpoints Don't Work:
- Check environment variables are set correctly
- Verify they're set for Production environment
- Check function logs for runtime errors

## Quick Steps Summary

1. Vercel Dashboard → Your Project
2. Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Turn OFF "Use existing Build Cache"
6. Click "Redeploy"
7. Wait 2-3 minutes
8. Test endpoints

