import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import type { LessonNode as LessonNodeType } from "../types";
import LessonPopover from "./LessonModal";
import { lessons } from "../data/lessons";

interface LessonNodeProps {
  node: LessonNodeType;
  onClick: () => void;
  isNext: boolean;
}

function LessonNode({ node, onClick, isNext }: LessonNodeProps) {
  const devMode = useStore((state) => state.devMode);

  // Effective status considers devMode
  const isLocked = node.status === "locked" && !devMode;
  const isCompleted = node.status === "completed";

  const getNodeStyles = () => {
    if (isLocked) {
      return {
        bg: "bg-gray-700",
        shadow: "shadow-none",
        border: "border-b-4 border-gray-600",
        cursor: "cursor-pointer", // Keep pointer to allow clicking (to show locked msg)
        icon: "🔒",
        showCheckmark: false,
        opacity: "opacity-60",
      };
    }
    if (isCompleted) {
      if (node.type === "story") {
        return {
          bg: "bg-gradient-to-b from-yellow-400 to-yellow-500",
          shadow: "shadow-lg shadow-yellow-500/30",
          border: "border-b-4 border-yellow-600",
          cursor: "cursor-pointer",
          icon: "📖",
          showCheckmark: true,
          opacity: "opacity-100",
        };
      }
      return {
        bg: "bg-gradient-to-b from-amber-400 to-amber-500",
        shadow: "shadow-lg shadow-amber-500/30",
        border: "border-b-4 border-amber-600",
        cursor: "cursor-pointer",
        icon: "✓",
        showCheckmark: true,
        opacity: "opacity-100",
      };
    }
    // Available / Next (or Locked but DevMode is on)
    if (node.type === "practice") {
      return {
        bg: "bg-gradient-to-b from-blue-400 to-blue-500",
        shadow: "shadow-lg shadow-blue-500/40",
        border: "border-b-4 border-blue-600",
        cursor: "cursor-pointer",
        icon: "⚡",
        showCheckmark: false,
        opacity: "opacity-100",
      };
    }
    return {
      bg: "bg-gradient-to-b from-cyan-400 to-cyan-500",
      shadow: "shadow-lg shadow-cyan-500/40",
      border: "border-b-4 border-cyan-600",
      cursor: "cursor-pointer",
      icon: "⚛️",
      showCheckmark: false,
      opacity: "opacity-100",
    };
  };

  const styles = getNodeStyles();

  return (
    <>
      {/* Ripple effect for the next lesson */}
      {isNext && !isLocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/30 -z-10"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        whileHover={!isLocked ? { scale: 1.1, y: -2 } : {}}
        whileTap={!isLocked ? { scale: 0.95, y: 2 } : {}}
        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full ${styles.bg} ${styles.shadow} ${styles.border} ${styles.cursor} ${styles.opacity} flex items-center justify-center text-4xl z-10`}
      >
        {node.type === "practice" && isCompleted ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="text-white text-3xl drop-shadow-md">💪</span>
          </div>
        ) : (
          <span className="text-white drop-shadow-md filter">
            {styles.icon}
          </span>
        )}

        {styles.showCheckmark && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center border-4 border-duo-dark shadow-sm z-20"
          >
            <span className="text-amber-500 text-lg md:text-xl font-bold">
              ✓
            </span>
          </motion.div>
        )}
      </motion.button>
    </>
  );
}

// Tooltip Component
function LessonTooltip({
  title,
  nodeColor,
}: {
  title: string;
  nodeColor: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-500 text-white",
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-500 text-yellow-900",
    amber: "bg-amber-500 text-amber-900",
    blue: "bg-blue-500 text-white",
    red: "bg-red-500 text-white",
    gray: "bg-gray-600 text-gray-200",
  };

  const bgClass = colorMap[nodeColor] || "bg-white text-gray-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.8 }}
      className="absolute -top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none whitespace-nowrap"
    >
      <div
        className={`${bgClass} px-4 py-2 rounded-xl font-bold text-sm shadow-xl border-2 border-white/10`}
      >
        {title}
      </div>
      {/* Triangle */}
      <div
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${bgClass} border-b-2 border-r-2 border-white/10`}
      />
    </motion.div>
  );
}

