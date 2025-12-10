import { useState, useEffect } from "react";
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
}: Omit<WordButtonProps, 'fromBank' | 'isSortable'>) {
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
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    zIndex: isDragging ? 1000 : 'auto',
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
      {word}
    </button>
  );
}

// Draggable word button for bank (can only be moved to answer)
function DraggableWordButton({
  word,
  id,
  onClick,
  disabled,
}: Pick<WordButtonProps, 'word' | 'id' | 'onClick' | 'disabled'>) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: "transform 200ms ease",
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
        isDragging ? "opacity-50 scale-105" : ""
      } bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700 hover:border-gray-600 hover:scale-105 active:scale-95 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {word}
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
    lesson?.exercises.map(ex => ex.id) || []
  );
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Set<string>>(new Set());
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<Set<string>>(new Set());
  const [hearts, setHearts] = useState(3);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentExerciseId = exerciseQueue[0];
  const currentExercise = lesson?.exercises.find(ex => ex.id === currentExerciseId);
  const totalExercises = lesson?.exercises.length || 0;

  // Reset state when exercise changes
  useEffect(() => {
    if (currentExercise) {
      // Shuffle word bank for each exercise
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailableWords(
        [...currentExercise.wordBank].sort(() => Math.random() - 0.5)
      );
      setSelectedWords([]);
      setIsCorrect(null);
      setShowFeedback(false);
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

  const handleWordClick = (word: string, fromBank: boolean) => {
    if (showFeedback) return; // Don't allow changes after checking

    if (fromBank) {
      // Add word to selected
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(
        availableWords.filter(
          (w, i) => i !== availableWords.findIndex((aw) => aw === word)
        )
      );
    } else {
      // Remove word from selected, return to bank
      const indexToRemove = selectedWords.findIndex((w) => w === word);
      const newSelected = [...selectedWords];
      newSelected.splice(indexToRemove, 1);
      setSelectedWords(newSelected);
      setAvailableWords([...availableWords, word]);
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
      setCompletedExerciseIds(prev => new Set([...prev, currentExerciseId]));
      // Remove from skipped if it was there
      setSkippedExerciseIds(prev => {
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
      setHearts(prev => Math.max(0, prev - 1));

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
    setSkippedExerciseIds(prev => new Set([...prev, currentExerciseId]));

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
                style={{ width: `${(completedExerciseIds.size / totalExercises) * 100}%` }}
              />
              {/* Skipped exercises (orange) */}
              <div
                className="h-full bg-duo-orange transition-all duration-300"
                style={{ width: `${(skippedExerciseIds.size / totalExercises) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: hearts }).map((_, i) => (
                <span key={i} className="text-duo-green text-xl">❤️</span>
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
              <span className="text-white text-lg font-bold">{t("lesson.newWord")}</span>
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
                items={selectedWords.map((word, index) => `selected-${word}-${index}`)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-3">
                  {selectedWords.map((word, index) => (
                    <SortableWordButton
                      key={`selected-${index}`}
                      id={`selected-${word}-${index}`}
                      word={word}
                      onClick={() => handleWordClick(word, false)}
                      showFeedback={showFeedback}
                      isCorrect={isCorrect ?? false}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableArea>

            {/* Word bank */}
            <DroppableArea id="bank-area" className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {availableWords.map((word, index) => (
                  <DraggableWordButton
                    key={`available-${index}`}
                    id={`bank-${word}-${index}`}
                    word={word}
                    onClick={() => handleWordClick(word, true)}
                    disabled={showFeedback}
                  />
                ))}
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
                        {currentExercise.correctAnswer.join(" ")}
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
            {activeId.split("-")[1]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
