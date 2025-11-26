# GitHub Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ai-study-buddy` (or any name you prefer)
3. Description: "AI Study Buddy for NYU Abu Dhabi CPE Course"
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd "/Users/kareemelsenosy/Documents/HBCTL Project/ai-study-buddy"
git remote add origin https://github.com/kareememka/ai-study-buddy.git
git push -u origin main
```

**Note:** Replace `ai-study-buddy` with your actual repository name if different.

## Alternative: If Repository Already Exists

If you already created the repo, just run:

```bash
git remote add origin https://github.com/kareememka/YOUR_REPO_NAME.git
git push -u origin main
```

## Authentication

If GitHub asks for authentication:
- Use a **Personal Access Token** (not password)
- Create one at: https://github.com/settings/tokens
- Select scope: `repo` (full control of private repositories)
- Copy the token and use it as password when pushing

## After Pushing

Your code will be on GitHub at:
`https://github.com/kareememka/ai-study-buddy`

Then you can deploy to Vercel by importing from GitHub!

