// Contest Timeline Reconstruction Engine
// This is the core logic that rebuilds contest state at any point in time

import {
  CodeforcesSubmission,
  CodeforcesStanding,
  TeamStanding,
  TeamProblemStatus,
  ContestSnapshot,
  ContestMoment,
  ContestData,
} from '@/types';

export class TimelineEngine {
  private submissions: CodeforcesSubmission[];
  private problems: string[];
  private contestDuration: number;
  private teams: Map<string, { name: string; members: string[] }>;

  constructor(
    submissions: CodeforcesSubmission[],
    standings: CodeforcesStanding
  ) {
    // Sort submissions by relative time
    this.submissions = [...submissions].sort(
      (a, b) => a.relativeTimeSeconds - b.relativeTimeSeconds
    );

    this.problems = standings.problems.map(p => p.index);
    this.contestDuration = standings.contest.durationSeconds;
    this.teams = new Map();

    // Extract team information
    standings.rows.forEach(row => {
      const teamId = this.getTeamId(row.party);
      const teamName = row.party.teamName || row.party.members.map(m => m.handle).join(', ');
      this.teams.set(teamId, {
        name: teamName,
        members: row.party.members.map(m => m.handle),
      });
    });
  }

  private getTeamId(party: any): string {
    return party.teamId?.toString() || party.members.map((m: any) => m.handle).join('-');
  }

