import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessons } from "../data/lessons";

interface LessonState {
  // Lesson state
  lessonId: string | null;
  exerciseQueue: string[];
  completedExerciseIds: Set<string>;
  skippedExerciseIds: Set<string>;
  hearts: number;

  // Exercise state
  selectedWords: string[];
  availableWords: (string | null)[];
  isCorrect: boolean | null;
  showFeedback: boolean;
  activeId: string | null;
  wordWidths: Map<number, number>;
  originalPositions: Map<string, number>;
  selectedWordOrigins: Map<number, number>;

  // Actions
  initializeLesson: (lessonId: string) => void;
  initializeExercise: (wordBank: string[]) => void;
  selectWord: (
    word: string,
    fromBank: boolean,
    selectedIndex?: number,
    bankIndex?: number
  ) => void;
  checkAnswer: (exerciseId: string, correctAnswer: string[]) => boolean;
  continueToNextExercise: (
    exerciseId: string,
    totalExercises: number,
    xpReward: number
  ) => { isLessonComplete: boolean };
  skipExercise: (exerciseId: string) => void;
  resetExercise: () => void;
  setActiveId: (id: string | null) => void;
  reorderWords: (newOrder: string[]) => void;
  setWordWidth: (index: number, width: number) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessonId: null,
      exerciseQueue: [],
      completedExerciseIds: new Set(),
      skippedExerciseIds: new Set(),
      hearts: 3,
      selectedWords: [],
      availableWords: [],
      isCorrect: null,
      showFeedback: false,
      activeId: null,
      wordWidths: new Map(),
      originalPositions: new Map(),
      selectedWordOrigins: new Map(),

      // Actions
      initializeLesson: (lessonId) => {
        const lesson = lessons[lessonId];
        if (!lesson) return;

        set({
          lessonId,
          exerciseQueue: lesson.exercises.map((ex) => ex.id),
          completedExerciseIds: new Set(),
          skippedExerciseIds: new Set(),
          hearts: 3,
          selectedWords: [],
          availableWords: [],
          isCorrect: null,
          showFeedback: false,
          wordWidths: new Map(),
          originalPositions: new Map(),
          selectedWordOrigins: new Map(),
        });
      },

      selectWord: (word, fromBank, selectedIndex, bankIndex) => {
        if (get().showFeedback) return;

        if (fromBank) {
          // Moving from bank to answer
          const foundBankIndex =
            bankIndex !== undefined
              ? bankIndex
              : get().availableWords.findIndex((aw) => aw === word);

          if (foundBankIndex === -1) return;

          // Store which bank position this word came from
          const futureSelectedIndex = get().selectedWords.length;
          const newSelectedWordOrigins = new Map(get().selectedWordOrigins);
          newSelectedWordOrigins.set(futureSelectedIndex, foundBankIndex);

          // Update available words (replace with null to maintain layout)
          const newAvailable = [...get().availableWords];
          newAvailable[foundBankIndex] = null;

          set({
            selectedWords: [...get().selectedWords, word],
            availableWords: newAvailable,
            selectedWordOrigins: newSelectedWordOrigins,
          });
        } else {
          // Moving from answer back to bank
          if (selectedIndex === undefined) return;

          const newSelected = [...get().selectedWords];
          const wordToMove = newSelected[selectedIndex];
          newSelected.splice(selectedIndex, 1);

          // Get the original bank position for this selected word
          const originalBankIndex =
            get().selectedWordOrigins.get(selectedIndex);

          // Clean up the tracking map and shift down indices for words after this one
          const updatedMap = new Map<number, number>();
          get().selectedWordOrigins.forEach((bankIdx, selIdx) => {
            if (selIdx > selectedIndex) {
              updatedMap.set(selIdx - 1, bankIdx);
            } else if (selIdx < selectedIndex) {
              updatedMap.set(selIdx, bankIdx);
            }
          });

          // Put word back in its original position in bank
          const newAvailable = [...get().availableWords];
          if (originalBankIndex !== undefined) {
            newAvailable[originalBankIndex] = wordToMove;
          } else {
            // Fallback: Put in first null slot or add to end
            const firstNullIndex = newAvailable.findIndex((w) => w === null);
            if (firstNullIndex !== -1) {
              newAvailable[firstNullIndex] = wordToMove;
            } else {
              newAvailable.push(wordToMove);
            }
          }

          set({
            selectedWords: newSelected,
            availableWords: newAvailable,
            selectedWordOrigins: updatedMap,
          });
        }
      },

