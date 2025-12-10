import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { lessons } from "../data/lessons";
import { useStore } from "../store/useStore";

// Monospace font helper for code words
function getMonospaceWord(word: string) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: "16px" }}>
      {word}
    </span>
  );
}

interface WordButtonProps {
  word: string;
  id: string;
  fromBank: boolean;
  onClick: () => void;
  disabled?: boolean;
  showFeedback?: boolean;
  isCorrect?: boolean;
  isSortable?: boolean;
}

// Sortable word button for answer area (can be rearranged)
function SortableWordButton({
  word,
  id,
  onClick,
  disabled,
  showFeedback,
  isCorrect,
}: Omit<WordButtonProps, "fromBank" | "isSortable">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: disabled || showFeedback,
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      disabled={disabled || showFeedback}
      className={`px-6 py-3 rounded-2xl font-bold text-lg ${
        isDragging ? "opacity-50 scale-105" : "hover:scale-105 active:scale-95"
      } ${
        showFeedback
          ? isCorrect
            ? "bg-green-500 text-white cursor-default"
            : "bg-red-500 text-white cursor-default"
          : "bg-gray-700 text-white hover:bg-gray-600"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {getMonospaceWord(word)}
    </button>
  );
}

// Draggable word button for bank (can only be moved to answer)
function DraggableWordButton({
  word,
  id,
  onClick,
  disabled,
  onMeasure,
}: Pick<WordButtonProps, "word" | "id" | "onClick" | "disabled"> & {
  onMeasure?: (width: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled,
    });

  const measureRef = (node: HTMLButtonElement | null) => {
    setNodeRef(node);
    if (node && onMeasure) {
      // Measure width immediately when ref is set
      const width = node.offsetWidth;
      console.log(`Measured width: ${width} for word: ${word}`);
      if (width > 0) {
        onMeasure(width);
      }
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: "transform 200ms ease",
      }
    : undefined;

  return (
    <button
      ref={measureRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
        isDragging ? "opacity-50 scale-105" : ""
      } bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700 hover:border-gray-600 hover:scale-105 active:scale-95 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {getMonospaceWord(word)}
    </button>
  );
}

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

function DroppableArea({ id, children, className }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver ? "ring-2 ring-duo-green ring-opacity-50" : ""
      } transition-all`}
    >
      {children}
    </div>
  );
}

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { updateXP, completeLesson } = useStore();
  const { t } = useTranslation();

  const lesson = lessonId ? lessons[lessonId] : null;

  // Initialize exercise queue with all exercise IDs
  const [exerciseQueue, setExerciseQueue] = useState<string[]>(
    lesson?.exercises.map((ex) => ex.id) || []
  );
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Set<string>>(
    new Set()
  );
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<Set<string>>(
    new Set()
  );
  const [hearts, setHearts] = useState(3);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<(string | null)[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const wordWidthsRef = useRef<Map<number, number>>(new Map());
  const originalPositionsRef = useRef<Map<string, number>>(new Map()); // Track original index for each word
  const selectedWordOriginsRef = useRef<Map<string, number>>(new Map()); // Track which bank index each selected word came from (key: word, value: bank index)
  const [wordWidths, setWordWidths] = useState<Map<number, number>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentExerciseId = exerciseQueue[0];
  const currentExercise = lesson?.exercises.find(
    (ex) => ex.id === currentExerciseId
  );
  const totalExercises = lesson?.exercises.length || 0;

  // Reset state when exercise changes
  useEffect(() => {
    if (currentExercise) {
      // Shuffle word bank for each exercise
      const shuffled = [...currentExercise.wordBank].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);

      // Store original positions for each word (word-index key)
      originalPositionsRef.current = new Map();
      shuffled.forEach((word, index) => {
        originalPositionsRef.current.set(`${word}-${index}`, index);
      });

      setSelectedWords([]);
      setIsCorrect(null);
      setShowFeedback(false);
      wordWidthsRef.current = new Map();
      selectedWordOriginsRef.current = new Map();
      setWordWidths(new Map()); // Reset measured widths for new exercise
    }
  }, [currentExercise]);

  if (!lesson || !currentExercise) {
    return (
      <div className="min-h-screen bg-duo-dark flex items-center justify-center">
        <div className="text-white text-2xl">Lesson not found</div>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || showFeedback) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Extract location from ID (format: "bank-word-index" or "selected-word-index")
    const [activeLocation, , activeIndex] = activeId.split("-");
    const [overLocation, , overIndex] = overId.split("-");

    // Case 1: Reordering within answer area
    if (activeLocation === "selected" && overLocation === "selected") {
      const oldIndex = parseInt(activeIndex);
      const newIndex = parseInt(overIndex);

      if (!isNaN(oldIndex) && !isNaN(newIndex) && oldIndex !== newIndex) {
        setSelectedWords(arrayMove(selectedWords, oldIndex, newIndex));
      }
    }
    // Case 2: Moving from bank to answer area
    else if (activeLocation === "bank" && overLocation === "answer") {
      const wordIndex = availableWords.findIndex(
        (word, i) => `bank-${word}-${i}` === activeId
      );
      if (wordIndex !== -1) {
        const word = availableWords[wordIndex];
        setSelectedWords([...selectedWords, word]);
        setAvailableWords(availableWords.filter((_, i) => i !== wordIndex));
      }
    }
    // Case 3: Moving from answer back to bank
    else if (activeLocation === "selected" && overLocation === "bank") {
      const wordIndex = parseInt(activeIndex);
      if (!isNaN(wordIndex) && wordIndex < selectedWords.length) {
        const word = selectedWords[wordIndex];
        const newSelected = [...selectedWords];
        newSelected.splice(wordIndex, 1);
        setSelectedWords(newSelected);
        setAvailableWords([...availableWords, word]);
      }
    }
  };

  const handleWordClick = (word: string, fromBank: boolean, selectedIndex?: number, bankIndex?: number) => {
    if (showFeedback) return; // Don't allow changes after checking

    if (fromBank) {
      // Moving from bank to answer
      const foundBankIndex = bankIndex !== undefined ? bankIndex : availableWords.findIndex((aw) => aw === word);

      // Store which bank position this word came from, keyed by its future position in selectedWords
      const futureSelectedIndex = selectedWords.length;
      selectedWordOriginsRef.current.set(futureSelectedIndex, foundBankIndex);

      setSelectedWords([...selectedWords, word]);

      // Replace word with null placeholder in bank to maintain layout
      const newAvailable = [...availableWords];
      newAvailable[foundBankIndex] = null;
      setAvailableWords(newAvailable);
    } else {
      // Moving from answer back to bank
      // Remove word from answer area (no placeholder in answer section)
      const newSelected = [...selectedWords];
      newSelected.splice(selectedIndex!, 1);
      setSelectedWords(newSelected);

      // Get the original bank position for this selected word
      const originalBankIndex = selectedWordOriginsRef.current.get(selectedIndex!);

      // Clean up the tracking map and shift down indices for words after this one
      selectedWordOriginsRef.current.delete(selectedIndex!);
      const updatedMap = new Map<number, number>();
      selectedWordOriginsRef.current.forEach((bankIdx, selIdx) => {
        if (selIdx > selectedIndex!) {
          updatedMap.set(selIdx - 1, bankIdx); // Shift down by 1
        } else {
          updatedMap.set(selIdx, bankIdx);
        }
      });
      selectedWordOriginsRef.current = updatedMap;

      // Put word back in its original position in bank
      if (originalBankIndex !== undefined) {
        const newAvailable = [...availableWords];
        newAvailable[originalBankIndex] = word;
        setAvailableWords(newAvailable);
      } else {
        // Fallback: Put in first null slot or add to end
        const firstNullIndex = availableWords.findIndex((w) => w === null);
        if (firstNullIndex !== -1) {
          const newAvailable = [...availableWords];
          newAvailable[firstNullIndex] = word;
          setAvailableWords(newAvailable);
        } else {
          setAvailableWords([...availableWords, word]);
        }
      }
    }
  };

  const handleCheck = () => {
    const isAnswerCorrect =
      selectedWords.length === currentExercise.correctAnswer.length &&
      selectedWords.every(
        (word, index) => word === currentExercise.correctAnswer[index]
      );

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (isCorrect) {
      // Mark exercise as completed
      setCompletedExerciseIds((prev) => new Set([...prev, currentExerciseId]));
      // Remove from skipped if it was there
      setSkippedExerciseIds((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(currentExerciseId);
        return newSet;
      });

      // Remove from queue
      const newQueue = exerciseQueue.slice(1);
      setExerciseQueue(newQueue);

      // Check if all exercises are completed
      if (completedExerciseIds.size + 1 >= totalExercises) {
        // Lesson complete - award XP and navigate back
        updateXP(lesson!.xpReward);
        if (lessonId) {
          completeLesson(lessonId);
        }
        navigate("/learn");
        return;
      }
    } else {
      // Wrong answer - subtract a heart
      setHearts((prev) => Math.max(0, prev - 1));

      // Move current exercise to end of queue
      const newQueue = [...exerciseQueue.slice(1), currentExerciseId];
      setExerciseQueue(newQueue);

      // Check if hearts depleted
      if (hearts - 1 <= 0) {
        // Game over - could navigate to a "try again" screen or back to learn
        navigate("/learn");
        return;
      }
    }

    // Reset feedback state for next exercise
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const handleSkip = () => {
    // Mark exercise as skipped
    setSkippedExerciseIds((prev) => new Set([...prev, currentExerciseId]));

    // Move current exercise to end of queue
    const newQueue = [...exerciseQueue.slice(1), currentExerciseId];
    setExerciseQueue(newQueue);

    // Reset state for next exercise
    setSelectedWords([]);
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const canCheck = selectedWords.length > 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-duo-dark flex flex-col">
        {/* Header with progress */}
        <div className="bg-duo-dark border-b border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate("/learn")}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ×
            </button>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden flex">
              {/* Completed exercises (green) */}
              <div
                className="h-full bg-duo-green transition-all duration-300"
                style={{
                  width: `${
                    (completedExerciseIds.size / totalExercises) * 100
                  }%`,
                }}
              />
              {/* Skipped exercises (orange) */}
              <div
                className="h-full bg-duo-orange transition-all duration-300"
                style={{
                  width: `${(skippedExerciseIds.size / totalExercises) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: hearts }).map((_, i) => (
                <span key={i} className="text-duo-green text-xl">
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full">
            {/* Exercise type badge */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <span className="text-white text-lg font-bold">
                {t("lesson.newWord")}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-white text-3xl font-bold mb-6">
              {currentExercise.question}
            </h1>

            {/* Prompt text (if any) */}
            {currentExercise.prompt && (
              <div className="mb-8 flex items-center gap-4">
                <div className="text-8xl">💻</div>
                <div className="bg-gray-800 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <button className="text-duo-blue text-2xl">🔊</button>
                  <code className="text-white text-lg font-mono">
                    {currentExercise.prompt}
                  </code>
                </div>
              </div>
            )}

            {/* Answer area */}
            <DroppableArea
              id="answer-area"
              className="mb-8 min-h-[120px] border-b-2 border-gray-700 pb-4 rounded-xl"
            >
              <SortableContext
                items={selectedWords.map(
                  (word, index) => `selected-${word}-${index}`
                )}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-3 content-start">
                  {selectedWords.map((word, index) => (
                    <SortableWordButton
                      key={`selected-${index}`}
                      id={`selected-${word}-${index}`}
                      word={word}
                      onClick={() => handleWordClick(word, false, index)}
                      showFeedback={showFeedback}
                      isCorrect={isCorrect ?? false}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableArea>

            {/* Word bank */}
            <DroppableArea id="bank-area" className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center h-48 content-start">
                {availableWords.map((word, index) =>
                  word === null ? (
                    // Empty placeholder box to maintain layout with measured width
                    <div
                      key={`bank-placeholder-${index}`}
                      className="px-6 py-3 rounded-2xl border-2 border-dashed border-gray-700 bg-transparent"
                      style={{
                        width: wordWidths.has(index) ? `${wordWidths.get(index)}px` : "auto",
                        minWidth: wordWidths.has(index) ? `${wordWidths.get(index)}px` : undefined,
                      }}
                    >
                      <span className="opacity-0 text-lg font-bold">word</span>
                    </div>
                  ) : (
                    <DraggableWordButton
                      key={`available-${index}`}
                      id={`bank-${word}-${index}`}
                      word={word}
                      onClick={() => handleWordClick(word, true, undefined, index)}
                      disabled={showFeedback}
                      onMeasure={(width) => {
                        // Only store width if not already measured
                        if (!wordWidthsRef.current.has(index)) {
                          wordWidthsRef.current.set(index, width);
                          // Update state to trigger re-render with new widths
                          setWordWidths(new Map(wordWidthsRef.current));
                        }
                      }}
                    />
                  )
                )}
              </div>
            </DroppableArea>

            {/* Hint */}
            {currentExercise.hint && !showFeedback && (
              <div className="text-gray-400 text-sm italic mb-8">
                💡 {t("lesson.hint")} {currentExercise.hint}
              </div>
            )}

            {/* Feedback message */}
            {showFeedback && (
              <div
                className={`mb-8 p-6 rounded-2xl ${
                  isCorrect
                    ? "bg-green-500 bg-opacity-20"
                    : "bg-red-500 bg-opacity-20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? "✓" : "✗"}</span>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isCorrect ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isCorrect ? t("lesson.excellent") : t("lesson.notQuite")}
                    </h3>
                    {!isCorrect && (
                      <p className="text-white">
                        {t("lesson.correctAnswer")}{" "}
                        <span className="inline-flex gap-1">
                          {currentExercise.correctAnswer.map((word, idx) => (
                            <span key={idx}>
                              {getMonospaceWord(word)}
                            </span>
                          ))}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="bg-duo-dark border-t border-gray-700 p-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {/* Skip button - only show when not showing feedback */}
            {!showFeedback ? (
              <button
                onClick={handleSkip}
                className="px-8 py-4 rounded-2xl font-bold text-lg transition-all bg-transparent border-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-500"
              >
                {t("lesson.skip")}
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {!showFeedback ? (
              <button
                onClick={handleCheck}
                disabled={!canCheck}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all ${
                  canCheck
                    ? "bg-duo-green hover:bg-green-600 text-white hover:scale-105"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("lesson.check")}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all ${
                  isCorrect
                    ? "bg-duo-green hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } hover:scale-105`}
              >
                {isCorrect
                  ? completedExerciseIds.size + 1 >= totalExercises
                    ? t("lesson.complete")
                    : t("lesson.continue")
                  : t("lesson.continue")}
              </button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="px-6 py-3 bg-gray-700 text-white rounded-2xl font-bold text-lg shadow-2xl scale-110 cursor-grabbing">
            {getMonospaceWord(activeId.split("-")[1])}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
