#!/bin/bash

# Script to push AI Study Buddy to GitHub
# Replace YOUR_REPO_NAME with your actual repository name

REPO_NAME="ai-study-buddy"  # Change this if your repo has a different name
GITHUB_USER="kareememka"

echo "🚀 Pushing to GitHub..."
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Add remote (if not already added)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git

# Push to GitHub
echo "Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "View your repo at: https://github.com/$GITHUB_USER/$REPO_NAME"
else
    echo ""
    echo "❌ Push failed. Make sure:"
    echo "1. Repository exists at https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "2. You have access to the repository"
    echo "3. You're authenticated (may need Personal Access Token)"
fi

