import { useStore } from "../../store/useStore";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#111b21] text-white p-6 pb-24 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header / Basic Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-800 pb-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#1cb0f6] rounded-full flex items-center justify-center text-6xl font-bold border-4 border-[#131F24] shadow-[0_0_0_4px_#2b3842]">
              {user.name.charAt(0)}
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#131F24]"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-1">{user.name}</h1>
            <p className="text-gray-400 text-lg mb-4">@{user.username || "username"}</p>
            
            <p className="text-gray-500 text-sm mb-6">
              Joined {user.joinedAt || "Recently"}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <div className="flex items-center gap-2">
                 <span className="font-bold">{user.following || 0}</span>
                 <span className="text-gray-400 uppercase text-xs tracking-wider font-bold">Following</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="font-bold">{user.followers || 0}</span>
                 <span className="text-gray-400 uppercase text-xs tracking-wider font-bold">Followers</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             <button className="p-3 rounded-2xl border-2 border-gray-700 hover:bg-gray-800 transition-colors">
               ✏️
             </button>
             <button className="p-3 rounded-2xl border-2 border-gray-700 hover:bg-gray-800 transition-colors">
               ⚙️
             </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
             icon="🔥" 
             value={user.streak.toString()} 
             label="Day Streak" 
             color="text-orange-500"
          />
          <StatCard 
             icon="⚡" 
             value={user.totalXp?.toLocaleString() || "0"} 
             label="Total XP" 
             color="text-yellow-400"
          />
          <StatCard 
             icon="💎" 
             value={user.league} 
             label="Current League" 
             color="text-purple-400"
          />
          <StatCard 
             icon="👑" 
             value="3" 
             label="Top 3 Finishes" 
             color="text-yellow-200"
          />
        </div>

        {/* Achievements Section */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-[#131F24]">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">Achievements</h2>
             <span className="text-blue-400 font-bold text-sm uppercase cursor-pointer hover:text-blue-300">View All</span>
          </div>
          
          <div className="space-y-4">
             <AchievementRow 
               icon="🔥" 
               title="Wildfire" 
               desc="Reach a 7 day streak" 
               level={3} 
               maxLevel={10} 
               progress={user.streak} 
               total={7}
               color="bg-orange-500"
             />
             <AchievementRow 
               icon="⚔️" 
               title="Warrior" 
               desc="Earn 100 XP in a day" 
               level={1} 
               maxLevel={5} 
               progress={85} 
               total={100}
               color="bg-red-500"
             />
             <AchievementRow 
               icon="🎯" 
               title="Sharpshooter" 
               desc="Complete a lesson with no mistakes" 
               level={5} 
               maxLevel={5} 
               progress={1} 
               total={1}
               color="bg-yellow-500"
               completed
             />
          </div>
        </div>

        {/* Friends Section */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-[#131F24]">
          <h2 className="text-xl font-bold mb-6">Friends</h2>
          <div className="bg-[#111b21] rounded-xl p-8 text-center border-2 border-dashed border-gray-700">
             <div className="text-4xl mb-4">👋</div>
             <h3 className="font-bold text-lg mb-2">Learn with friends</h3>
             <p className="text-gray-400 mb-6 text-sm">Learning is more fun together! Follow your friends to see their progress.</p>
             <button className="bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-bold py-3 px-8 rounded-2xl w-full border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all">
               FIND FRIENDS
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ icon, value, label, color }: { icon: string, value: string, label: string, color: string }) {
  return (
    <div className="border border-gray-800 rounded-2xl p-4 flex items-center gap-4 bg-[#131F24] hover:bg-[#18262e] transition-colors cursor-default">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className={`font-extrabold text-xl ${color}`}>{value}</div>
        <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

function AchievementRow({ icon, title, desc, level, maxLevel, progress, total, color, completed = false }: any) {
  const percent = Math.min((progress / total) * 100, 100);
  
  return (
    <div className="flex gap-4 items-center">
      <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl shrink-0 border-b-4 relative overflow-hidden ${completed ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-800 border-gray-900'}`}>
        {completed && <div className="absolute inset-0 bg-yellow-400 opacity-20 animate-pulse"></div>}
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold">{title}</h3>
          <span className="text-gray-500 text-sm">Level {level}/{maxLevel}</span>
        </div>
        <p className="text-gray-400 text-sm mb-3">{desc}</p>
        
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${color}`}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 drop-shadow-md">
            {progress} / {total}
          </div>
        </div>
      </div>
    </div>
  );
}
