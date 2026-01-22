import { useStore } from "../store/useStore";
import { motion } from "framer-motion";

export default function DevModeToggle() {
  const { devMode, toggleDevMode } = useStore();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleDevMode}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl border-4 font-bold text-lg flex items-center justify-center transition-colors ${
        devMode
          ? "bg-red-500 border-red-700 text-white"
          : "bg-gray-800 border-gray-600 text-gray-400"
      }`}
      title={devMode ? "Switch to User Mode" : "Switch to Dev Mode"}
    >
      {devMode ? "🛠️ Dev" : "👤 User"}
    </motion.button>
  );
}
