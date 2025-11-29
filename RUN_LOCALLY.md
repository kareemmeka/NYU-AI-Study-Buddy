# Run Application Locally

## Quick Start

### Step 1: Make Sure Environment Variables Are Set

Create or update `.env.local` file in the project root:

```env
# Portkey AI Configuration (NYU Gateway)
PORTKEY_API_KEY=3QNI3x+PPoiQlnL5Jh348nMmUtz8
PORTKEY_BASE_URL=https://ai-gateway.apps.cloud.rt.nyu.edu/v1
AI_MODEL=@vertexai/gemini-2.5-pro

# Vercel Blob Storage
Files_READ_WRITE_TOKEN=vercel_blob_rw_SQrULv5f505YfLOW_osTffHgOi4prYyTIEoFKOooYxxYrFu
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_SQrULv5f505YfLOW_osTffHgOi4prYyTIEoFKOooYxxYrFu

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Install Dependencies (if not already done)

```bash
cd ai-study-buddy
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

The app will be available at:
```
http://localhost:3000
```

## Test Endpoints Locally

Once the server is running, test these URLs:

1. **Health Check:**
   ```
   http://localhost:3000/api/health
   ```

2. **Debug (Environment Variables):**
   ```
   http://localhost:3000/api/debug
   ```

3. **Portkey Config:**
   ```
   http://localhost:3000/api/portkey-config
   ```

4. **Test Portkey Connection:**
   ```
   http://localhost:3000/api/test
   ```

5. **Main App:**
   ```
   http://localhost:3000
   ```

## Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## Troubleshooting

### Port 3000 Already in Use

If you get an error that port 3000 is in use:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Environment Variables Not Loading

1. Make sure `.env.local` file exists in the project root
2. Restart the dev server after changing `.env.local`
3. Check that variable names match exactly (case-sensitive)

### Module Errors

If you get module errors:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart server
npm run dev
```

## Current Status

✅ Server is running on: `http://localhost:3000`
✅ Health endpoint working
✅ Environment variables loaded

## Next Steps

1. Open `http://localhost:3000` in your browser
2. Test the chat interface
3. Try uploading files
4. Test the AI responses

