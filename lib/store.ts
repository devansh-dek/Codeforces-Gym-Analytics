// Global state management with Zustand

import { create } from 'zustand';
import { ContestData, TimelineState, TeamStanding } from '@/types';

interface AppState {
  // Contest data
  contestData: ContestData | null;
  setContestData: (data: ContestData) => void;
  
  // Timeline state
  timeline: TimelineState;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // Current standings
  currentStandings: TeamStanding[];
  setCurrentStandings: (standings: TeamStanding[]) => void;
  
  // UI state
  livestreamMode: boolean;
  toggleLivestreamMode: () => void;
  
  selectedTeams: string[];
  setSelectedTeams: (teamIds: string[]) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Contest data
  contestData: null,
  setContestData: (data) => set({ 
    contestData: data,
    timeline: {
      currentTime: 0,
      isPlaying: false,
      playbackSpeed: 1,
      maxTime: data.durationSeconds,
    },
  }),
  
  // Timeline state
  timeline: {
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1,
    maxTime: 0,
  },
  setCurrentTime: (time) => set((state) => ({
    timeline: { ...state.timeline, currentTime: time },
  })),
  play: () => set((state) => ({
    timeline: { ...state.timeline, isPlaying: true },
  })),
  pause: () => set((state) => ({
    timeline: { ...state.timeline, isPlaying: false },
  })),
  setPlaybackSpeed: (speed) => set((state) => ({
    timeline: { ...state.timeline, playbackSpeed: speed },
  })),
  
  // Current standings
  currentStandings: [],
  setCurrentStandings: (standings) => set({ currentStandings: standings }),
  
  // UI state
  livestreamMode: false,
  toggleLivestreamMode: () => set((state) => ({ 
    livestreamMode: !state.livestreamMode 
  })),
  
  selectedTeams: [],
  setSelectedTeams: (teamIds) => set({ selectedTeams: teamIds }),
  
  // Loading state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  error: null,
  setError: (error) => set({ error }),
}));
