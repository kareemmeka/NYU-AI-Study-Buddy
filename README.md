# AI Study Buddy - CPE Course Assistant

A production-ready web application that helps NYU Abu Dhabi students with their CPE course materials. Upload your course files (PDF, PPTX, DOCX, XLSX, TXT) and get instant AI-powered answers to your questions.

## 🚀 Features

- **Multi-format File Support**: Upload and process PDF, PowerPoint, Word, Excel, and text files
- **AI-Powered Chat**: Get instant answers based on your uploaded course materials
- **Streaming Responses**: Real-time AI responses with smooth streaming
- **Beautiful UI**: Modern, responsive design with dark mode support
- **File Management**: Easy upload, view, and delete course materials
- **Smart Context**: Automatically finds relevant sections from course materials
- **Mobile Responsive**: Works perfectly on all devices

## 📋 Prerequisites

- Node.js 18+ and npm
- Portkey AI account with API key
- Vercel account (for deployment)
- Vercel Blob storage (for file storage)

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd ai-study-buddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local` and add your keys:**
   ```env
   PORTKEY_API_KEY=your_portkey_api_key_here
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🔑 Getting API Keys

### Portkey API Key

1. Go to [Portkey Dashboard](https://app.portkey.ai)
2. Sign in or create an account
3. Set up a Virtual Key with OpenAI provider
4. Copy the Virtual Key API key
5. Add it to `.env.local` as `PORTKEY_API_KEY`

See `PORTKEY_DETAILED_SETUP.md` for detailed instructions.

### Vercel Blob Storage Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (or create one)
3. Go to Storage → Create Database → Blob
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to `.env.local` as `BLOB_READ_WRITE_TOKEN`

## 🏃 Local Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test the application:**
   - Upload some course files (PDF, PPTX, etc.)
   - Ask questions about the uploaded materials
   - Try the example questions

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add `PORTKEY_API_KEY`
   - Add `BLOB_READ_WRITE_TOKEN`
   - Add `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in project settings
4. Deploy automatically on every push

## 📁 Project Structure

```
ai-study-buddy/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint with streaming
│   │   ├── upload/       # File upload endpoint
│   │   └── files/        # File management endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   ├── chat/             # Chat components
│   ├── files/            # File management components
│   └── ui/               # UI components (Shadcn)
├── lib/
│   ├── file-extractors/  # File text extraction
│   ├── portkey.ts        # Portkey AI client
│   ├── storage.ts        # Vercel Blob storage
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## 🔧 Configuration

### File Size Limits

- Maximum file size: 50MB per file
- Maximum files per upload: 10 files

### AI Model

- Default model: `gpt-4o`
- Can be changed in `app/api/chat/route.ts`

### Context Length

- Maximum context: 100,000 characters
- Adjustable in `app/api/chat/route.ts`

## 🐛 Troubleshooting

### Portkey API Errors

- **403 Forbidden**: Check that your Virtual Key has a Provider and Model configured
- **401 Invalid Key**: Verify your `PORTKEY_API_KEY` in `.env.local`
- See `PORTKEY_DETAILED_SETUP.md` for detailed troubleshooting

### File Upload Issues

- **File too large**: Maximum is 50MB per file
- **Invalid file type**: Only PDF, PPTX, DOCX, XLSX, TXT are supported
- **Upload fails**: Check `BLOB_READ_WRITE_TOKEN` is correct

### Build Errors

- **Type errors**: Run `npm run build` to see detailed errors
- **Missing dependencies**: Run `npm install` again
- **Port errors**: Make sure port 3000 is available

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORTKEY_API_KEY` | Your Portkey Virtual Key API key | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for production) | Yes |

## 🎨 Customization

### Change AI Model

Edit `app/api/chat/route.ts`:
```typescript
model: 'gpt-3.5-turbo', // Change from 'gpt-4o'
```

### Modify System Prompt

Edit `lib/portkey.ts`:
```typescript
export const SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Adjust File Limits

Edit `app/api/upload/route.ts`:
```typescript
const MAX_FILES = 20; // Change from 10
const MAX_FILE_SIZE = 100 * 1024 * 1024; // Change from 50MB
```

## 🔒 Security

- API keys are never exposed to the client
- File uploads are validated and sanitized
- Rate limiting recommended for production
- CORS configured for production domains

## 📄 License

This project is for educational purposes at NYU Abu Dhabi.

## 🤝 Contributing

This is a course project. For improvements, please contact the course instructor.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review `PORTKEY_DETAILED_SETUP.md` for Portkey setup
3. Contact your course instructor

## 🎓 Credits

- Built for NYU Abu Dhabi CPE Course
- Professor: Mohamed Eid
- AI Powered by Portkey AI and OpenAI

---

**Happy Studying! 📚**


