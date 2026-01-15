import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  /** Set of completed lesson IDs */
  completedLessons: Set<string>;
  /** Current lesson ID */
  currentLessonId: string | null;
  /** Mark a lesson as completed */
  markCompleted: (lessonId: string) => void;
  /** Set the current lesson */
  setCurrentLesson: (lessonId: string) => void;
  /** Check if a lesson is completed */
  isCompleted: (lessonId: string) => boolean;
  /** Get the number of completed lessons */
  getCompletedCount: () => number;
  /** Reset all progress */
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: new Set<string>(),
      currentLessonId: null,

      markCompleted: (lessonId: string) => {
        set((state) => ({
          completedLessons: new Set([...state.completedLessons, lessonId]),
        }));
      },

      setCurrentLesson: (lessonId: string) => {
        set({ currentLessonId: lessonId });
      },

      isCompleted: (lessonId: string) => {
        return get().completedLessons.has(lessonId);
      },

      getCompletedCount: () => {
        return get().completedLessons.size;
      },

      resetProgress: () => {
        set({
          completedLessons: new Set<string>(),
          currentLessonId: null,
        });
      },
    }),
    {
      name: 'exploring-leo-progress',
      // Custom serialization for Set
      partialize: (state) => ({
        completedLessons: Array.from(state.completedLessons),
        currentLessonId: state.currentLessonId,
      }),
      // Custom deserialization for Set
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          completedLessons: string[];
          currentLessonId: string | null;
        };
        return {
          ...currentState,
          completedLessons: new Set(persisted?.completedLessons || []),
          currentLessonId: persisted?.currentLessonId || null,
        };
      },
    }
  )
);
