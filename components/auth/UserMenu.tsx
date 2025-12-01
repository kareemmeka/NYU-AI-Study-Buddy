"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogIn, Settings, LogOut, ChevronDown } from 'lucide-react';
import { User as UserType } from '@/types';
import { signOut } from '@/lib/user-auth';
import { toast } from '@/components/ui/toast';

interface UserMenuProps {
  user: UserType | null;
  onSignInClick: () => void;
  onProfileClick: () => void;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignInClick, onProfileClick, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    onSignOut();
    setIsOpen(false);
    toast({ title: 'Signed Out', description: 'You have been signed out', variant: 'success' });
  };

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignInClick}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-purple-50 dark:hover:bg-purple-950/20"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden md:inline">Sign In</span>
      </Button>
    );
  }

  // Get initials from name
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-[#57068C] text-white flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          
          <div className="p-1">
            <button
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-md transition-colors"
            >
              <Settings className="h-4 w-4" />
              Profile & Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

