import { User, UserPreferences, UserMemory } from '@/types';

const USER_STORAGE_KEY = 'nyu-study-buddy-user';
const USERS_DB_KEY = 'nyu-study-buddy-users-db';

// Default preferences for new users
const defaultPreferences: UserPreferences = {
  learningStyle: 'reading',
  academicLevel: 'sophomore',
  major: '',
  preferredLanguage: 'English',
  responseStyle: 'detailed',
  tone: 'encouraging',
};

// Default memory for new users
const defaultMemory: UserMemory = {
  topics: [],
  strengths: [],
  weaknesses: [],
  recentQuestions: [],
  notes: '',
  lastUpdated: new Date(),
};

// Generate unique ID
function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get all users from "database"
function getAllUsers(): Record<string, User> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(USERS_DB_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save all users to "database"
function saveAllUsers(users: Record<string, User>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

// Get current logged in user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;
  try {
    const user = JSON.parse(data);
    // Convert date strings back to Date objects
    user.createdAt = new Date(user.createdAt);
    user.memory.lastUpdated = new Date(user.memory.lastUpdated);
    return user;
  } catch {
    return null;
  }
}

// Save current user session
function saveCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// Sign up a new user
export function signUp(name: string, email: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  
  // Check if email already exists
  const existingUser = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }
  
  const newUser: User = {
    id: generateUserId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    createdAt: new Date(),
    preferences: { ...defaultPreferences },
    memory: { ...defaultMemory, lastUpdated: new Date() },
  };
  
  users[newUser.id] = newUser;
  saveAllUsers(users);
  saveCurrentUser(newUser);
  
  return { success: true, user: newUser };
}

// Sign in existing user
export function signIn(email: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  
  const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return { success: false, error: 'No account found with this email. Please sign up first.' };
  }
  
  // Convert dates
  user.createdAt = new Date(user.createdAt);
  user.memory.lastUpdated = new Date(user.memory.lastUpdated);
  
  saveCurrentUser(user);
  return { success: true, user };
}

// Sign out
export function signOut(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Update user preferences
export function updatePreferences(preferences: Partial<UserPreferences>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  user.preferences = { ...user.preferences, ...preferences };
  
  // Save to both current session and database
  saveCurrentUser(user);
  const users = getAllUsers();
  users[user.id] = user;
  saveAllUsers(users);
  
  return user;
}

// Update user memory
export function updateMemory(memory: Partial<UserMemory>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  user.memory = { 
    ...user.memory, 
    ...memory,
    lastUpdated: new Date(),
  };
  
  // Save to both current session and database
  saveCurrentUser(user);
  const users = getAllUsers();
  users[user.id] = user;
  saveAllUsers(users);
  
  return user;
}

// Add a topic to user's studied topics
export function addStudiedTopic(topic: string): void {
  const user = getCurrentUser();
  if (!user) return;
  
  if (!user.memory.topics.includes(topic)) {
    user.memory.topics = [...user.memory.topics, topic].slice(-50); // Keep last 50
    user.memory.lastUpdated = new Date();
    saveCurrentUser(user);
    const users = getAllUsers();
    users[user.id] = user;
    saveAllUsers(users);
  }
}

// Add a question to recent questions
export function addRecentQuestion(question: string): void {
  const user = getCurrentUser();
  if (!user) return;
  
  user.memory.recentQuestions = [question, ...user.memory.recentQuestions].slice(0, 20); // Keep last 20
  user.memory.lastUpdated = new Date();
  saveCurrentUser(user);
  const users = getAllUsers();
  users[user.id] = user;
  saveAllUsers(users);
}

// Learn from a conversation - extract key topics and update memory
export function learnFromConversation(userMessage: string, aiResponse: string): void {
  const user = getCurrentUser();
  if (!user) return;
  
  // Extract potential topics from the conversation
  const combinedText = (userMessage + ' ' + aiResponse).toLowerCase();
  
  // Common academic topic patterns
  const topicPatterns = [
    /(?:about|regarding|explain|understand|learn|study|chapter|lecture|topic)\s+([a-z\s]{3,30})/gi,
    /(?:what is|how does|how do|how to)\s+([a-z\s]{3,30})/gi,
  ];
  
  const extractedTopics: string[] = [];
  topicPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(combinedText)) !== null) {
      const topic = match[1].trim();
      if (topic.length > 3 && topic.split(' ').length <= 5) {
        extractedTopics.push(topic);
      }
    }
  });
  
  // Add unique topics
  let updated = false;
  extractedTopics.forEach(topic => {
    const normalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    if (!user.memory.topics.includes(normalizedTopic) && 
        !user.memory.topics.some(t => t.toLowerCase() === normalizedTopic.toLowerCase())) {
      user.memory.topics = [...user.memory.topics, normalizedTopic].slice(-50);
      updated = true;
    }
  });
  
  if (updated) {
    user.memory.lastUpdated = new Date();
    saveCurrentUser(user);
    const users = getAllUsers();
    users[user.id] = user;
    saveAllUsers(users);
  }
}

// Update user name
export function updateName(name: string): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  user.name = name.trim();
  saveCurrentUser(user);
  const users = getAllUsers();
  users[user.id] = user;
  saveAllUsers(users);
  
  return user;
}

// Generate personalized system prompt based on user
export function generatePersonalizedPrompt(user: User): string {
  const { preferences, memory, name } = user;
  
  let prompt = `You are speaking with ${name}, `;
  
  // Academic level
  prompt += `a ${preferences.academicLevel} student`;
  if (preferences.major) {
    prompt += ` majoring in ${preferences.major}`;
  }
  prompt += '. ';
  
  // Learning style
  const learningStyleDescriptions: Record<string, string> = {
    visual: 'They learn best with diagrams, charts, and visual representations.',
    auditory: 'They learn best through verbal explanations and discussions.',
    reading: 'They learn best through reading and written materials.',
    kinesthetic: 'They learn best through hands-on examples and practice problems.',
  };
  prompt += learningStyleDescriptions[preferences.learningStyle] + ' ';
  
  // Response style
  const responseStyleDescriptions: Record<string, string> = {
    concise: 'Keep your responses brief and to the point.',
    detailed: 'Provide thorough, comprehensive explanations.',
    'step-by-step': 'Break down explanations into clear, numbered steps.',
  };
  prompt += responseStyleDescriptions[preferences.responseStyle] + ' ';
  
  // Tone
  const toneDescriptions: Record<string, string> = {
    formal: 'Maintain a professional and formal tone.',
    casual: 'Use a friendly, conversational tone.',
    encouraging: 'Be supportive, encouraging, and positive in your responses.',
  };
  prompt += toneDescriptions[preferences.tone] + ' ';
  
  // Memory context
  if (memory.topics.length > 0) {
    prompt += `\n\nTopics ${name} has studied recently: ${memory.topics.slice(-10).join(', ')}. `;
  }
  
  if (memory.strengths.length > 0) {
    prompt += `Their strengths include: ${memory.strengths.join(', ')}. `;
  }
  
  if (memory.weaknesses.length > 0) {
    prompt += `They may need extra help with: ${memory.weaknesses.join(', ')}. Provide more detailed explanations for these topics. `;
  }
  
  if (memory.notes) {
    prompt += `\n\nAdditional context: ${memory.notes}`;
  }
  
  return prompt;
}

// Delete user account
export function deleteAccount(): void {
  const user = getCurrentUser();
  if (!user) return;
  
  const users = getAllUsers();
  delete users[user.id];
  saveAllUsers(users);
  signOut();
}