      checkAnswer: (_, correctAnswer) => {
        const isAnswerCorrect =
          get().selectedWords.length === correctAnswer.length &&
          get().selectedWords.every(
            (word, index) => word === correctAnswer[index]
          );

        set({
          isCorrect: isAnswerCorrect,
          showFeedback: true,
        });

        return isAnswerCorrect;
      },

      continueToNextExercise: (exerciseId, totalExercises) => {
        const { isCorrect, hearts } = get();
        let isLessonComplete = false;

        if (isCorrect) {
          // Mark exercise as completed
          const newCompleted = new Set(get().completedExerciseIds);
          newCompleted.add(exerciseId);

          // Remove from skipped if it was there
          const newSkipped = new Set(get().skippedExerciseIds);
          newSkipped.delete(exerciseId);

          // Remove from queue
          const newQueue = get().exerciseQueue.slice(1);

          // Check if all exercises are completed
          if (newCompleted.size >= totalExercises) {
            isLessonComplete = true;
          }

          set({
            exerciseQueue: newQueue,
            completedExerciseIds: newCompleted,
            skippedExerciseIds: newSkipped,
            selectedWords: [],
            showFeedback: false,
            isCorrect: null,
          });
        } else {
          // Wrong answer - subtract a heart
          const newHearts = Math.max(0, hearts - 1);

          // Move current exercise to end of queue
          const newQueue = [...get().exerciseQueue.slice(1), exerciseId];

          set({
            exerciseQueue: newQueue,
            hearts: newHearts,
            showFeedback: false,
            isCorrect: null,
            selectedWords: [],
          });

          // Check if hearts depleted
          if (newHearts <= 0) {
            isLessonComplete = true;
          }
        }

        return { isLessonComplete };
      },

      skipExercise: (exerciseId) => {
        const newSkipped = new Set(get().skippedExerciseIds);
        newSkipped.add(exerciseId);

        // Move current exercise to end of queue
        const newQueue = get().exerciseQueue.slice(1);
        if (newQueue.length > 0) {
          newQueue.push(exerciseId);
        }

        set({
          skippedExerciseIds: newSkipped,
          exerciseQueue: newQueue,
          selectedWords: [],
          showFeedback: false,
          isCorrect: null,
        });
      },

      resetExercise: () => {
        set({
          selectedWords: [],
          isCorrect: null,
          showFeedback: false,
          wordWidths: new Map(),
          originalPositions: new Map(),
          selectedWordOrigins: new Map(),
        });
      },

      initializeExercise: (wordBank: string[]) => {
        // Shuffle word bank for each exercise
        const shuffled = [...wordBank].sort(() => Math.random() - 0.5);

        // Store original positions for each word (word-index key)
        const originalPositions = new Map<string, number>();
        shuffled.forEach((word, index) => {
          originalPositions.set(`${word}-${index}`, index);
        });

        set({
          availableWords: shuffled,
          originalPositions,
          selectedWords: [],
          isCorrect: null,
          showFeedback: false,
          wordWidths: new Map(),
          selectedWordOrigins: new Map(),
        });
      },

      setActiveId: (id) => set({ activeId: id }),

      reorderWords: (newOrder) => {
        set({ selectedWords: newOrder });
      },

      setWordWidth: (index, width) => {
        const newWidths = new Map(get().wordWidths);
        if (!newWidths.has(index)) {
          newWidths.set(index, width);
          set({ wordWidths: newWidths });
        }
      },
    }),
    {
      name: "lesson-storage",
      partialize: (state) => {
        // Only persist these fields
        return {
          lessonId: state.lessonId,
          exerciseQueue: state.exerciseQueue,
          completedExerciseIds: Array.from(state.completedExerciseIds),
          skippedExerciseIds: Array.from(state.skippedExerciseIds),
          hearts: state.hearts,
        } as unknown as Partial<LessonState>;
      },
      merge: (persistedState, currentState) => {
        // Convert arrays back to Sets when rehydrating
        const persisted = persistedState as Partial<LessonState> & {
          completedExerciseIds?: string[];
          skippedExerciseIds?: string[];
        };

        return {
          ...currentState,
          ...persisted,
          completedExerciseIds: new Set(persisted.completedExerciseIds || []),
          skippedExerciseIds: new Set(persisted.skippedExerciseIds || []),
        };
      },
    }
  )
);

// Helper hook to get the current exercise
export const useCurrentExercise = () => {
  const lessonId = useLessonStore((state) => state.lessonId);
  const currentExerciseId = useLessonStore((state) => state.exerciseQueue[0]);

  if (!lessonId || !currentExerciseId) return null;

  return (
    lessons[lessonId]?.exercises.find((ex) => ex.id === currentExerciseId) ||
    null
  );
};
