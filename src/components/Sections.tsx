import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Sections() {
  const { units } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#131F24] p-4 pb-20 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Sections</h1>

        {units.map((unit, index) => {
          const completedNodes = unit.nodes.filter(
            (n) => n.status === "completed"
          ).length;
          const totalNodes = unit.nodes.length;
          const progress = Math.round((completedNodes / totalNodes) * 100);
          const isLocked = index > 0 && units[index - 1].nodes.some(n => n.status !== "completed"); 

          return (
            <motion.div
              key={unit.id}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              onClick={() => !isLocked && navigate("/learn")}
              className={`rounded-2xl p-6 border-2 transition-colors relative overflow-hidden group ${
                isLocked 
                  ? "bg-gray-800 border-gray-700 cursor-not-allowed opacity-60" 
                  : "bg-[#1e293b] border-[#334155] cursor-pointer hover:border-cyan-500"
              }`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <h2 className={`text-sm font-bold tracking-wider uppercase mb-1 ${isLocked ? "text-gray-500" : "text-cyan-400"}`}>
                    {t(`units.${unit.title}.title`) || `Unit ${unit.number}`}
                  </h2>
                  <div className="flex items-center gap-2">
                    {isLocked && <span className="text-xl">🔒</span>}
                    <h3 className={`text-xl font-bold mb-2 ${isLocked ? "text-gray-400" : "text-white"}`}>
                      {t(`units.${unit.description}.description`) || unit.description}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    {completedNodes} / {totalNodes} lessons completed
                  </p>
                </div>
                
                {/* Progress Circle or Icon */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                     <circle
                       cx="32"
                       cy="32"
                       r="28"
                       stroke="#334155"
                       strokeWidth="4"
                       fill="none"
                     />
                     <circle
                       cx="32"
                       cy="32"
                       r="28"
                       stroke={progress === 100 ? "#22c55e" : "#06b6d4"}
                       strokeWidth="4"
                       fill="none"
                       strokeDasharray="176"
                       strokeDashoffset={176 - (176 * progress) / 100}
                       className="transition-all duration-1000 ease-out"
                     />
                   </svg>
                   <span className="absolute text-white font-bold text-sm">
                     {progress}%
                   </span>
                </div>
              </div>

              {/* Background Progress Bar (Optional, simpler visual) */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
