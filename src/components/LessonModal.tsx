import { lessons } from '../data/lessons';
import { useStore } from '../store/useStore';

interface LessonModalProps {
  lessonId: string;
  status: 'available' | 'locked' | 'completed';
  onClose: () => void;
  onStart: () => void;
}

export default function LessonModal({ lessonId, status, onClose, onStart }: LessonModalProps) {
  const lesson = lessons[lessonId];
  const unlockLesson = useStore((state) => state.unlockLesson);

  if (!lesson) return null;

  const isLocked = status === 'locked';

  const handleUnlock = () => {
    unlockLesson(lessonId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-md w-full mx-4">
        {/* Star/Lock icon at top */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-8 border-duo-dark shadow-2xl">
            <span className="text-4xl">{isLocked ? '🔒' : '⭐'}</span>
          </div>
        </div>

        {/* Main card */}
        <div className={`bg-linear-to-br ${isLocked ? 'from-gray-600 to-gray-700' : 'from-duo-orange to-orange-600'} rounded-3xl p-8 shadow-2xl`}>
          <div className="text-center mb-6">
            {isLocked && (
              <div className="mb-3">
                <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Locked
                </span>
              </div>
            )}
            <h2 className="text-white text-2xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-white text-opacity-90 text-sm">{lesson.description}</p>
          </div>

          {/* Action buttons */}
          {isLocked ? (
            <div className="space-y-3">
              <button
                onClick={handleUnlock}
                className="w-full bg-duo-green hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg uppercase"
              >
                🔓 Unlock Lesson
              </button>
              <p className="text-white text-opacity-75 text-center text-xs">
                Unlock this lesson to access the content
              </p>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="w-full bg-white hover:bg-gray-100 text-duo-orange font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg uppercase"
            >
              Start +{lesson.xpReward} XP
            </button>
          )}

          {/* Decorative tail */}
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
            <div className={`w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-t-20 ${isLocked ? 'border-t-gray-700' : 'border-t-orange-600'}`}></div>
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
