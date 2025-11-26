# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd ai-study-buddy
npm install
```

### Step 2: Set Up Environment Variables
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add:
PORTKEY_API_KEY=your_portkey_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Get Your API Keys

#### Portkey API Key:
1. Go to https://app.portkey.ai
2. Create Virtual Key with OpenAI provider
3. Copy the Virtual Key API key
4. See `PORTKEY_DETAILED_SETUP.md` for details

#### Vercel Blob Token:
1. Go to https://vercel.com/dashboard
2. Create Blob storage
3. Copy the read/write token

### Step 4: Run Development Server
```bash
npm run dev
```

### Step 5: Open Browser
Navigate to http://localhost:3000

## ✅ Testing Checklist

- [ ] Upload a PDF file
- [ ] Upload a PowerPoint file
- [ ] Ask a question about uploaded files
- [ ] Check streaming response works
- [ ] Delete a file
- [ ] Test dark mode toggle
- [ ] Test on mobile viewport

## 🐛 Common Issues

### "PORTKEY_API_KEY is not set"
- Make sure `.env.local` exists (not `.env`)
- Check the key is correct (starts with `pk-`)

### "403 Forbidden" from Portkey
- Virtual Key needs Provider and Model configured
- See `PORTKEY_DETAILED_SETUP.md`

### File upload fails
- Check `BLOB_READ_WRITE_TOKEN` is correct
- Verify file size < 50MB
- Check file type is supported

## 📦 Production Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See `README.md` for full documentation.


