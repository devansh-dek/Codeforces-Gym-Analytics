// Core type definitions for the Codeforces Gym Analytics Dashboard

export interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId: number;
    members: Array<{
      handle: string;
    }>;
    participantType: string;
    teamId?: number;
    teamName?: string;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface CodeforcesStanding {
  contestId: number;
  contest: {
    id: number;
    name: string;
    type: string;
    phase: string;
    frozen: boolean;
    durationSeconds: number;
    startTimeSeconds: number;
  };
  problems: Array<{
    contestId: number;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  }>;
  rows: Array<{
    party: {
      contestId: number;
      members: Array<{
        handle: string;
        name?: string;
      }>;
      participantType: string;
      teamId?: number;
      teamName?: string;
    };
    rank: number;
    points: number;
    penalty: number;
    successfulHackCount: number;
    unsuccessfulHackCount: number;
    problemResults: Array<{
      points: number;
      penalty?: number;
      rejectedAttemptCount: number;
      type: string;
      bestSubmissionTimeSeconds?: number;
    }>;
  }>;
}

export interface TeamProblemStatus {
  problemIndex: string;
  solved: boolean;
  attempts: number;
  solveTime?: number; // in minutes
  penalty: number;
  submissions: CodeforcesSubmission[];
  firstToSolve?: boolean;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  rank: number;
  previousRank?: number;
  solved: number;
  penalty: number;
  problems: Record<string, TeamProblemStatus>;
  lastSolveTime?: number;
}

export interface ContestSnapshot {
  timestamp: number; // relative time in seconds
  standings: TeamStanding[];
  totalSubmissions: number;
}

export interface ContestMoment {
  id: string;
  timestamp: number;
  type: 'rank_takeover' | 'big_jump' | 'first_solve' | 'freeze_chaos' | 'clutch_solve';
  teamId: string;
  teamName: string;
  description: string;
  metadata?: {
    rankChange?: number;
    problemIndex?: string;
    oldRank?: number;
    newRank?: number;
  };
}

export interface ContestData {
  contestId: number;
  contestName: string;
  durationSeconds: number;
  startTimeSeconds: number;
  problems: Array<{
    index: string;
    name: string;
  }>;
  submissions: CodeforcesSubmission[];
  snapshots: ContestSnapshot[];
  moments: ContestMoment[];
  teams: Record<string, {
    name: string;
    members: string[];
  }>;
}

export interface TimelineState {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  maxTime: number;
}

export interface ComparisonData {
  teamA: string;
  teamB: string;
  solveSpeedComparison: Array<{
    problemIndex: string;
    teamATime?: number;
    teamBTime?: number;
  }>;
  accuracyComparison: {
    teamA: { attempts: number; solves: number };
    teamB: { attempts: number; solves: number };
  };
}
