// Analytics tracking for professor insights
import { ChatSession } from '@/types';

const STORAGE_KEY_QUESTIONS = 'nyu-study-buddy-question-analytics';
const STORAGE_KEY_ENGAGEMENT = 'nyu-study-buddy-engagement-analytics';

export interface QuestionAnalytic {
  question: string;
  courseId: string;
  courseName: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface EngagementStats {
  courseId: string;
  courseName: string;
  totalQuestions: number;
  uniqueStudents: number;
  activeDays: number;
  lastActivity: Date;
  questionsByDay: Record<string, number>;
}

// Track a question asked by a student
export function trackQuestion(question: string, courseId: string, courseName: string, sessionId: string, userId?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    const questions: QuestionAnalytic[] = stored ? JSON.parse(stored) : [];
    
    questions.push({
      question: question.trim(),
      courseId,
      courseName,
      timestamp: new Date(),
      userId,
      sessionId,
    });
    
    // Keep only last 10,000 questions
    if (questions.length > 10000) {
      questions.splice(0, questions.length - 10000);
    }
    
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  } catch (error) {
    console.error('[Analytics] Error tracking question:', error);
  }
}

// Get all questions for analytics
export function getAllQuestions(): QuestionAnalytic[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    if (!stored) return [];
    
    const questions = JSON.parse(stored) as QuestionAnalytic[];
    return questions.map(q => ({
      ...q,
      timestamp: new Date(q.timestamp),
    }));
  } catch (error) {
    console.error('[Analytics] Error loading questions:', error);
    return [];
  }
}

// Get questions for a specific course
export function getCourseQuestions(courseId: string): QuestionAnalytic[] {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(q => q.courseId === courseId);
}

// Get most asked questions
export function getMostAskedQuestions(courseId?: string, limit: number = 10): Array<{ question: string; count: number }> {
  const questions = courseId ? getCourseQuestions(courseId) : getAllQuestions();
  
  const questionCounts: Record<string, number> = {};
  
  questions.forEach(q => {
    const normalized = q.question.toLowerCase().trim();
    questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
  });
  
  return Object.entries(questionCounts)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Get question frequency over time
export function getQuestionFrequency(courseId?: string, days: number = 30): Array<{ date: string; count: number }> {
  const questions = courseId ? getCourseQuestions(courseId) : getAllQuestions();
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const questionsByDate: Record<string, number> = {};
  
  // Initialize all dates in range
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    questionsByDate[dateStr] = 0;
  }
  
  // Count questions
  questions.forEach(q => {
    const questionDate = new Date(q.timestamp);
    if (questionDate >= startDate) {
      const dateStr = questionDate.toISOString().split('T')[0];
      if (dateStr in questionsByDate) {
        questionsByDate[dateStr]++;
      }
    }
  });
  
  return Object.entries(questionsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Get unique student count
export function getUniqueStudentCount(courseId?: string): number {
  const questions = courseId ? getCourseQuestions(courseId) : getAllQuestions();
  return new Set(questions.map(q => q.userId || 'guest')).size;
}

// Get engagement stats for a course
export function getEngagementStats(courseId: string, courseName: string): EngagementStats {
  const questions = getCourseQuestions(courseId);
  const uniqueStudents = getUniqueStudentCount(courseId);
  
  const questionsByDay: Record<string, number> = {};
  let lastActivity = new Date(0);
  
  questions.forEach(q => {
    const dateStr = new Date(q.timestamp).toISOString().split('T')[0];
    questionsByDay[dateStr] = (questionsByDay[dateStr] || 0) + 1;
    
    if (new Date(q.timestamp) > lastActivity) {
      lastActivity = new Date(q.timestamp);
    }
  });
  
  const activeDays = Object.keys(questionsByDay).length;
  
  return {
    courseId,
    courseName,
    totalQuestions: questions.length,
    uniqueStudents,
    activeDays,
    lastActivity,
    questionsByDay,
  };
}

// Get all course stats
export function getAllCourseStats(): EngagementStats[] {
  const allQuestions = getAllQuestions();
  const courseIds = [...new Set(allQuestions.map(q => q.courseId))];
  
  return courseIds.map(courseId => {
    const courseQuestions = allQuestions.filter(q => q.courseId === courseId);
    const courseName = courseQuestions[0]?.courseName || 'Unknown';
    return getEngagementStats(courseId, courseName);
  });
}

// Get peak activity hours
export function getPeakHours(courseId?: string): Array<{ hour: number; count: number }> {
  const questions = courseId ? getCourseQuestions(courseId) : getAllQuestions();
  
  const hourCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }
  
  questions.forEach(q => {
    const hour = new Date(q.timestamp).getHours();
    hourCounts[hour]++;
  });
  
  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
}

// Get question categories/topics
export function getQuestionCategories(courseId?: string, limit: number = 10): Array<{ category: string; count: number }> {
  const questions = courseId ? getCourseQuestions(courseId) : getAllQuestions();
  
  const categoryCounts: Record<string, number> = {};
  
  // Simple keyword extraction
  questions.forEach(q => {
    const words = q.question.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const stopWords = new Set(['what', 'when', 'where', 'which', 'this', 'that', 'these', 'those', 'could', 'would', 'should', 'about', 'chapter', 'explain', 'help']);
    
    words.forEach(word => {
      if (!stopWords.has(word)) {
        categoryCounts[word] = (categoryCounts[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Clear all analytics data
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY_QUESTIONS);
    localStorage.removeItem(STORAGE_KEY_ENGAGEMENT);
  } catch (error) {
    console.error('[Analytics] Error clearing analytics:', error);
  }
}

// Alias functions for ProfessorAnalytics component compatibility
export function getCourseAnalytics(courseId: string) {
  const questions = getCourseQuestions(courseId);
  const uniqueStudents = new Set(questions.map(q => q.userId || 'guest')).size;
  
  const dates = questions.map(q => new Date(q.timestamp).toDateString());
  const activeDays = new Set(dates).size;
  
  const totalQuestions = questions.length;
  const avgQuestionsPerDay = activeDays > 0 ? totalQuestions / activeDays : 0;
  
  return {
    totalQuestions,
    uniqueStudents,
    activeDays,
    avgQuestionsPerDay,
  };
}

export function getQuestionActivity(courseId: string, days: number = 30) {
  return getQuestionFrequency(courseId, days);
}

export function getPeakActivityHours(courseId: string) {
  return getPeakHours(courseId);
}

export function getTopTopics(courseId: string, limit: number = 10) {
  return getQuestionCategories(courseId, limit).map(item => ({
    topic: item.category,
    count: item.count
  }));
}
