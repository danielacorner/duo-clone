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
  level: number;
  xp: number;
  streak: number;
  gems: number;
  lingots: number;
  league: string;
  leagueRank: number;
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
