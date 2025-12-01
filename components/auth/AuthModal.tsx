"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, User, Mail, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { signIn, signUp } from '@/lib/user-auth';
import { toast } from '@/components/ui/toast';
import { User as UserType } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' });
          setLoading(false);
          return;
        }

        const result = signUp(name, email);
        if (result.success && result.user) {
          const firstName = result.user.name.split(' ')[0];
          toast({ 
            title: `Welcome, ${firstName}!`, 
            description: 'Your account is ready. The AI will now personalize your experience!', 
            variant: 'success',
            duration: 5000,
          });
          onAuthSuccess(result.user);
          onClose();
        } else {
          toast({ title: 'Error', description: result.error || 'Failed to create account', variant: 'destructive' });
        }
      } else {
        if (!email.trim() || !email.includes('@')) {
          toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' });
          setLoading(false);
          return;
        }

        const result = signIn(email);
        if (result.success && result.user) {
          const firstName = result.user.name.split(' ')[0];
          toast({ 
            title: `Welcome back, ${firstName}!`, 
            description: 'Your personalized settings are loaded.', 
            variant: 'success',
            duration: 5000,
          });
          onAuthSuccess(result.user);
          onClose();
        } else {
          toast({ title: 'Error', description: result.error || 'Failed to sign in', variant: 'destructive' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <Card 
        className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="relative h-32 bg-gradient-to-br from-[#57068C] to-purple-600 flex items-center justify-center">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute bottom-4 right-12 w-24 h-24 rounded-full bg-white/10" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 pt-5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'signin' 
                ? 'Sign in to continue your learning journey'
                : 'Join to get personalized study assistance'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 pl-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#57068C] focus:ring-[#57068C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#57068C] focus:ring-[#57068C]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#57068C] hover:bg-[#6A0BA8] text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="ml-1.5 text-[#57068C] dark:text-purple-400 font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
