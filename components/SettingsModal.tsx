"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, Moon, Sun, Monitor, Download, RefreshCw, Shield, Zap, 
  Keyboard, Bell, Eye, MessageSquare, Trash2, Settings
} from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { AppSettings, getSettings, saveSettings, resetSettings, downloadUserData, clearAllData } from '@/lib/settings';
import { AVAILABLE_MODELS } from '@/lib/models';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useTheme } from 'next-themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { setTheme } = useTheme();
  const [settings, setSettingsState] = useState<AppSettings>(getSettings());
  const [activeSection, setActiveSection] = useState<string>('appearance');
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [showResetSettingsConfirm, setShowResetSettingsConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettingsState(getSettings());
    }
  }, [isOpen]);

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

  const handleSaveSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveSettings(newSettings);
    setSettingsState(updated);
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
  };

  const handleClearData = () => {
    clearAllData();
    toast({ title: 'Data Cleared', description: 'All local data has been cleared', variant: 'success' });
    onClose();
    window.location.reload();
  };

  const handleResetSettings = () => {
    const defaults = resetSettings();
    setSettingsState(defaults);
    setTheme(defaults.theme);
    toast({ title: 'Settings Reset', description: 'All settings restored to defaults', variant: 'success' });
  };

  const handleExportData = () => {
    downloadUserData();
    toast({ title: 'Data Exported', description: 'Your data has been downloaded', variant: 'success' });
  };

  // Premium Toggle Switch
  const Toggle = ({ enabled, onChange, label, description }: { 
    enabled: boolean; 
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-out ${
          enabled 
            ? 'bg-[#57068C] shadow-lg shadow-purple-500/25' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const sections = [
    { id: 'appearance', icon: Sun, label: 'Appearance' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'model', icon: Zap, label: 'AI Model' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'accessibility', icon: Eye, label: 'Accessibility' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Data' },
    { id: 'shortcuts', icon: Keyboard, label: 'Shortcuts' },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Modal */}
        <Card 
          className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#57068C] to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex h-[calc(85vh-88px)] max-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="w-56 border-r border-gray-100 dark:border-gray-800 p-3 overflow-y-auto">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-[#57068C] text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Theme</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred color scheme</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', icon: Sun, label: 'Light', desc: 'Bright & clean' },
                        { id: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on eyes' },
                        { id: 'system', icon: Monitor, label: 'System', desc: 'Auto switch' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSaveSettings({ theme: t.id as AppSettings['theme'] })}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            settings.theme === t.id
                              ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/30 shadow-lg shadow-purple-500/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <t.icon className={`h-6 w-6 mx-auto mb-2 ${settings.theme === t.id ? 'text-[#57068C]' : 'text-gray-400'}`} />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
                          {settings.theme === t.id && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#57068C] rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Font Size</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Adjust text size for readability</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'small', label: 'Small', sample: 'Aa' },
                        { id: 'medium', label: 'Medium', sample: 'Aa' },
                        { id: 'large', label: 'Large', sample: 'Aa' },
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleSaveSettings({ fontSize: size.id as AppSettings['fontSize'] })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            settings.fontSize === size.id
                              ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`block font-serif ${
                            size.id === 'small' ? 'text-lg' : size.id === 'medium' ? 'text-2xl' : 'text-3xl'
                          } text-gray-900 dark:text-gray-100`}>
                            {size.sample}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{size.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.compactMode}
                      onChange={(val) => handleSaveSettings({ compactMode: val })}
                      label="Compact Mode"
                      description="Reduce spacing for a denser layout"
                    />
                  </div>
                </div>
              )}

              {/* Chat */}
              {activeSection === 'chat' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Chat Behavior</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Configure how the chat interface works</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.autoScroll}
                      onChange={(val) => handleSaveSettings({ autoScroll: val })}
                      label="Auto-scroll"
                      description="Automatically scroll to new messages"
                    />
                    <Toggle
                      enabled={settings.showTimestamps}
                      onChange={(val) => handleSaveSettings({ showTimestamps: val })}
                      label="Show Timestamps"
                      description="Display time on each message"
                    />
                    <Toggle
                      enabled={settings.enterToSend}
                      onChange={(val) => handleSaveSettings({ enterToSend: val })}
                      label="Enter to Send"
                      description="Press Enter to send (Shift+Enter for new line)"
                    />
                    <Toggle
                      enabled={settings.streamResponses}
                      onChange={(val) => handleSaveSettings({ streamResponses: val })}
                      label="Stream Responses"
                      description="Show AI responses as they're generated"
                    />
                  </div>
                </div>
              )}

              {/* AI Model */}
              {activeSection === 'model' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">AI Model</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your preferred AI model</p>
                  </div>
                  <div className="space-y-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleSaveSettings({ defaultModel: model.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                          settings.defaultModel === model.id
                            ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{model.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
                        </div>
                        {settings.defaultModel === model.id && (
                          <div className="w-5 h-5 bg-[#57068C] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage notification preferences</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.soundEnabled}
                      onChange={(val) => handleSaveSettings({ soundEnabled: val })}
                      label="Sound Effects"
                      description="Play sounds for new messages"
                    />
                    <Toggle
                      enabled={settings.desktopNotifications}
                      onChange={(val) => handleSaveSettings({ desktopNotifications: val })}
                      label="Desktop Notifications"
                      description="Show notifications when tab is inactive"
                    />
                  </div>
                </div>
              )}

              {/* Accessibility */}
              {activeSection === 'accessibility' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Accessibility</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Make the app easier to use</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.reduceMotion}
                      onChange={(val) => handleSaveSettings({ reduceMotion: val })}
                      label="Reduce Motion"
                      description="Minimize animations and transitions"
                    />
                    <Toggle
                      enabled={settings.highContrast}
                      onChange={(val) => handleSaveSettings({ highContrast: val })}
                      label="High Contrast"
                      description="Increase contrast for better readability"
                    />
                  </div>
                </div>
              )}

              {/* Privacy & Data */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Privacy & Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your data and privacy</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                    <Toggle
                      enabled={settings.saveHistory}
                      onChange={(val) => handleSaveSettings({ saveHistory: val })}
                      label="Save Chat History"
                      description="Keep conversations for later reference"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={handleExportData} 
                      className="w-full h-12 justify-start rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Download className="h-5 w-5 mr-3 text-gray-500" />
                      <div className="text-left">
                        <p className="font-medium">Export Data</p>
                        <p className="text-xs text-gray-500">Download all your data</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowResetSettingsConfirm(true)}
                      className="w-full h-12 justify-start rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <RefreshCw className="h-5 w-5 mr-3 text-gray-500" />
                      <div className="text-left">
                        <p className="font-medium">Reset Settings</p>
                        <p className="text-xs text-gray-500">Restore default settings</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowClearDataConfirm(true)}
                      className="w-full h-12 justify-start rounded-xl border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Clear All Data</p>
                        <p className="text-xs text-red-500">Permanently delete everything</p>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Shortcuts */}
              {activeSection === 'shortcuts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Keyboard Shortcuts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quick actions to boost productivity</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                    {[
                      { keys: ['Enter'], action: 'Send message' },
                      { keys: ['Shift', 'Enter'], action: 'New line' },
                      { keys: ['⌘/Ctrl', 'K'], action: 'New chat' },
                      { keys: ['⌘/Ctrl', ','], action: 'Open settings' },
                      { keys: ['Esc'], action: 'Close modal' },
                    ].map((shortcut, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between px-4 py-3 ${
                          i !== 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.action}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, j) => (
                            <kbd 
                              key={j} 
                              className="px-2.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 shadow-sm"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showClearDataConfirm}
        onClose={() => setShowClearDataConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        description="This will permanently delete all your local data including chat history, settings, and account information. This action cannot be undone."
        confirmText="Clear Everything"
        type="danger"
        icon="trash"
      />

      <ConfirmModal
        isOpen={showResetSettingsConfirm}
        onClose={() => setShowResetSettingsConfirm(false)}
        onConfirm={handleResetSettings}
        title="Reset Settings?"
        description="This will restore all settings to their default values. Your account and chat history will not be affected."
        confirmText="Reset"
        type="warning"
        icon="refresh"
      />
    </>
  );
}

