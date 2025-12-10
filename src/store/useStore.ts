import { create } from "zustand";
import type { User, Quest, Unit } from "../types";

interface AppState {
  user: User;
  quests: Quest[];
  units: Unit[];
  updateXP: (amount: number) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeLesson: (lessonId: string) => void;
}

const mockQuests: Quest[] = [
  {
    id: "1",
    title: "30 XP 획득하기",
    description: "Earn 30 XP",
    icon: "⚡",
    progress: 8,
    total: 30,
    reward: 0,
  },
  {
    id: "2",
    title: "콤보 보너스 XP 15개 획득하기",
    description: "Get combo bonus XP 15 times",
    icon: "⚡",
    progress: 3,
    total: 15,
    reward: 0,
  },
  {
    id: "3",
    title: "레슨 3개에서 80% 이상의 점수 받기",
    description: "Get 80% or higher in 3 lessons",
    icon: "🎯",
    progress: 1,
    total: 3,
    reward: 0,
  },
];

const mockUnits: Unit[] = [
  {
    id: "unit-1",
    title: "유닛 1",
    description: "자기계발 조언하기",
    number: 1,
    nodes: [
      {
        id: "lesson-1",
        title: "레슨 1",
        type: "lesson",
        status: "completed",
        level: 1,
        position: { x: 45, y: 5 },
      },
      {
        id: "lesson-2",
        title: "레슨 2",
        type: "story",
        status: "completed",
        level: 1,
        position: { x: 60, y: 18 },
      },
      {
        id: "lesson-3",
        title: "레슨 3",
        type: "lesson",
        status: "completed",
        level: 1,
        position: { x: 39, y: 31 },
      },
      {
        id: "practice-1",
        title: "연습",
        type: "practice",
        status: "completed",
        level: 1,
        position: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: "unit-2",
    title: "유닛 2",
    description: "기본 회화",
    number: 2,
    nodes: [
      {
        id: "lesson-4",
        title: "레슨 1",
        type: "lesson",
        status: "available",
        level: 2,
        position: { x: 45, y: 10 },
      },
      {
        id: "lesson-5",
        title: "레슨 2",
        type: "lesson",
        status: "locked",
        level: 2,
        position: { x: 35, y: 25 },
      },
      {
        id: "lesson-6",
        title: "레슨 3",
        type: "lesson",
        status: "locked",
        level: 2,
        position: { x: 50, y: 40 },
      },
    ],
  },
  {
    id: "unit-3",
    title: "유닛 3",
    description: "음식 주문하기",
    number: 3,
    nodes: [
      {
        id: "lesson-7",
        title: "레슨 1",
        type: "lesson",
        status: "locked",
        level: 3,
        position: { x: 50, y: 10 },
      },
      {
        id: "lesson-8",
        title: "레슨 2",
        type: "lesson",
        status: "locked",
        level: 3,
        position: { x: 40, y: 25 },
      },
    ],
  },
  {
    id: "unit-4",
    title: "유닛 4",
    description: "업무 프로젝트 논의하기",
    number: 4,
    nodes: [
      {
        id: "lesson-9",
        title: "레슨 1",
        type: "lesson",
        status: "locked",
        level: 4,
        position: { x: 50, y: 10 },
      },
      {
        id: "lesson-10",
        title: "레슨 2",
        type: "lesson",
        status: "locked",
        level: 4,
        position: { x: 45, y: 25 },
      },
    ],
  },
];

const mockUser: User = {
  name: "User",
  level: 4,
  xp: 8,
  streak: 35,
  gems: 3787,
  lingots: 1944,
  league: "자수정 리그",
  leagueRank: 1936,
};

export const useStore = create<AppState>((set) => ({
  user: mockUser,
  quests: mockQuests,
  units: mockUnits,
  updateXP: (amount: number) =>
    set((state) => ({
      user: { ...state.user, xp: state.user.xp + amount },
    })),
  updateQuestProgress: (questId: string, progress: number) =>
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId ? { ...quest, progress } : quest
      ),
    })),
  completeLesson: (lessonId: string) =>
    set((state) => ({
      units: state.units.map((unit) => ({
        ...unit,
        nodes: unit.nodes.map((node) =>
          node.id === lessonId
            ? { ...node, status: "completed" as const }
            : node
        ),
      })),
    })),
}));