  // Compute standings at a specific timestamp
  computeStandingsAtTime(timestamp: number): TeamStanding[] {
    const teamData = new Map<string, {
      teamName: string;
      solved: number;
      penalty: number;
      problems: Record<string, TeamProblemStatus>;
    }>();

    // Initialize teams
    this.teams.forEach((teamInfo, teamId) => {
      const problems: Record<string, TeamProblemStatus> = {};
      this.problems.forEach(index => {
        problems[index] = {
          problemIndex: index,
          solved: false,
          attempts: 0,
          penalty: 0,
          submissions: [],
        };
      });

      teamData.set(teamId, {
        teamName: teamInfo.name,
        solved: 0,
        penalty: 0,
        problems,
      });
    });

    // Process submissions up to timestamp
    const relevantSubmissions = this.submissions.filter(
      sub => sub.relativeTimeSeconds <= timestamp
    );

    relevantSubmissions.forEach(submission => {
      const teamId = this.getTeamId(submission.author);
      const team = teamData.get(teamId);

      if (!team) return;

      const problemIndex = submission.problem.index;
      const problemStatus = team.problems[problemIndex];

      if (!problemStatus || problemStatus.solved) return;

      problemStatus.submissions.push(submission);

      if (submission.verdict === 'OK') {
        // First AC
        problemStatus.solved = true;
        problemStatus.solveTime = Math.floor(submission.relativeTimeSeconds / 60);
        // ICPC penalty: solve time + 20 minutes per wrong attempt
        problemStatus.penalty = problemStatus.solveTime + (problemStatus.attempts * 20);

        team.solved++;
        team.penalty += problemStatus.penalty;
      } else if (
        submission.verdict !== 'TESTING' &&
        submission.verdict !== 'COMPILATION_ERROR'
      ) {
        // Count as wrong attempt (WA, TLE, MLE, etc.)
        problemStatus.attempts++;
      }
    });

    // Convert to TeamStanding array and rank
    const standings: TeamStanding[] = [];
    teamData.forEach((data, teamId) => {
      standings.push({
        teamId,
        teamName: data.teamName,
        rank: 0, // Will be computed
        solved: data.solved,
        penalty: data.penalty,
        problems: data.problems,
      });
    });

    // ICPC ranking: sort by solved (desc), then penalty (asc)
    standings.sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved;
      return a.penalty - b.penalty;
    });

    // Assign ranks
    standings.forEach((team, index) => {
      if (
        index > 0 &&
        team.solved === standings[index - 1].solved &&
        team.penalty === standings[index - 1].penalty
      ) {
        team.rank = standings[index - 1].rank;
      } else {
        team.rank = index + 1;
      }
    });

    return standings;
  }

  // Generate snapshots at regular intervals
  generateSnapshots(intervalMinutes: number = 1): ContestSnapshot[] {
    const snapshots: ContestSnapshot[] = [];
    const intervalSeconds = intervalMinutes * 60;

    for (let t = 0; t <= this.contestDuration; t += intervalSeconds) {
      const standings = this.computeStandingsAtTime(t);
      const submissionsUntilNow = this.submissions.filter(
        sub => sub.relativeTimeSeconds <= t
      ).length;

      snapshots.push({
        timestamp: t,
        standings,
        totalSubmissions: submissionsUntilNow,
      });
    }

    return snapshots;
  }

  // Detect interesting moments
  detectMoments(): ContestMoment[] {
    const moments: ContestMoment[] = [];
    const snapshotInterval = 60; // Check every minute
    let previousStandings: TeamStanding[] | null = null;

    for (let t = snapshotInterval; t <= this.contestDuration; t += snapshotInterval) {
      const currentStandings = this.computeStandingsAtTime(t);

      if (previousStandings) {
        // Create rank map for comparison
        const prevRankMap = new Map(
          previousStandings.map(team => [team.teamId, team.rank])
        );

        currentStandings.forEach(team => {
          const prevRank = prevRankMap.get(team.teamId);

          if (prevRank === undefined) return;

          const rankChange = prevRank - team.rank;

          // Rank 1 takeover
          if (team.rank === 1 && prevRank !== 1) {
            moments.push({
              id: `takeover-${t}-${team.teamId}`,
              timestamp: t,
              type: 'rank_takeover',
              teamId: team.teamId,
              teamName: team.teamName,
              description: `${team.teamName} takes the lead!`,
              metadata: {
                oldRank: prevRank,
                newRank: 1,
                rankChange,
              },
            });
          }

          // Big jump (3+ ranks)
          if (rankChange >= 3) {
            moments.push({
              id: `jump-${t}-${team.teamId}`,
              timestamp: t,
              type: 'big_jump',
              teamId: team.teamId,
              teamName: team.teamName,
              description: `${team.teamName} jumps ${rankChange} ranks! (${prevRank} → ${team.rank})`,
              metadata: {
                oldRank: prevRank,
                newRank: team.rank,
                rankChange,
              },
            });
          }

          // Clutch solve (last 30 minutes)
          if (t >= this.contestDuration - 1800) {
            const prevSolved = previousStandings.find(p => p.teamId === team.teamId)?.solved || 0;
            if (team.solved > prevSolved) {
              moments.push({
                id: `clutch-${t}-${team.teamId}`,
                timestamp: t,
                type: 'clutch_solve',
                teamId: team.teamId,
                teamName: team.teamName,
                description: `${team.teamName} clutch solve in final minutes!`,
                metadata: {
                  rankChange,
                },
              });
            }
          }
        });
      }

      // First solve detection
      const submissionsAtTime = this.submissions.filter(
        sub => sub.relativeTimeSeconds > (t - snapshotInterval) &&
               sub.relativeTimeSeconds <= t &&
               sub.verdict === 'OK'
      );

      const problemFirstSolves = new Set<string>();
      submissionsAtTime.forEach(sub => {
        const problemIndex = sub.problem.index;
        if (!problemFirstSolves.has(problemIndex)) {
          // Check if this is the first AC for this problem
          const earlierSolves = this.submissions.filter(
            s => s.problem.index === problemIndex &&
                 s.verdict === 'OK' &&
                 s.relativeTimeSeconds < sub.relativeTimeSeconds
          );

          if (earlierSolves.length === 0) {
            const teamId = this.getTeamId(sub.author);
            const teamInfo = this.teams.get(teamId);
            moments.push({
              id: `first-${t}-${problemIndex}`,
              timestamp: sub.relativeTimeSeconds,
              type: 'first_solve',
              teamId,
              teamName: teamInfo?.name || teamId,
              description: `First solve on Problem ${problemIndex}!`,
              metadata: {
                problemIndex,
              },
            });
            problemFirstSolves.add(problemIndex);
          }
        }
      });

      previousStandings = currentStandings;
    }

    return moments.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Build complete contest data
  buildContestData(contestName: string, startTime: number): ContestData {
    const snapshots = this.generateSnapshots(1); // 1-minute intervals
    const moments = this.detectMoments();

    const teamsObj: Record<string, { name: string; members: string[] }> = {};
    this.teams.forEach((teamInfo, teamId) => {
      teamsObj[teamId] = teamInfo;
    });

    return {
      contestId: this.submissions[0]?.contestId || 0,
      contestName,
      durationSeconds: this.contestDuration,
      startTimeSeconds: startTime,
      problems: this.problems.map(index => ({
        index,
        name: `Problem ${index}`,
      })),
      submissions: this.submissions,
      snapshots,
      moments,
      teams: teamsObj,
    };
  }
}
