# 🚀 Quick Start - See Your Website

## Step 1: Install Dependencies

Open terminal in the `ai-study-buddy` folder and run:

```bash
npm install
```

This will install all required packages (takes 1-2 minutes).

## Step 2: Create Environment File

Create a file called `.env.local` in the `ai-study-buddy` folder with:

```env
PORTKEY_API_KEY=your_portkey_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** For now, you can use placeholder values to see the UI:
```env
PORTKEY_API_KEY=placeholder
BLOB_READ_WRITE_TOKEN=placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The website will load, but chat won't work until you add real API keys.

## Step 3: Start Development Server

Run this command:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## Step 4: Open in Browser

Open your web browser and go to:

**http://localhost:3000**

You should see the AI Study Buddy website! 🎉

## To Stop the Server

Press `Ctrl + C` in the terminal.

---

## Troubleshooting

### "Command not found: npm"
- Install Node.js from https://nodejs.org (version 18 or higher)

### "Port 3000 already in use"
- Change the port: `npm run dev -- -p 3001`
- Or close the other application using port 3000

### "Module not found"
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

### Website shows errors
- Check that all files are in the correct folders
- Make sure `.env.local` exists (even with placeholder values)
- Check the terminal for error messages


