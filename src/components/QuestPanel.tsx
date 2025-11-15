import { useStore } from '../store/useStore';

export default function QuestPanel() {
  const { user, quests } = useStore();

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-duo-dark border-l border-gray-700 overflow-y-auto p-6">
      {/* User Stats Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-700 px-3 py-1.5 rounded-lg">
            <span className="text-2xl">🇺🇸</span>
            <span className="text-white font-bold">{user.streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-700 px-3 py-1.5 rounded-lg">
            <span className="text-xl">🔥</span>
            <span className="text-duo-orange font-bold">{user.lingots}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-700 px-3 py-1.5 rounded-lg">
            <span className="text-xl">💎</span>
            <span className="text-duo-blue font-bold">{user.gems}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-700 px-3 py-1.5 rounded-lg">
            <span className="text-xl">👥</span>
          </div>
        </div>
      </div>

      {/* League Section */}
      <div className="bg-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">자수정 리그</h2>
          <button className="text-duo-blue text-sm font-semibold hover:underline">
            리그 보기
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-duo-purple rounded-2xl flex items-center justify-center text-3xl relative">
            <span>🔮</span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 text-sm mb-1">
              현재 순위 <span className="text-red-400 font-bold">19위</span>입니다
            </p>
            <p className="text-gray-400 text-xs">
              리그 강등 구간이 아닙니다 하락했습니다!
            </p>
          </div>
        </div>
      </div>

      {/* Quests Section */}
      <div className="bg-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">오늘의 퀘스트</h2>
          <button className="text-duo-blue text-sm font-semibold hover:underline">
            모두 보기
          </button>
        </div>

        <div className="space-y-4">
          {quests.map((quest) => {
            const progressPercent = (quest.progress / quest.total) * 100;
            return (
              <div key={quest.id} className="flex items-start gap-3">
                <div className="w-12 h-12 bg-duo-yellow rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-2">
                    {quest.title}
                  </h3>
                  <div className="relative">
                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-duo-yellow rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {quest.progress} / {quest.total}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏆</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-around mt-6 border-t border-gray-700 pt-4">
        <button className="text-gray-400 text-xs hover:text-white">정보</button>
        <button className="text-gray-400 text-xs hover:text-white">스토어</button>
        <button className="text-gray-400 text-xs hover:text-white">학습 효과</button>
        <button className="text-gray-400 text-xs hover:text-white">인재 채용</button>
        <button className="text-gray-400 text-xs hover:text-white">투자자</button>
        <button className="text-gray-400 text-xs hover:text-white">규정</button>
      </div>

      <div className="text-center mt-2">
        <button className="text-gray-500 text-xs hover:text-gray-300">개인정보보호</button>
      </div>
    </div>
  );
}
