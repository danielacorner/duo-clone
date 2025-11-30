import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { LessonNode as LessonNodeType } from '../types';
import LessonModal from './LessonModal';

interface LessonNodeProps {
  node: LessonNodeType;
  onClick: () => void;
}

function LessonNode({ node, onClick }: LessonNodeProps) {
  const getNodeStyles = () => {
    if (node.status === 'locked') {
      return {
        bg: 'bg-gray-700',
        shadow: 'shadow-lg',
        border: 'border-4 border-gray-800',
        cursor: 'cursor-not-allowed',
        icon: '🔒',
        showCheckmark: false,
      };
    }
    if (node.status === 'completed') {
      if (node.type === 'story') {
        return {
          bg: 'bg-gradient-to-br from-pink-400 to-pink-500',
          shadow: 'shadow-xl shadow-pink-500/50',
          border: 'border-4 border-pink-300',
          cursor: 'cursor-pointer hover:scale-110',
          icon: '📖',
          showCheckmark: true,
        };
      }
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
        shadow: 'shadow-xl shadow-yellow-500/50',
        border: 'border-4 border-yellow-300',
        cursor: 'cursor-pointer hover:scale-110',
        icon: '✓',
        showCheckmark: true,
      };
    }
    // Available
    if (node.type === 'practice') {
      return {
        bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        shadow: 'shadow-xl shadow-pink-500/50',
        border: 'border-4 border-pink-300',
        cursor: 'cursor-pointer hover:scale-110',
        icon: '🔄',
        showCheckmark: false,
      };
    }
    return {
      bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
      shadow: 'shadow-xl shadow-pink-500/50',
      border: 'border-4 border-pink-300',
      cursor: 'cursor-pointer hover:scale-110',
      icon: '📝',
      showCheckmark: false,
    };
  };

  const styles = getNodeStyles();

  return (
    <div
      className="absolute transform -translate-x-1/2"
      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
    >
      <button
        onClick={onClick}
        disabled={node.status === 'locked'}
        className={`relative w-24 h-24 rounded-full ${styles.bg} ${styles.shadow} ${styles.border} ${styles.cursor} transition-all duration-300 flex items-center justify-center text-4xl font-bold`}
      >
        {node.type === 'practice' && node.status === 'completed' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#EC4899"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * 0.3}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white text-3xl">💪</span>
          </div>
        ) : (
          <span className="text-white drop-shadow-lg">{styles.icon}</span>
        )}

        {styles.showCheckmark && (
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-duo-dark shadow-lg">
            <span className="text-duo-yellow text-2xl font-bold">✓</span>
          </div>
        )}
      </button>
    </div>
  );
}

export default function LearningPath() {
  const { units } = useStore();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string, status: string) => {
    // Only open modal for available or completed lessons
    if (status !== 'locked') {
      setSelectedLesson(nodeId);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-duo-dark to-gray-900 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-400 to-pink-500 px-8 py-5 rounded-3xl mb-6 shadow-xl">
            <button className="text-white text-2xl hover:scale-110 transition-transform">←</button>
            <div className="text-left flex-1">
              <p className="text-white text-xs opacity-80 mb-1">섹션 4, 유닛 11</p>
              <h1 className="text-white text-xl font-bold">자기계발 조언하기</h1>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all">
              <span className="text-white text-xl">📋</span>
            </button>
          </div>

          <div className="w-full h-1 bg-gray-700 rounded-full mb-2 max-w-md mx-auto">
            <div className="h-full w-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full" />
          </div>
          <p className="text-gray-500 text-sm mb-8">자기계발 조언하기</p>
        </div>

        {/* Units */}
        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="mb-24">
            {/* Unit Header */}
            <div className="mb-16 text-center">
              <div className="h-px w-full bg-gray-700 mb-4" />
              <h2 className="text-gray-500 text-sm font-semibold tracking-wider">{unit.description}</h2>
            </div>

            {/* Lesson Nodes */}
            <div className="relative min-h-[600px]">
              {/* Background path line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-700 -translate-x-1/2 opacity-20" />

              {unit.nodes.map((node, nodeIndex) => (
                <LessonNode
                  key={node.id}
                  node={node}
                  onClick={() => handleNodeClick(node.id, node.status)}
                />
              ))}

              {/* Character illustration - appears after 3rd lesson */}
              {unitIndex === 0 && (
                <>
                  <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      {/* Character */}
                      <div className="w-40 h-32 flex items-center justify-center">
                        <div className="text-7xl transform rotate-12">🧑‍💼</div>
                      </div>
                      {/* Speech bubble with "시작" */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-700 px-6 py-2 rounded-2xl shadow-lg">
                        <span className="text-white font-bold text-sm">시작</span>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Treasure Chest */}
                  <div className="absolute left-1/2 top-[85%] -translate-x-1/2">
                    <div className="w-28 h-28 bg-gray-700 rounded-2xl flex items-center justify-center text-5xl shadow-2xl border-4 border-gray-800 relative">
                      <span>🏺</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Bottom Icons */}
        <div className="flex justify-center gap-8 mb-16">
          {/* Guidebook */}
          <button className="group">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-lg hover:bg-gray-600 transition-all border-4 border-gray-800">
              📚
            </div>
          </button>

          {/* Star Achievement */}
          <button className="group">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-lg hover:bg-gray-600 transition-all border-4 border-gray-800">
              ⭐
            </div>
          </button>

          {/* Trophy Achievement */}
          <button className="group">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-lg hover:bg-gray-600 transition-all border-4 border-gray-800">
              🏆
            </div>
          </button>
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLesson && (
        <LessonModal
          lessonId={selectedLesson}
          onClose={handleCloseModal}
          onStart={handleStartLesson}
        />
      )}
    </div>
  );
}
