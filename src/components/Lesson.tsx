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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { lessons } from "../data/lessons";
import { useStore } from "../store/useStore";
import { useLessonStore, useCurrentExercise } from "../store/useLessonStore";

// Monospace font helper for code words
function getMonospaceWord(word: string) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: "16px" }}>{word}</span>
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
  insertPlaceholder,
  placeholderWidth,
}: Omit<WordButtonProps, "fromBank" | "isSortable"> & {
  insertPlaceholder?: boolean;
  placeholderWidth?: number;
}) {
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
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative flex items-center ${
        insertPlaceholder ? "ml-2" : ""
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {insertPlaceholder && (
        <div
          className="rounded-2xl border-2 border-gray-600 bg-gray-800/50 mr-2 transition-all duration-200"
          style={{
            width: placeholderWidth ? `${placeholderWidth}px` : "100px",
            height: "56px", // Approximate height of a button
          }}
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag start if clicking button logic interferes
          onClick();
        }}
        disabled={disabled || showFeedback}
        className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
          isDragging
            ? "opacity-50 scale-105"
            : "hover:scale-105 active:scale-95"
        } ${
          showFeedback
            ? isCorrect
              ? "bg-green-500 text-white cursor-default"
              : "bg-red-500 text-white cursor-default"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {getMonospaceWord(word)}
      </button>
    </div>
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
      // Removed console.log to reduce noise
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
  active?: boolean;
}

function DroppableArea({ id, children, className, active }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver || active ? "ring-2 ring-duo-green ring-opacity-50" : ""
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

  // Zustand store
  const {
    initializeLesson,
    exerciseQueue,
    completedExerciseIds,
    skippedExerciseIds,
    hearts,
    selectedWords,
    availableWords,
    isCorrect,
    showFeedback,
    wordWidths,
    selectWord,
    checkAnswer,
    continueToNextExercise,
    skipExercise,
    setActiveId: setActiveIdInStore,
    reorderWords,
    activeId,
    initializeExercise,
    setWordWidth,
  } = useLessonStore();

  const currentExercise = useCurrentExercise();
  const currentExerciseId = exerciseQueue[0];
  const lesson = lessonId ? lessons[lessonId] : null;
  const totalExercises = lesson?.exercises.length || 0;

  // Local state for hint visibility only
  const [showHint, setShowHint] = useState(false);
  // Local state for lesson result
  const [lessonResult, setLessonResult] = useState<"success" | "failure" | null>(
    null
  );
  const [overId, setOverId] = useState<string | null>(null);

  // Ref for measuring word widths before adding to store
  const wordWidthsRef = useRef<Map<number, number>>(new Map());
  // Track previous exercise ID to detect changes
  const prevExerciseId = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Initialize lesson when component mounts or lessonId changes
  useEffect(() => {
    if (lessonId) {
      initializeLesson(lessonId);
      setLessonResult(null);
    }
  }, [lessonId, initializeLesson]);

  // Initialize exercise when current exercise changes or needs reset
  useEffect(() => {
    const hasChanged = prevExerciseId.current !== currentExercise?.id;
    const needsReset = availableWords.length === 0;

    if (currentExercise && (hasChanged || needsReset)) {
      initializeExercise(currentExercise.wordBank);
      setShowHint(false); // Reset hint visibility for new exercise
      wordWidthsRef.current = new Map(); // Reset measured widths
      prevExerciseId.current = currentExercise.id;
    }
  }, [currentExercise, initializeExercise, availableWords.length]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-duo-dark flex items-center justify-center">
        <div className="text-white text-2xl">Lesson not found</div>
      </div>
    );
  }

  // Success Screen
  if (lessonResult === "success") {
    return (
      <div className="min-h-screen bg-duo-dark flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative">
            {/* Placeholder Animation */}
            <div className="text-9xl animate-bounce mb-4">🎉</div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full flex items-center justify-center pointer-events-none">
              <div className="w-full h-full animate-pulse bg-yellow-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-yellow-400">
            {t("lesson.practiceComplete") || "Practice Complete!"}
          </h2>
          
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-lg">XP Gained</span>
              <span className="text-yellow-400 text-2xl font-bold">+{lesson.xpReward} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-lg">Hearts</span>
              <div className="flex gap-1">
                {Array.from({ length: hearts }).map((_, i) => (
                  <span key={i} className="text-duo-green text-xl">❤️</span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/learn")}
            className="w-full py-4 bg-duo-green hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-all"
          >
            {t("common.continue") || "Continue"}
          </button>
        </div>
      </div>
    );
  }

  // Failure Screen
  if (lessonResult === "failure") {
    return (
      <div className="min-h-screen bg-duo-dark flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-9xl mb-4 relative">
            🦉
            <div className="absolute -bottom-2 -right-2 text-6xl">💧</div>
          </div>
          
          <h2 className="text-4xl font-bold text-white">
            {t("lesson.tryAgain") || "Try Again"}
          </h2>
          
          <p className="text-gray-400 text-lg">
            Don't worry, mistakes help you learn!
          </p>

          <div className="space-y-4 pt-4">
            <button
              onClick={() => {
                if (lessonId) {
                  initializeLesson(lessonId);
                  setLessonResult(null);
                }
              }}
              className="w-full py-4 bg-duo-blue hover:bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-all"
            >
              {t("lesson.retry") || "Practice Again"}
            </button>
            
            <button
              onClick={() => navigate("/learn")}
              className="w-full py-4 bg-transparent border-2 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-2xl font-bold text-xl transition-all"
            >
              {t("common.quit") || "Quit"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentExercise || !currentExerciseId) {
    return (
      <div className="min-h-screen bg-duo-dark flex items-center justify-center">
        <div className="text-white text-2xl">Lesson not found</div>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveIdInStore(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIdInStore(null);
    setOverId(null);

    if (!over || showFeedback || !currentExercise) return;

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
        reorderWords(arrayMove(selectedWords, oldIndex, newIndex));
      }
    }
    // Case 2: Moving from bank to answer area (either to empty area or between words)
    else if (
      activeLocation === "bank" &&
      (overLocation === "answer" || overLocation === "selected")
    ) {
      const wordIndex = availableWords.findIndex(
        (word, i) => `bank-${word}-${i}` === activeId
      );

      // Determine insertion index if dropped on a selected word
      let insertIndex: number | undefined = undefined;
      if (overLocation === "selected") {
        insertIndex = parseInt(overIndex);
        if (isNaN(insertIndex)) insertIndex = undefined;
      }

      if (wordIndex !== -1 && availableWords[wordIndex] !== null) {
        selectWord(
          availableWords[wordIndex] as string,
          true,
          insertIndex,
          wordIndex
        );
      }
    }
    // Case 3: Moving from answer back to bank
    else if (activeLocation === "selected" && overLocation === "bank") {
      const wordIndex = parseInt(activeIndex);
      if (!isNaN(wordIndex) && wordIndex < selectedWords.length) {
        selectWord(selectedWords[wordIndex], false, wordIndex);
      }
    }
  };

  const handleCheck = () => {
    if (!currentExercise) return;
    checkAnswer(currentExercise.id, currentExercise.correctAnswer);
  };

  const handleContinue = () => {
    if (!currentExercise || !lesson) return;

    const { isLessonComplete } = continueToNextExercise(
      currentExercise.id,
      totalExercises,
      lesson.xpReward
    );

    if (isLessonComplete) {
      const currentHearts = useLessonStore.getState().hearts;
      if (currentHearts > 0) {
        // Success
        updateXP(lesson.xpReward);
        if (lessonId) {
          completeLesson(lessonId);
        }
        setLessonResult("success");
      } else {
        // Failure
        setLessonResult("failure");
      }
    }
  };

  const handleSkip = () => {
    if (!currentExerciseId) return;
    skipExercise(currentExerciseId);
  };

  const canCheck = selectedWords.length > 0 && !showFeedback;
  
  // Check if we are dragging a word from the bank and hovering over the answer area or its items
  const isAnswerAreaActive = 
    activeId?.startsWith("bank-") && 
    (overId === "answer-area" || overId?.startsWith("selected-"));

  // Determine if we should show a placeholder
  // Only when dragging from bank
  const isDraggingFromBank = activeId?.startsWith("bank-");
  let draggedWordWidth = 0;
  if (isDraggingFromBank && activeId) {
    const bankIndex = parseInt(activeId.split("-")[2]);
    if (!isNaN(bankIndex) && wordWidths.has(bankIndex)) {
      draggedWordWidth = wordWidths.get(bankIndex) || 0;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(event) => setOverId(event.over?.id as string || null)}
    >
      <div className="min-h-screen bg-duo-dark flex flex-col">
        {/* Header with progress */}
        <div className="bg-duo-dark border-b border-gray-700 p-4 sticky top-0 z-10">
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
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="max-w-3xl w-full">
            {/* Exercise type badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-linear-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-white text-base font-bold">
                {t("lesson.newWord")}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-white text-xl font-bold mb-2">
              {currentExercise.question}
            </h1>

            {/* Prompt text (if any) */}
            {currentExercise.prompt && (
              <div className="mb-2 flex items-center gap-4">
                <div className="text-6xl">💻</div>
                <div className="bg-gray-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <button className="text-duo-blue text-xl">🔊</button>
                  <code className="text-white text-base font-mono">
                    {currentExercise.prompt}
                  </code>
                </div>
              </div>
            )}

            {/* Code context (if any) */}
            {currentExercise.codeContext && (
              <div className="mb-2 bg-[#1e1e1e] px-4 py-2 rounded-2xl border border-gray-700/50">
                <div className="text-sm">
                  {/* Code before the blank */}
                  {currentExercise.codeContext.before.length > 0 && (
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                        fontSize: "0.75rem",
                        opacity: 0.6,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily:
                            'Consolas, Monaco, "Courier New", monospace',
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        },
                      }}
                      wrapLongLines={true}
                    >
                      {currentExercise.codeContext.before.join("\n")}
                    </SyntaxHighlighter>
                  )}

                  {/* Line with the blank */}
                  <div className="flex items-center gap-0 my-1 flex-wrap font-mono text-sm">
                    {currentExercise.codeContext.blankLine && (
                      <SyntaxHighlighter
                        language="typescript"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: 0,
                          background: "transparent",
                          fontSize: "0.75rem",
                          display: "inline",
                          opacity: 0.7,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily:
                              'Consolas, Monaco, "Courier New", monospace',
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          },
                        }}
                        wrapLongLines={true}
                      >
                        {currentExercise.codeContext.blankLine}
                      </SyntaxHighlighter>
                    )}
                    <span className="inline-flex px-4 py-0.5 bg-duo-blue/20 border-2 border-duo-blue/50 rounded-lg overflow-hidden animate-pulse">
                      {selectedWords.length > 0 ? (
                        <SyntaxHighlighter
                          language="typescript"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: 0,
                            background: "transparent",
                            fontSize: "0.75rem",
                            display: "inline",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                          codeTagProps={{
                            style: {
                              fontFamily:
                                'Consolas, Monaco, "Courier New", monospace',
                              whiteSpace: "pre-wrap",
                            },
                          }}
                          wrapLongLines={true}
                        >
                          {selectedWords.join(" ")}
                        </SyntaxHighlighter>
                      ) : (
                        <span className="text-duo-blue font-bold">___</span>
                      )}
                    </span>
                  </div>

                  {/* Code after the blank */}
                  {currentExercise.codeContext.after.length > 0 && (
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                        fontSize: "0.75rem",
                        opacity: 0.6,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily:
                            'Consolas, Monaco, "Courier New", monospace',
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        },
                      }}
                      wrapLongLines={true}
                    >
                      {currentExercise.codeContext.after.join("\n")}
                    </SyntaxHighlighter>
                  )}
                </div>
              </div>
            )}

            {/* Answer area */}
            <DroppableArea
              id="answer-area"
              className="mb-2 min-h-[60px] border-b-2 border-gray-700 pb-2 rounded-xl"
              active={!!isAnswerAreaActive}
            >
              <SortableContext
                items={selectedWords.map(
                  (word, index) => `selected-${word}-${index}`
                )}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-2 content-start">
                  {selectedWords.map((word, index) => {
                    const id = `selected-${word}-${index}`;
                    return (
                      <SortableWordButton
                        key={id}
                        id={id}
                        word={word}
                        onClick={() => selectWord(word, false, index)}
                        showFeedback={showFeedback}
                        isCorrect={isCorrect ?? false}
                        insertPlaceholder={isDraggingFromBank && overId === id}
                        placeholderWidth={draggedWordWidth}
                      />
                    );
                  })}
                  
                  {/* Append-to-end placeholder */}
                  {isDraggingFromBank && overId === "answer-area" && (
                    <div
                      className="rounded-2xl border-2 border-gray-600 bg-gray-800/50"
                      style={{
                        width: draggedWordWidth ? `${draggedWordWidth}px` : "100px",
                        height: "56px",
                      }}
                    />
                  )}
                </div>
              </SortableContext>
            </DroppableArea>

            {/* Word bank */}
            <DroppableArea id="bank-area" className="mb-2">
              <div className="flex flex-wrap gap-2 justify-center min-h-[60px] content-start">
                {availableWords.map((word, index) =>
                  word === null ? (
                    // Empty placeholder box to maintain layout with measured width
                    <div
                      key={`bank-placeholder-${index}`}
                      className="px-4 py-3 rounded-2xl border-2 border-dashed border-gray-700 bg-transparent flex items-center justify-center"
                      style={{
                        minWidth: wordWidths.has(index)
                          ? `${wordWidths.get(index)}px`
                          : undefined,
                      }}
                    >
                      <span className="opacity-0 text-lg font-bold">word</span>
                    </div>
                  ) : (
                    <DraggableWordButton
                      key={`available-${index}`}
                      id={`bank-${word}-${index}`}
                      word={word}
                      onClick={() => selectWord(word, true, undefined, index)}
                      disabled={showFeedback}
                      onMeasure={(width) => {
                        // Only store width if not already measured
                        if (!wordWidthsRef.current.has(index)) {
                          wordWidthsRef.current.set(index, width);
                          setWordWidth(index, width);
                        }
                      }}
                    />
                  )
                )}
              </div>
            </DroppableArea>

            {/* Tip (general advice) */}
            {currentExercise.tip && !showFeedback && (
              <div className="text-gray-400 text-xs italic mb-2">
                💡 {currentExercise.tip}
              </div>
            )}

            {/* Hint button and revealed hint */}
            {currentExercise.hint && !showFeedback && (
              <div className="mb-2">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    💭 Show Hint
                  </button>
                ) : (
                  <div className="bg-duo-blue/10 border border-duo-blue/30 px-3 py-2 rounded-lg">
                    <div className="text-duo-blue font-medium text-xs">
                      💡 Hint: {currentExercise.hint}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback message */}
            {showFeedback && (
              <div
                className={`mt-40 mb-2 p-5 rounded-2xl ${
                  isCorrect
                    ? "bg-green-500 bg-opacity-30"
                    : "bg-red-500 bg-opacity-30"
                }`}
              >
                <div className="flex items-center gap-4 text-white">
                  <span className="text-3xl font-bold">
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black">
                      {isCorrect ? t("lesson.excellent") : t("lesson.notQuite")}
                    </h3>
                    {!isCorrect && (
                      <p className="text-white/90 text-sm">
                        {t("lesson.correctAnswer")}{" "}
                        <span className="inline-flex gap-1">
                          {currentExercise.correctAnswer.map((word, idx) => (
                            <span className="" key={idx}>
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
        <div className="bg-duo-dark border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {/* Skip button - only show when not showing feedback */}
            {!showFeedback ? (
              <button
                onClick={handleSkip}
                className="px-8 py-3 rounded-2xl font-bold text-lg transition-all bg-transparent border-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-500"
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
                className={`px-12 py-3 rounded-2xl font-bold text-lg transition-all ${
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
                className={`px-12 py-3 rounded-2xl font-bold text-lg transition-all ${
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
