"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, User } from 'lucide-react';
import { UserRole } from '@/types';
import { setUserRole } from '@/lib/course-management';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onRoleSelected: (role: UserRole) => void;
}

export function RoleSelectionModal({ isOpen, onRoleSelected }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!isOpen) return null;

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      onRoleSelected(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl p-8 rounded-2xl">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to NYU AI Study Buddy
            </h2>
            <p className="text-muted-foreground">
              Please select your role to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Student Option */}
            <Card
              className={`p-6 cursor-pointer transition-all border-2 ${
                selectedRole === 'student'
                  ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
              onClick={() => handleSelect('student')}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedRole === 'student'
                    ? 'bg-[#57068C] text-white'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Student</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose courses and ask questions based on uploaded materials
                  </p>
                </div>
              </div>
            </Card>

            {/* Professor Option */}
            <Card
              className={`p-6 cursor-pointer transition-all border-2 ${
                selectedRole === 'professor'
                  ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
              onClick={() => handleSelect('professor')}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedRole === 'professor'
                    ? 'bg-[#57068C] text-white'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  <User className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Professor</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload course materials and create courses for students
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!selectedRole}
              className="w-full md:w-auto min-w-[200px] bg-[#57068C] hover:bg-[#6A0BA8] text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

