import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Resume } from "@/db/schema";

interface ResumeState {
  currentResume: Resume | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setCurrentResume: (resume: Resume | null) => void;
  updateResume: (updates: Partial<Resume>) => void;
  setIsEditing: (editing: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  resetState: () => void;
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    (set, get) => ({
      currentResume: null,
      isEditing: false,
      hasUnsavedChanges: false,

      setCurrentResume: (resume) =>
        set({ currentResume: resume, hasUnsavedChanges: false }),

      updateResume: (updates) => {
        const current = get().currentResume;
        if (current) {
          set({
            currentResume: { ...current, ...updates },
            hasUnsavedChanges: true,
          });
        }
      },

      setIsEditing: (editing) => set({ isEditing: editing }),

      setHasUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),

      resetState: () =>
        set({
          currentResume: null,
          isEditing: false,
          hasUnsavedChanges: false,
        }),
    }),
    { name: "resume-store" }
  )
);