// Generate curved path data for SVG
function generatePathData(nodes: LessonNodeType[]) {
  if (nodes.length < 2) return "";

  // Sort nodes by vertical position (y) just in case
  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  let d = `M ${sortedNodes[0].position.x} ${sortedNodes[0].position.y}`;

  for (let i = 0; i < sortedNodes.length - 1; i++) {
    const p1 = sortedNodes[i].position;
    const p2 = sortedNodes[i + 1].position;

    // Calculate control points for a smooth S-curve
    // Control points are vertically halfway between p1 and p2
    const cp1x = p1.x;
    const cp1y = p1.y + (p2.y - p1.y) * 0.5;
    const cp2x = p2.x;
    const cp2y = p1.y + (p2.y - p1.y) * 0.5;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export default function LearningPath() {
  const { units, lastInteractedLessonId, setLastInteractedLessonId, devMode } =
    useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);

  // Store refs for all lesson nodes to scroll to specific ones
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Find the first available (unlocked but not completed) lesson
  const findFirstAvailableLesson = () => {
    for (const unit of units) {
      for (const node of unit.nodes) {
        if (node.status === "available") {
          return { node, unit };
        }
      }
    }
    return null;
  };

  const firstAvailable = findFirstAvailableLesson();

  // Scroll logic
  useEffect(() => {
    // Priority 1: Last interacted lesson (user clicked it recently)
    if (lastInteractedLessonId) {
      const nodeRef = nodeRefs.current.get(lastInteractedLessonId);
      if (nodeRef) {
        nodeRef.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    // Priority 2: First available lesson (next up)
    if (firstAvailable) {
      const nodeRef = nodeRefs.current.get(firstAvailable.node.id);
      if (nodeRef) {
        nodeRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  // Click handler to toggle selection
  const handleNodeClick = (nodeId: string) => {
    setLastInteractedLessonId(nodeId);
    if (selectedLessonId === nodeId) {
      setSelectedLessonId(null);
    } else {
      setSelectedLessonId(nodeId);
    }
  };

  const handleStartLesson = () => {
    if (selectedLessonId) {
      navigate(`/lesson/${selectedLessonId}`);
    }
  };

  const handleClosePopover = () => {
    setSelectedLessonId(null);
  };

  // Helper to determine node color name
  const getNodeColorName = (node: LessonNodeType) => {
    const isLocked = node.status === "locked" && !devMode;
    if (isLocked) return "gray";
    if (node.status === "completed") {
      return node.type === "story" ? "yellow" : "amber";
    }
    if (node.type === "practice") return "blue";
    return "cyan";
  };

  return (
    <div
      className="min-h-screen bg-[#131F24] overflow-y-auto relative"
      onClick={() => setSelectedLessonId(null)} // Close popover when clicking background
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-3xl mx-auto py-8 px-4 md:py-12 md:px-6 relative z-10">
        {/* Header - React Themed */}
        <div className="mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1e293b] rounded-3xl p-6 border-2 border-[#334155] shadow-xl overflow-hidden relative"
          >
            {/* Header Background Decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div 
                className="text-left flex-1 cursor-pointer group"
                onClick={() => navigate('/sections')}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-cyan-400 text-2xl font-bold transition-transform group-hover:-translate-x-2">
                    ←
                  </div>
                  <div>
                    <h2 className="text-cyan-400 text-sm font-bold tracking-wider mb-2 uppercase group-hover:text-cyan-300 transition-colors">
                      {units[0]?.title
                        ? t(`units.${units[0].title}.title`)
                        : "Unit 1"}
                    </h2>
                    <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-2">
                      {units[0]?.description
                        ? t(`units.${units[0].description}.description`)
                        : "React Basics"}
                    </h1>
                    <p className="text-slate-400 text-sm">
                      Master components, props, and state
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open("https://react.dev/learn", "_blank");
                  }}
                >
                  <span className="text-lg">📘</span> Guidebook
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Units */}
        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="mb-24">
            {/* Unit Header (Simplified for subsequent units) */}
            {unitIndex > 0 && (
              <div className="mb-16 text-center">
                <div className="h-px w-full bg-gray-800 mb-6" />
                <h2 className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                  {t(`units.${unit.description}.description`)}
                </h2>
              </div>
            )}

            {/* Lesson Nodes */}
            <div className="relative min-h-[500px]">
              {/* SVG Curved Path */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d={generatePathData(unit.nodes)}
                  fill="none"
                  stroke="#202F36"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {unit.nodes.map((node) => {
                const isSelected = selectedLessonId === node.id;
                const isHovered = hoveredLessonId === node.id;
                const nodeColor = getNodeColorName(node);
                const realLesson = lessons[node.id];
                const displayTitle =
                  realLesson?.title ||
                  t(`lessons.${node.title}.title`) ||
                  node.title;

                return (
                  <div
                    key={node.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                      else nodeRefs.current.delete(node.id);
                    }}
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${node.position.x}%`,
                      top: `${node.position.y}%`,
                      // Bring to front if selected or hovered
                      zIndex: isSelected || isHovered ? 50 : 10,
                    }}
                    onMouseEnter={() => setHoveredLessonId(node.id)}
                    onMouseLeave={() => setHoveredLessonId(null)}
                  >
                    <LessonNode
                      node={node}
                      onClick={() => handleNodeClick(node.id)}
                      isNext={firstAvailable?.node.id === node.id}
                    />

                    {/* Tooltip (Hover) - Only show if not selected */}
                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <LessonTooltip
                          title={displayTitle}
                          nodeColor={nodeColor}
                        />
                      )}
                    </AnimatePresence>

                    {/* Popover (Selected) */}
                    <AnimatePresence>
                      {isSelected && (
                        <LessonPopover
                          lessonId={node.id}
                          status={node.status}
                          onClose={handleClosePopover}
                          onStart={handleStartLesson}
                          nodeColor={nodeColor}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* START tooltip - Animated */}
              <AnimatePresence>
                {firstAvailable &&
                  firstAvailable.unit.id === unit.id &&
                  !selectedLessonId && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute z-20 -translate-x-1/2 pointer-events-none"
                      style={{
                        left: `${firstAvailable.node.position.x}%`,
                        top: `calc(${firstAvailable.node.position.y}% - 85px)`,
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative"
                      >
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-gray-200">
                          <span className="text-duo-green font-extrabold text-sm tracking-widest">
                            START
                          </span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b-4 border-r-4 border-gray-200 transform translate-y-[-50%]"></div>
                      </motion.div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
