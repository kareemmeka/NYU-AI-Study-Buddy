# Fix "Access Denied" Error for Vercel Blob

## The Error
"Vercel Blob: Access denied, please provide a valid token for this resource."

## Solution

### Step 1: Verify Token in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `BLOB_READ_WRITE_TOKEN`
3. **Check the value** - make sure it matches:
   ```
   vercel_blob_rw_SQrULv5f505YfLOW_osTffHgOi4prYyTIEoFKOooYxxYrFu
   ```
4. If it's different or missing, update it

### Step 2: Verify Token Format

The token should:
- Start with `vercel_blob_rw_`
- Be the full token from your Blob storage settings
- Have no extra spaces or characters

### Step 3: Regenerate Token (If Needed)

If the token doesn't work:

1. Go to **Vercel Dashboard** → **Storage** → Your Blob storage
2. Go to **Settings** tab
3. Look for **Regenerate Token** or **Create New Token**
4. Generate a new token
5. Copy it
6. Update in Environment Variables
7. Redeploy

### Step 4: Check Environment Scope

Make sure the token is added for:
- ✅ **Production**
- ✅ **Preview**  
- ✅ **Development**

### Step 5: Verify Token in Blob Storage

1. Go to **Storage** → **nyu-ai-study-buddy-blob**
2. Go to **Settings**
3. Verify the token shown matches what's in environment variables
4. If different, use the one from Blob storage settings

### Step 6: Redeploy

After updating the token:
1. **Save** the environment variable
2. Go to **Deployments**
3. Click **..."** → **Redeploy**
4. Wait for deployment to complete

## Common Issues

### Token Mismatch
- Token in Vercel env vars ≠ Token in Blob storage
- **Fix**: Use the exact token from Blob storage settings

### Token Not Set for All Environments
- Token only in Production, missing in Preview/Development
- **Fix**: Add for all 3 environments

### Wrong Token Name
- Using `Files_READ_WRITE_TOKEN` instead of `BLOB_READ_WRITE_TOKEN`
- **Fix**: Use `BLOB_READ_WRITE_TOKEN` (our code supports both, but prefer this one)

### Token Expired/Revoked
- Token was regenerated but env var not updated
- **Fix**: Get new token from Blob storage and update env var

## Quick Test

After fixing, test by:
1. Going to your website
2. Opening file manager
3. Uploading a small test file (like a .txt file)
4. Should work without "Access denied" error

## Still Not Working?

1. Check Vercel function logs for detailed error
2. Verify token is exactly: `vercel_blob_rw_SQrULv5f505YfLOW_osTffHgOi4prYyTIEoFKOooYxxYrFu`
3. Make sure no extra spaces in the token
4. Try regenerating the token in Blob storage
5. Double-check environment variable name is `BLOB_READ_WRITE_TOKEN`

