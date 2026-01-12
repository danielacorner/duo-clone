import { create } from "zustand";
import type { User, Quest, Unit } from "../types";

interface AppState {
  user: User;
  quests: Quest[];
  units: Unit[];
  lastInteractedLessonId: string | null;
  updateXP: (amount: number) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeLesson: (lessonId: string) => void;
  unlockLesson: (lessonId: string) => void;
  setLastInteractedLessonId: (lessonId: string) => void;
}

const mockQuests: Quest[] = [
  {
    id: "1",
    title: "earnXP", // Translation key
    description: "Earn 30 XP",
    icon: "⚡",
    progress: 8,
    total: 30,
    reward: 0,
  },
  {
    id: "2",
    title: "earnComboXP", // Translation key
    description: "Get combo bonus XP 15 times",
    icon: "⚡",
    progress: 3,
    total: 15,
    reward: 0,
  },
  {
    id: "3",
    title: "scoreInLessons", // Translation key
    description: "Get 80% or higher in 3 lessons",
    icon: "🎯",
    progress: 1,
    total: 3,
    reward: 0,
  },
];

const baseMockUnits: Unit[] = [
  {
    id: "unit-1",
    title: "unit1", // Translation key
    description: "unit1", // Translation key
    number: 1,
    nodes: [
      {
        id: "lesson-1",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "completed",
        level: 1,
        position: { x: 45, y: 5 },
      },
      {
        id: "lesson-2",
        title: "lesson2", // Translation key
        type: "story",
        status: "completed",
        level: 1,
        position: { x: 60, y: 18 },
      },
      {
        id: "lesson-3",
        title: "lesson3", // Translation key
        type: "lesson",
        status: "completed",
        level: 1,
        position: { x: 39, y: 31 },
      },
      {
        id: "practice-1",
        title: "practice", // Translation key
        type: "practice",
        status: "completed",
        level: 1,
        position: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: "unit-2",
    title: "unit2", // Translation key
    description: "unit2", // Translation key
    number: 2,
    nodes: [
      {
        id: "lesson-4",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "available",
        level: 2,
        position: { x: 45, y: 10 },
      },
      {
        id: "lesson-5",
        title: "lesson2", // Translation key
        type: "lesson",
        status: "locked",
        level: 2,
        position: { x: 35, y: 25 },
      },
      {
        id: "lesson-6",
        title: "lesson3", // Translation key
        type: "lesson",
        status: "locked",
        level: 2,
        position: { x: 50, y: 40 },
      },
    ],
  },
  {
    id: "unit-3",
    title: "unit3", // Translation key
    description: "unit3", // Translation key
    number: 3,
    nodes: [
      {
        id: "lesson-7",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "locked",
        level: 3,
        position: { x: 50, y: 10 },
      },
      {
        id: "lesson-8",
        title: "lesson2", // Translation key
        type: "lesson",
        status: "locked",
        level: 3,
        position: { x: 40, y: 25 },
      },
    ],
  },
  {
    id: "unit-4",
    title: "unit4", // Translation key
    description: "unit4", // Translation key
    number: 4,
    nodes: [
      {
        id: "lesson-9",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "locked",
        level: 4,
        position: { x: 50, y: 10 },
      },
      {
        id: "lesson-10",
        title: "lesson2", // Translation key
        type: "lesson",
        status: "locked",
        level: 4,
        position: { x: 45, y: 25 },
      },
    ],
  },
  {
    id: "unit-5",
    title: "unit5", // Translation key
    description: "unit5", // Translation key
    number: 5,
    nodes: [
      {
        id: "lesson-11",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "locked",
        level: 5,
        position: { x: 40, y: 10 },
      },
      {
        id: "lesson-12",
        title: "lesson2", // Translation key
        type: "lesson",
        status: "locked",
        level: 5,
        position: { x: 55, y: 25 },
      },
    ],
  },
  {
    id: "unit-6",
    title: "unit6", // Translation key
    description: "unit6", // Translation key
    number: 6,
    nodes: [
      {
        id: "lesson-13",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "locked",
        level: 6,
        position: { x: 45, y: 10 },
      },
    ],
  },
  {
    id: "unit-7",
    title: "unit7", // Translation key
    description: "unit7", // Translation key
    number: 7,
    nodes: [
      {
        id: "lesson-14",
        title: "lesson1", // Translation key
        type: "lesson",
        status: "locked",
        level: 7,
        position: { x: 50, y: 10 },
      },
      {
        id: "lesson-15",
        title: "lesson2", // Translation key
        type: "lesson",
        status: "locked",
        level: 7,
        position: { x: 40, y: 25 },
      },
    ],
  },
];

// In dev mode, unlock all lessons
const mockUnits: Unit[] = import.meta.env.DEV
  ? baseMockUnits.map((unit) => ({
      ...unit,
      nodes: unit.nodes.map((node) => ({
        ...node,
        status: node.status === "locked" ? ("available" as const) : node.status,
      })),
    }))
  : baseMockUnits;

const mockUser: User = {
  name: "User",
  username: "react_learner", // Added username
  level: 4,
  xp: 8,
  streak: 35,
  gems: 3787,
  lingots: 1944,
  league: "Amethyst League",
  leagueRank: 1936,
  joinedAt: "January 2024", // Added joined date
  following: 12, // Added following count
  followers: 8, // Added followers count
  totalXp: 1250, // Added total lifetime XP
  courses: [
    { name: "React", xp: 1250 },
    { name: "TypeScript", xp: 300 },
  ], // Added courses progress
};

export const useStore = create<AppState>((set) => ({
  user: mockUser,
  quests: mockQuests,
  units: mockUnits,
  lastInteractedLessonId: null,
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
      lastInteractedLessonId: lessonId,
      units: state.units.map((unit) => ({
        ...unit,
        nodes: unit.nodes.map((node) =>
          node.id === lessonId
            ? { ...node, status: "completed" as const }
            : node
        ),
      })),
    })),
  unlockLesson: (lessonId: string) =>
    set((state) => ({
      units: state.units.map((unit) => ({
        ...unit,
        nodes: unit.nodes.map((node) =>
          node.id === lessonId
            ? { ...node, status: "available" as const }
            : node
        ),
      })),
    })),
  setLastInteractedLessonId: (lessonId: string) =>
    set({ lastInteractedLessonId: lessonId }),
}));
