# Push to GitHub - Instructions

Your code is ready to push! The repository is configured as:
**https://github.com/kareememka/NYU-AI-Study-Buddy**

## Option 1: Push via Terminal (Recommended)

### Step 1: Make sure repository exists
1. Go to https://github.com/kareememka/NYU-AI-Study-Buddy
2. If it doesn't exist, create it at https://github.com/new
   - Name: `NYU AI Study Buddy`
   - Don't initialize with README

### Step 2: Push the code

Run this command in your terminal:

```bash
cd "/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy"
git push -u origin main
```

### Step 3: Authenticate

When prompted:
- **Username**: `kareememka`
- **Password**: Use a **Personal Access Token** (not your GitHub password)

#### How to get Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Vercel Deployment"
4. Expiration: 90 days (or your preference)
5. Select scope: ✅ **repo** (full control)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)
8. Use this token as your password when pushing

---

## Option 2: Use GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select: `/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy`
5. Click "Publish repository"
6. Select: `kareememka/NYU-AI-Study-Buddy`

---

## Option 3: Use GitHub CLI

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Login
gh auth login

# Push
cd "/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy"
git push -u origin main
```

---

## Verify Push

After pushing, check:
- https://github.com/kareememka/NYU-AI-Study-Buddy
- You should see all your files there

---

## Next Step: Deploy to Vercel

Once code is on GitHub:
1. Go to https://vercel.com
2. Import from GitHub
3. Select `NYU-AI-Study-Buddy` repository
4. Add environment variables
5. Deploy!

See `VERCEL_DEPLOYMENT.md` for detailed Vercel instructions.

