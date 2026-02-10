// Demo contest data generator for testing without API calls

import { ContestData, ContestSnapshot, ContestMoment, TeamStanding } from '@/types';

export function generateDemoContest(): ContestData {
  const problems = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const teams = [
    { id: 'team-1', name: 'Code Warriors', members: ['alice', 'bob'] },
    { id: 'team-2', name: 'Binary Beasts', members: ['charlie', 'diana'] },
    { id: 'team-3', name: 'Algorithm Aces', members: ['eve', 'frank'] },
    { id: 'team-4', name: 'Debug Dragons', members: ['grace', 'henry'] },
    { id: 'team-5', name: 'Runtime Rebels', members: ['iris', 'jack'] },
  ];

  const durationSeconds = 18000; // 5 hours

  // Generate realistic snapshots
  const snapshots: ContestSnapshot[] = [];

  for (let t = 0; t <= durationSeconds; t += 60) {
    const standings: TeamStanding[] = teams.map((team, index) => {
      const timeProgress = t / durationSeconds;
      const baseSolved = Math.floor(timeProgress * 7 * (1 - index * 0.1));
      const solved = Math.max(0, Math.min(7, baseSolved + Math.floor(Math.random() * 2)));

      const problems: Record<string, any> = {};
      for (let i = 0; i < 7; i++) {
        const problemIndex = String.fromCharCode(65 + i);
        const isSolved = i < solved;
        problems[problemIndex] = {
          problemIndex,
          solved: isSolved,
          attempts: isSolved ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5),
          solveTime: isSolved ? Math.floor((t / 60) * (i + 1) / 7) : undefined,
          penalty: isSolved ? Math.floor((t / 60) * (i + 1) / 7) + Math.floor(Math.random() * 3) * 20 : 0,
          submissions: [],
        };
      }

      return {
        teamId: team.id,
        teamName: team.name,
        rank: index + 1,
        solved,
        penalty: solved * 50 + Math.floor(Math.random() * 100),
        problems,
      };
    });

    // Sort by ICPC rules
    standings.sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved;
      return a.penalty - b.penalty;
    });

    standings.forEach((team, idx) => {
      team.rank = idx + 1;
    });

    snapshots.push({
      timestamp: t,
      standings,
      totalSubmissions: Math.floor((t / durationSeconds) * 150),
    });
  }

  // Generate demo moments
  const moments: ContestMoment[] = [
    {
      id: 'moment-1',
      timestamp: 900,
      type: 'first_solve',
      teamId: 'team-1',
      teamName: 'Code Warriors',
      description: 'First solve on Problem A!',
      metadata: { problemIndex: 'A' },
    },
    {
      id: 'moment-2',
      timestamp: 3600,
      type: 'rank_takeover',
      teamId: 'team-2',
      teamName: 'Binary Beasts',
      description: 'Binary Beasts takes the lead!',
      metadata: { oldRank: 2, newRank: 1, rankChange: 1 },
    },
    {
      id: 'moment-3',
      timestamp: 7200,
      type: 'big_jump',
      teamId: 'team-5',
      teamName: 'Runtime Rebels',
      description: 'Runtime Rebels jumps 3 ranks! (5 → 2)',
      metadata: { oldRank: 5, newRank: 2, rankChange: 3 },
    },
    {
      id: 'moment-4',
      timestamp: 16200,
      type: 'clutch_solve',
      teamId: 'team-1',
      teamName: 'Code Warriors',
      description: 'Code Warriors clutch solve in final minutes!',
      metadata: { rankChange: 2 },
    },
  ];

  const teamsObj: Record<string, any> = {};
  teams.forEach(team => {
    teamsObj[team.id] = { name: team.name, members: team.members };
  });

  return {
    contestId: 999999,
    contestName: 'Demo Contest (Sample Data)',
    durationSeconds,
    startTimeSeconds: Date.now() / 1000,
    problems: problems.map(p => ({ index: p, name: `Problem ${p}` })),
    submissions: [],
    snapshots,
    moments,
    teams: teamsObj,
  };
}
