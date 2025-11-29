import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NYU AI Study Buddy - Your Intelligent Academic Assistant",
  description: "AI-powered study assistant for all NYU Abu Dhabi courses. Upload course materials and get instant answers, explanations, and study support.",
  keywords: ["NYU", "AI Study Buddy", "NYU Abu Dhabi", "Education", "Academic Assistant", "Study Helper", "AI Tutor"],
  authors: [{ name: "NYU Abu Dhabi" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

