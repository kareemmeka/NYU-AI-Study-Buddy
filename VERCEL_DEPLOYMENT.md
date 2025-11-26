# 🚀 Deploy to Vercel - Step by Step Guide

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository (e.g., `ai-study-buddy`)
   - Don't initialize with README (you already have one)

2. **Push your code to GitHub:**
   ```bash
   cd "/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-study-buddy.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Import to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`ai-study-buddy`)
   - Click "Import"

3. **Configure the project:**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   ```
   PORTKEY_API_KEY = 3QNI3x+PPoiQlnL5Jh348nMmUtz8
   PORTKEY_BASE_URL = https://ai-gateway.apps.cloud.rt.nyu.edu/v1
   BLOB_READ_WRITE_TOKEN = your_vercel_blob_token_here
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```

   **Important:** 
   - Add these for all environments (Production, Preview, Development)
   - You'll get `NEXT_PUBLIC_APP_URL` after first deployment

5. **Set up Vercel Blob Storage:**
   - In Vercel dashboard, go to **Storage** tab
   - Click **Create Database** → **Blob**
   - Copy the `BLOB_READ_WRITE_TOKEN`
   - Add it to environment variables

6. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-app.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd "/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy"
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default)
- Directory? (Press Enter for `./`)
- Override settings? **No**

### Step 4: Add Environment Variables

```bash
vercel env add PORTKEY_API_KEY
# Paste: 3QNI3x+PPoiQlnL5Jh348nMmUtz8
# Select: Production, Preview, Development

vercel env add PORTKEY_BASE_URL
# Paste: https://ai-gateway.apps.cloud.rt.nyu.edu/v1
# Select: Production, Preview, Development

vercel env add BLOB_READ_WRITE_TOKEN
# Paste your Vercel Blob token
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_APP_URL
# Will be set automatically after first deploy
```

### Step 5: Redeploy

```bash
vercel --prod
```

---

## 🔧 Setting Up Vercel Blob Storage

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **Storage** tab
   - Click **Create Database**
   - Select **Blob**
   - Give it a name (e.g., `study-buddy-files`)
   - Click **Create**

2. **Get the Token:**
   - After creation, you'll see connection details
   - Copy the `BLOB_READ_WRITE_TOKEN`
   - Add it to your environment variables

---

## ✅ After Deployment

1. **Your site will be live at:**
   - `https://your-project-name.vercel.app`

2. **Update NEXT_PUBLIC_APP_URL:**
   - Go to Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
   - Redeploy (or it will auto-redeploy on next push)

3. **Test your deployment:**
   - Visit your Vercel URL
   - Try uploading a file
   - Test the chat functionality

---

## 🔄 Updating Your Deployment

### Option 1: Automatic (via GitHub)
- Push changes to GitHub
- Vercel automatically redeploys

### Option 2: Manual (via CLI)
```bash
vercel --prod
```

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure all environment variables are set
- Verify `package.json` has all dependencies

### Environment Variables Not Working
- Make sure variables are added for all environments
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Blob Storage Errors
- Verify `BLOB_READ_WRITE_TOKEN` is correct
- Check Blob storage is created in Vercel
- Make sure token has read/write permissions

### Portkey API Errors
- Verify `PORTKEY_API_KEY` is correct
- Check `PORTKEY_BASE_URL` is set correctly
- Test API key locally first

---

## 📝 Quick Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Environment variables ready:
  - [ ] PORTKEY_API_KEY
  - [ ] PORTKEY_BASE_URL
  - [ ] BLOB_READ_WRITE_TOKEN
  - [ ] NEXT_PUBLIC_APP_URL (will be set after deploy)
- [ ] Vercel Blob storage created
- [ ] All dependencies in package.json

After deploying:
- [ ] Site is accessible
- [ ] Environment variables added
- [ ] NEXT_PUBLIC_APP_URL updated
- [ ] Test file upload
- [ ] Test chat functionality

---

## 🎉 You're Done!

Your AI Study Buddy is now live on Vercel! Share the URL with your students.

