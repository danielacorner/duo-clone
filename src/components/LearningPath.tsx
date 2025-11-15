import { useStore } from '../store/useStore';
import type { LessonNode as LessonNodeType } from '../types';

interface LessonNodeProps {
  node: LessonNodeType;
  onClick: () => void;
}

function LessonNode({ node, onClick }: LessonNodeProps) {
  const getNodeColor = () => {
    if (node.status === 'locked') return 'bg-gray-600 cursor-not-allowed';
    if (node.status === 'completed') return 'bg-duo-yellow hover:bg-yellow-500';
    return 'bg-duo-green hover:bg-green-600';
  };

  const getNodeIcon = () => {
    if (node.type === 'story') return '📖';
    if (node.type === 'practice') return '🔧';
    if (node.type === 'unit-review') return '⭐';
    if (node.type === 'chest') return '🎁';
    return '📝';
  };

  const getNodeStatus = () => {
    if (node.status === 'completed') return '✓';
    if (node.status === 'locked') return '🔒';
    return '';
  };

  return (
    <div
      className="absolute"
      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
    >
      <button
        onClick={onClick}
        disabled={node.status === 'locked'}
        className={`w-20 h-20 rounded-full ${getNodeColor()} transition-all transform hover:scale-110 shadow-lg flex items-center justify-center text-3xl relative group`}
      >
        <span>{getNodeIcon()}</span>
        {node.status === 'completed' && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">{getNodeStatus()}</span>
          </div>
        )}
        {node.status === 'locked' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </button>

      {/* Connecting line to next node */}
      <svg className="absolute top-full left-1/2 -translate-x-1/2" width="4" height="60">
        <line x1="2" y1="0" x2="2" y2="60" stroke="#4B5563" strokeWidth="4" strokeDasharray="8,4" />
      </svg>
    </div>
  );
}

export default function LearningPath() {
  const { units } = useStore();

  const handleNodeClick = (nodeId: string) => {
    console.log('Clicked node:', nodeId);
    // Future: navigate to lesson
  };

  return (
    <div className="ml-20 mr-96 min-h-screen bg-gradient-to-b from-duo-dark to-gray-900 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 bg-duo-blue px-8 py-4 rounded-3xl mb-6">
            <span className="text-4xl">🦉</span>
            <div className="text-left">
              <h1 className="text-white text-2xl font-bold">섹션 4, 유닛 10</h1>
              <p className="text-white text-sm opacity-90">업무 프로젝트 논의하기</p>
            </div>
            <button className="ml-4 bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all">
              <span className="text-white text-xl">📋</span>
            </button>
          </div>

          {/* Success indicators */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="w-20 h-20 bg-duo-blue rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">✓</span>
            </div>
            <div className="w-20 h-20 bg-duo-blue rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🏆</span>
            </div>
          </div>

          <div className="w-full h-1 bg-gray-700 rounded-full mb-4">
            <div className="h-full w-1/3 bg-gradient-to-r from-duo-blue to-duo-purple rounded-full" />
          </div>
          <p className="text-gray-400 text-sm">자기계발 조언하기</p>
        </div>

        {/* Units */}
        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="mb-24">
            {/* Unit Header */}
            <div className="mb-12 text-center">
              <div className="inline-block bg-gradient-to-r from-duo-blue to-duo-purple px-6 py-3 rounded-2xl mb-3">
                <h2 className="text-white text-xl font-bold">{unit.title}</h2>
              </div>
              <p className="text-gray-400 text-sm">{unit.description}</p>
            </div>

            {/* Lesson Nodes */}
            <div className="relative min-h-[500px]">
              {/* Background path line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-700 -translate-x-1/2 opacity-30" />

              {unit.nodes.map((node, nodeIndex) => (
                <LessonNode
                  key={node.id}
                  node={node}
                  onClick={() => handleNodeClick(node.id)}
                />
              ))}

              {/* Unit completion treasure chest or icon */}
              {unitIndex === 0 && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-24 bg-gray-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg relative">
                    <span>🔒</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Bottom character */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl">🦉</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gray-600 px-4 py-2 rounded-xl">
              <span className="text-white text-sm font-semibold">시작</span>
            </div>
          </div>
        </div>

        {/* Guide Book Button */}
        <div className="text-center">
          <button className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-2xl transition-all shadow-lg">
            <span className="text-4xl block mb-2">📚</span>
            <span className="text-white text-sm font-semibold">가이드북</span>
          </button>
        </div>
      </div>
    </div>
  );
}
