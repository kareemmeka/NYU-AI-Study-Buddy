"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, User, Mail, LogIn, UserPlus, Sparkles, Lock, GraduationCap } from 'lucide-react';
import { signIn, signUp } from '@/lib/user-auth';
import { toast } from '@/components/ui/toast';
import { User as UserType, UserRole } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole(null);
    }
  }, [isOpen, mode]);

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
      // Validate role selection
      if (!selectedRole) {
        toast({ 
          title: 'Role Required', 
          description: 'Please select whether you are a Student or Professor', 
          variant: 'destructive' 
        });
        setLoading(false);
        return;
      }

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
        if (!password || password.length < 6) {
          toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
          setLoading(false);
          return;
        }

        const result = signUp(name, email, password, selectedRole);
        if (result.success && result.user) {
          const firstName = result.user.name.split(' ')[0];
          toast({ 
            title: `Welcome, ${firstName}!`, 
            description: `Your ${selectedRole} account is ready. The AI will now personalize your experience!`, 
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
        if (!password) {
          toast({ title: 'Error', description: 'Please enter your password', variant: 'destructive' });
          setLoading(false);
          return;
        }

        const result = signIn(email, password);
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
            {/* Role Selection - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'student'
                      ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <GraduationCap className={`h-6 w-6 mx-auto mb-2 ${
                    selectedRole === 'student' ? 'text-[#57068C]' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedRole === 'student' ? 'text-[#57068C]' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Student
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('professor')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'professor'
                      ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${
                    selectedRole === 'professor' ? 'text-[#57068C]' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedRole === 'professor' ? 'text-[#57068C]' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Professor
                  </p>
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 pl-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#57068C] focus:ring-[#57068C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#57068C] focus:ring-[#57068C]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  className="h-12 pl-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#57068C] focus:ring-[#57068C]"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full h-12 rounded-xl bg-[#57068C] hover:bg-[#6A0BA8] text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setPassword('');
                  setSelectedRole(null);
                }}
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
