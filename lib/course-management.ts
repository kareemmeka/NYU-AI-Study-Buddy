import { Course, CourseFile, UserRole } from '@/types';

const STORAGE_KEY_ROLE = 'nyu-study-buddy-user-role';
const STORAGE_KEY_COURSES = 'nyu-study-buddy-courses';
const STORAGE_KEY_COURSE_FILES = 'nyu-study-buddy-course-files';
const STORAGE_KEY_SELECTED_COURSE = 'nyu-study-buddy-selected-course';

// Role Management
export function getUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  try {
    const role = localStorage.getItem(STORAGE_KEY_ROLE);
    return role === 'student' || role === 'professor' ? role : null;
  } catch {
    return null;
  }
}

export function setUserRole(role: UserRole | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (role) {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEY_ROLE);
    }
    window.dispatchEvent(new Event('role-change'));
  } catch (error) {
    console.error('[CourseManagement] Error saving role:', error);
  }
}

// Course Management
export function getAllCourses(): Course[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_COURSES);
    if (!stored) return [];
    const courses = JSON.parse(stored) as Course[];
    return courses.map(course => ({
      ...course,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt),
    }));
  } catch (error) {
    console.error('[CourseManagement] Error loading courses:', error);
    return [];
  }
}

export function getCourse(id: string): Course | null {
  const courses = getAllCourses();
  return courses.find(c => c.id === id) || null;
}

export function getCoursesByProfessor(professorId: string): Course[] {
  const courses = getAllCourses();
  return courses.filter(c => c.professorId === professorId);
}

export function createCourse(name: string, description: string, professorId: string, professorName: string): Course {
  const course: Course = {
    id: `course-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    name,
    description,
    professorId,
    professorName,
    createdAt: new Date(),
    updatedAt: new Date(),
    fileIds: [],
  };
  
  const courses = getAllCourses();
  courses.push(course);
  saveAllCourses(courses);
  
  return course;
}

export function updateCourse(id: string, updates: Partial<Pick<Course, 'name' | 'description'>>): void {
  const courses = getAllCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index >= 0) {
    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date(),
    };
    saveAllCourses(courses);
  }
}

export function deleteCourse(id: string): void {
  const courses = getAllCourses();
  const filtered = courses.filter(c => c.id !== id);
  saveAllCourses(filtered);
  
  // Also remove course files
  const courseFiles = getAllCourseFiles();
  const filteredFiles = courseFiles.filter(cf => cf.courseId !== id);
  saveAllCourseFiles(filteredFiles);
}

function saveAllCourses(courses: Course[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    window.dispatchEvent(new Event('courses-change'));
  } catch (error) {
    console.error('[CourseManagement] Error saving courses:', error);
  }
}

// Course File Management
export function getAllCourseFiles(): CourseFile[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_COURSE_FILES);
    if (!stored) return [];
    const files = JSON.parse(stored) as CourseFile[];
    return files.map(file => ({
      ...file,
      uploadedAt: new Date(file.uploadedAt),
    }));
  } catch (error) {
    console.error('[CourseManagement] Error loading course files:', error);
    return [];
  }
}

export function getCourseFiles(courseId: string): CourseFile[] {
  const allFiles = getAllCourseFiles();
  return allFiles.filter(f => f.courseId === courseId);
}

export function addFileToCourse(courseId: string, fileId: string, fileName: string): void {
  const courseFiles = getAllCourseFiles();
  // Check if already exists
  if (courseFiles.some(cf => cf.courseId === courseId && cf.fileId === fileId)) {
    return; // Already added
  }
  
  courseFiles.push({
    courseId,
    fileId,
    fileName,
    uploadedAt: new Date(),
  });
  
  saveAllCourseFiles(courseFiles);
  
  // Update course fileIds
  const courses = getAllCourses();
  const course = courses.find(c => c.id === courseId);
  if (course && !course.fileIds.includes(fileId)) {
    course.fileIds.push(fileId);
    saveAllCourses(courses);
  }
}

export function removeFileFromCourse(courseId: string, fileId: string): void {
  const courseFiles = getAllCourseFiles();
  const filtered = courseFiles.filter(cf => !(cf.courseId === courseId && cf.fileId === fileId));
  saveAllCourseFiles(filtered);
  
  // Update course fileIds
  const courses = getAllCourses();
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.fileIds = course.fileIds.filter(id => id !== fileId);
    saveAllCourses(courses);
  }
}

function saveAllCourseFiles(files: CourseFile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COURSE_FILES, JSON.stringify(files));
    window.dispatchEvent(new Event('course-files-change'));
  } catch (error) {
    console.error('[CourseManagement] Error saving course files:', error);
  }
}

// Selected Course Management
export function getSelectedCourseId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY_SELECTED_COURSE);
  } catch {
    return null;
  }
}

export function setSelectedCourseId(courseId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (courseId) {
      localStorage.setItem(STORAGE_KEY_SELECTED_COURSE, courseId);
    } else {
      localStorage.removeItem(STORAGE_KEY_SELECTED_COURSE);
    }
    window.dispatchEvent(new Event('selected-course-change'));
  } catch (error) {
    console.error('[CourseManagement] Error saving selected course:', error);
  }
}

