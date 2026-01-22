import { motion } from "framer-motion";
import { lessons } from "../data/lessons";
import { useStore } from "../store/useStore";

interface LessonPopoverProps {
  lessonId: string;
  status: "available" | "locked" | "completed";
  onClose: () => void;
  onStart: () => void;
  nodeColor: string; // "cyan", "green", "red", etc.
}

export default function LessonPopover({
  lessonId,
  status,
  onStart,
  nodeColor,
}: LessonPopoverProps) {
  const lesson = lessons[lessonId];
  const devMode = useStore((state) => state.devMode);

  if (!lesson) return null;

  // Determine effective status (if devMode is on, treat locked as available for interactions)
  const isLocked = status === "locked" && !devMode;

  // Map node colors to Tailwind classes
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
  };
  
  const headerColor = colorMap[nodeColor] || "bg-cyan-500";
  const btnColor = colorMap[nodeColor] || "bg-cyan-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", duration: 0.3 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 z-50 pointer-events-auto"
      onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
    >
      {/* Arrow */}
      <div 
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${headerColor}`} 
      />

      <div className="bg-[#131F24] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#202F36]">
        {/* Header */}
        <div className={`${headerColor} p-4`}>
          <h3 className="text-white font-bold text-lg leading-tight">
            {lesson.title}
          </h3>
          <p className="text-white/90 text-sm mt-1">
            {lesson.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#131F24]">
          {isLocked ? (
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border-2 border-gray-700 border-dashed">
              <span className="text-2xl mb-2 block">🔒</span>
              <p className="text-gray-400 text-sm font-medium">Complete previous lessons to unlock</p>
            </div>
          ) : (
            <button
              onClick={onStart}
              className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-105 active:scale-95 uppercase tracking-wide ${btnColor}`}
            >
              Start +{lesson.xpReward} XP
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}