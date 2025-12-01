"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Trash2, LogOut, RefreshCw, Download, X } from 'lucide-react';

export type ConfirmModalType = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmModalType;
  icon?: 'trash' | 'logout' | 'refresh' | 'download' | 'warning';
}

const iconMap = {
  trash: Trash2,
  logout: LogOut,
  refresh: RefreshCw,
  download: Download,
  warning: AlertTriangle,
};

const typeStyles = {
  danger: {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    buttonVariant: 'destructive' as const,
  },
  warning: {
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    buttonVariant: 'default' as const,
  },
  info: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    buttonVariant: 'default' as const,
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  icon = 'warning',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const Icon = iconMap[icon];
  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl border-0 overflow-hidden">
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className={`w-14 h-14 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto`}>
              <Icon className={`h-7 w-7 ${styles.iconColor}`} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button
                variant={styles.buttonVariant}
                className="flex-1 h-11"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

