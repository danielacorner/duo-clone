import { lessons } from '../data/lessons';

interface LessonModalProps {
  lessonId: string;
  onClose: () => void;
  onStart: () => void;
}

export default function LessonModal({ lessonId, onClose, onStart }: LessonModalProps) {
  const lesson = lessons[lessonId];

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-md w-full mx-4">
        {/* Star icon at top */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-8 border-duo-dark shadow-2xl">
            <span className="text-4xl">⭐</span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-linear-to-br from-duo-orange to-orange-600 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-white text-opacity-90 text-sm">{lesson.description}</p>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full bg-white hover:bg-gray-100 text-duo-orange font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg uppercase"
          >
            Start +{lesson.xpReward} XP
          </button>

          {/* Decorative tail */}
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-t-20 border-t-orange-600"></div>
          </div>
        </div>

        {/* Character at bottom */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-8 border-duo-dark shadow-xl">
            <span className="text-4xl">💻</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl hover:scale-110 transition-transform"
        >
          ×
        </button>
      </div>
    </div>
  );
}
