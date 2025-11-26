# How to Set Up Vercel Blob Storage

## The Error: "Please provide a valid token"

This means `BLOB_READ_WRITE_TOKEN` is not set in your Vercel environment variables.

## Step-by-Step Setup

### Step 1: Create Blob Storage in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project: **NYU-AI-Study-Buddy**
3. Click on the **Storage** tab (in the top navigation)
4. Click **Create Database**
5. Select **Blob** from the options
6. Give it a name (e.g., "study-buddy-files")
7. Select a region (choose closest to your users)
8. Click **Create**

### Step 2: Get the Token

After creating the Blob storage:

1. Click on your newly created Blob storage
2. Go to the **Settings** tab
3. Look for **Connection Details** or **Environment Variables**
4. Find `BLOB_READ_WRITE_TOKEN`
5. **Copy the token** (it's a long string)

### Step 3: Add to Environment Variables

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: (paste the token you copied)
   - **Environment**: Select **Production**, **Preview**, and **Development**
4. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **..."** (three dots) → **Redeploy**
4. Or push a new commit to trigger auto-deploy

## Alternative: Quick Setup via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Link to your project
vercel link

# Add the token
vercel env add BLOB_READ_WRITE_TOKEN
# Paste your token when prompted
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

## Verify It's Working

After adding the token and redeploying:

1. Go to your website
2. Try uploading a file
3. It should work now!

## Troubleshooting

### "Token is invalid"
- Make sure you copied the entire token
- Check for extra spaces
- Verify the token is from the correct Blob storage

### "Storage not found"
- Make sure Blob storage is created in the same Vercel project
- Check the storage name matches

### Still not working?
1. Double-check environment variables in Vercel
2. Make sure you selected all environments (Production, Preview, Development)
3. Redeploy after adding variables
4. Check Vercel function logs for detailed errors

