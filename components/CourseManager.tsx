"use client";

import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getCoursesByProfessor,
  getCourseFiles,
} from '@/lib/course-management';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, X, Check, BookOpen, Upload } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getCurrentUser } from '@/lib/user-auth';
import { formatDate } from '@/lib/utils';
import { setSelectedCourseId, getSelectedCourseId } from '@/lib/course-management';

interface CourseManagerProps {
  onCourseCreated?: (courseId: string) => void;
  onCourseSelected?: (courseId: string) => void;
}

export function CourseManager({ onCourseCreated, onCourseSelected }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedCourseId, setSelectedCourseIdState] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
    const currentSelected = getSelectedCourseId();
    setSelectedCourseIdState(currentSelected);
    
    // Listen for course changes
    const handleCoursesChange = () => loadCourses();
    window.addEventListener('courses-change', handleCoursesChange);
    return () => window.removeEventListener('courses-change', handleCoursesChange);
  }, []);

  const loadCourses = () => {
    const user = getCurrentUser();
    if (user) {
      const myCourses = getCoursesByProfessor(user.id);
      setCourses(myCourses);
    }
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;
    
    const user = getCurrentUser();
    if (!user) {
      alert('Please sign in to create courses');
      return;
    }

    const course = createCourse(
      formData.name.trim(),
      formData.description.trim(),
      user.id,
      user.name
    );
    
    setFormData({ name: '', description: '' });
    setShowCreateForm(false);
    // Select the newly created course
    setSelectedCourseId(course.id);
    setSelectedCourseIdState(course.id);
    onCourseCreated?.(course.id);
    onCourseSelected?.(course.id);
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({ name: course.name, description: course.description || '' });
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.name.trim()) return;
    updateCourse(editingId, { name: formData.name.trim(), description: formData.description.trim() });
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = (courseId: string) => {
    setDeleteConfirmId(courseId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteCourse(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Courses</h3>
        {!showCreateForm && !editingId && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#57068C] hover:bg-[#6A0BA8] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingId) && (
        <Card className="p-4 border-2 border-[#57068C]">
          <div className="space-y-3">
            <Input
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleSaveEdit : handleCreate}
                className="bg-[#57068C] hover:bg-[#6A0BA8] text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                {editingId ? 'Save' : 'Create'}
              </Button>
              <Button
                variant="outline"
                onClick={editingId ? handleCancelEdit : () => setShowCreateForm(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Courses List */}
      {courses.length === 0 && !showCreateForm && (
        <Card className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      You haven&apos;t created any courses yet.
                    </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#57068C] hover:bg-[#6A0BA8] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Course
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {courses.map((course) => {
          const courseFiles = getCourseFiles(course.id);
          const isSelected = selectedCourseId === course.id;
          return (
            <Card
              key={course.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#57068C] bg-purple-50 dark:bg-purple-950/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedCourseIdState(course.id);
                onCourseSelected?.(course.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{course.name}</h4>
                    {isSelected && (
                      <span className="text-xs bg-[#57068C] text-white px-2 py-0.5 rounded-full">Selected</span>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {courseFiles.length} file{courseFiles.length !== 1 ? 's' : ''} • {formatDate(course.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(course)}
                    title="Edit course"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(course.id)}
                    title="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Course?"
        description="This will permanently delete this course and all associated files. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon="trash"
      />
    </div>
  );
}

