"use client";

import { Upload, MessageSquare, Sparkles, FileText, Zap, Target, ArrowRight, GraduationCap, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeSectionProps {
  onGetStarted?: () => void;
}

export function WelcomeSection({ onGetStarted }: WelcomeSectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#57068C] to-purple-600 shadow-2xl shadow-purple-500/30 mb-2">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Your AI-Powered
            <span className="block text-[#57068C] dark:text-purple-400">Study Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your course materials and get instant, intelligent answers. Powered by advanced AI to help you succeed at NYU.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={onGetStarted} 
            size="lg"
            className="h-14 px-8 text-base bg-[#57068C] hover:bg-[#6A0BA8] text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Materials
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('go-to-chat'));
              }
            }}
            className="h-14 px-8 text-base border-2 border-gray-200 dark:border-gray-700 hover:border-[#57068C] dark:hover:border-purple-500 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Chatting
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-transparent to-blue-100/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-3xl" />
        <Card className="relative p-8 md:p-10 border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#57068C] to-purple-600 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Upload', desc: 'Drop your PDFs, slides, and documents. We support all major formats.' },
              { num: 2, title: 'Ask', desc: 'Type any question about your course materials naturally.' },
              { num: 3, title: 'Learn', desc: 'Get accurate, cited answers from your own materials.' },
            ].map((step) => (
              <div key={step.num} className="group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-[#57068C] group-hover:bg-[#57068C] group-hover:text-white transition-all duration-300">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed pl-16">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: FileText, title: 'Multi-Format', desc: 'PDF, PPTX, DOCX, XLSX, and TXT files' },
          { icon: Zap, title: 'Instant Answers', desc: 'Get responses in seconds' },
          { icon: Brain, title: 'Smart Memory', desc: 'Remembers your learning style' },
          { icon: GraduationCap, title: 'NYU Focused', desc: 'Tailored for academic success' },
        ].map((feature, i) => (
          <Card 
            key={i} 
            className="p-6 border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 group-hover:bg-[#57068C] transition-colors duration-300">
              <feature.icon className="h-6 w-6 text-[#57068C] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center py-8">
        <Card className="inline-flex items-center gap-6 px-8 py-6 border-0 bg-gradient-to-r from-[#57068C] to-purple-600 text-white rounded-2xl shadow-xl shadow-purple-500/30">
          <div className="text-left">
            <h3 className="text-xl font-semibold mb-1">Ready to ace your courses?</h3>
            <p className="text-purple-200">Upload your first material and start learning smarter</p>
          </div>
          <Button 
            onClick={onGetStarted}
            variant="secondary"
            className="h-12 px-6 bg-white hover:bg-gray-100 text-[#57068C] rounded-xl font-semibold shadow-lg"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
