export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  reward: number;
}

export interface User {
  name: string;
  username?: string;
  level: number;
  xp: number;
  streak: number;
  gems: number;
  lingots: number;
  league: string;
  leagueRank: number;
  joinedAt?: string;
  following?: number;
  followers?: number;
  totalXp?: number;
  courses?: { name: string; xp: number }[];
  completedLessonIds: string[];
}

export interface LessonNode {
  id: string;
  title: string;
  type: 'lesson' | 'story' | 'practice' | 'unit-review' | 'chest';
  status: 'locked' | 'available' | 'completed';
  level: number;
  position: { x: number; y: number };
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  number: number;
  nodes: LessonNode[];
}
