import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import type { LessonNode as LessonNodeType } from "../types";
import LessonModal from "./LessonModal";


interface LessonNodeProps {
  node: LessonNodeType;
  onClick: () => void;
  isAvailable: boolean;
  isNext: boolean;
}

function LessonNode({
  node,
  onClick,
  isNext,
}: Omit<LessonNodeProps, "isAvailable">) {
  const getNodeStyles = () => {
    if (node.status === "locked") {
      return {
        bg: "bg-gray-700",
        shadow: "shadow-none",
        border: "border-b-4 border-gray-600",
        cursor: "cursor-pointer",
        icon: "🔒",
        showCheckmark: false,
        opacity: "opacity-60",
      };
    }
    if (node.status === "completed") {
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
    // Available / Next
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
    <div
      className="absolute transform -translate-x-1/2"
      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
    >
      {/* Ripple effect for the next lesson */}
      {isNext && (
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/30"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.button
        onClick={onClick}
        whileHover={node.status !== "locked" ? { scale: 1.1, y: -2 } : {}}
        whileTap={node.status !== "locked" ? { scale: 0.95, y: 2 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full ${styles.bg} ${styles.shadow} ${styles.border} ${styles.cursor} ${styles.opacity} flex items-center justify-center text-4xl z-10`}
      >
        {node.type === "practice" && node.status === "completed" ? (
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
    </div>
  );
}

export default function LearningPath() {
  const { units, lastInteractedLessonId, setLastInteractedLessonId, devMode } =
    useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

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
  }, [lastInteractedLessonId, firstAvailable]);

  const handleNodeClick = (nodeId: string) => {
    setLastInteractedLessonId(nodeId);
    setSelectedLesson(nodeId);
  };

  const handleStartLesson = () => {
    if (selectedLesson) {
      navigate(`/lesson/${selectedLesson}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-[#131F24] overflow-y-auto relative">
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
              <div className="text-left flex-1">
                <h2 className="text-cyan-400 text-sm font-bold tracking-wider mb-2 uppercase">
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

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                  onClick={() =>
                    window.open("https://react.dev/learn", "_blank")
                  }
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
              {/* Background path line */}
              {/* Using SVG for a smoother curved path could be an upgrade, but keeping simple line for now */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-[#202F36] -translate-x-1/2 rounded-full" />

              {unit.nodes.map((node) => {
                // In Dev Mode, treat locked nodes as available
                const effectiveStatus =
                  devMode && node.status === "locked"
                    ? "available"
                    : node.status;
                const effectiveNode = { ...node, status: effectiveStatus };

                return (
                  <div
                    key={node.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                      else nodeRefs.current.delete(node.id);
                    }}
                  >
                    <LessonNode
                      node={effectiveNode}
                      onClick={() => handleNodeClick(node.id)}
                      isNext={firstAvailable?.node.id === node.id}
                    />
                  </div>
                );
              })}

              {/* START tooltip - Animated */}
              <AnimatePresence>
                {firstAvailable && firstAvailable.unit.id === unit.id && (
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

        {/* Bottom Floating Menu - Playful & Useful */}
        {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="flex items-center gap-4 bg-[#1e293b]/90 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700 shadow-2xl"
          >
            {[
              { icon: "📚", label: "Guide" },
              { icon: "⚛️", label: "Practice", active: true },
              { icon: "🏆", label: "Rank" }
            ].map((item, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                  item.active 
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" 
                    : "hover:bg-gray-700 text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        </div> */}
        {/* Decided to comment out for now */}
      </div>

      {/* Lesson Modal */}
      {selectedLesson &&
        (() => {
          const selectedNode = units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === selectedLesson);

          const effectiveStatus =
            devMode && selectedNode?.status === "locked"
              ? "available"
              : selectedNode?.status || "locked";

          return (
            <LessonModal
              lessonId={selectedLesson}
              status={effectiveStatus}
              onClose={handleCloseModal}
              onStart={handleStartLesson}
            />
          );
        })()}
    </div>
  );
}
