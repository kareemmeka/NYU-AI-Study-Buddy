// App Settings Types and Storage

export interface AppSettings {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  
  // Chat
  autoScroll: boolean;
  showTimestamps: boolean;
  enterToSend: boolean;
  streamResponses: boolean;
  
  // Notifications
  soundEnabled: boolean;
  desktopNotifications: boolean;
  
  // Privacy
  saveHistory: boolean;
  shareAnalytics: boolean;
  
  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;
  
  // Advanced
  defaultModel: string;
  maxTokens: number;
  temperature: number;
}

const SETTINGS_KEY = 'nyu-study-buddy-settings';

export const defaultSettings: AppSettings = {
  // Appearance
  theme: 'system',
  fontSize: 'medium',
  compactMode: false,
  
  // Chat
  autoScroll: true,
  showTimestamps: true,
  enterToSend: true,
  streamResponses: true,
  
  // Notifications
  soundEnabled: false,
  desktopNotifications: false,
  
  // Privacy
  saveHistory: true,
  shareAnalytics: false,
  
  // Accessibility
  reduceMotion: false,
  highContrast: false,
  
  // Advanced
  defaultModel: '@gpt-4o/gpt-4o',
  maxTokens: 4000,
  temperature: 0.3,
};

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  
  return defaultSettings;
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
  
  return newSettings;
}

export function resetSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  } catch (e) {
    console.error('Error resetting settings:', e);
  }
  
  return defaultSettings;
}

// Clear all app data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  // Get all keys that start with our prefix
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('nyu-study-buddy')) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all our keys
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Export user data
export function exportUserData(): string {
  if (typeof window === 'undefined') return '{}';
  
  const data: Record<string, any> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('nyu-study-buddy')) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  
  return JSON.stringify(data, null, 2);
}

// Download data as file
export function downloadUserData(): void {
  const data = exportUserData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nyu-study-buddy-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

