'use client';

import { TeamStanding } from '@/types';
import { getProblemStatusIcon, getProblemStatusColor, cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StandingsTableProps {
  standings: TeamStanding[];
  highlightTeams?: string[];
}

export default function StandingsTable({ standings, highlightTeams = [] }: StandingsTableProps) {
  const { contestData, livestreamMode } = useAppStore();
  const router = useRouter();
  const [previousStandings, setPreviousStandings] = useState<TeamStanding[]>([]);

  useEffect(() => {
    // Store previous standings for rank change detection
    if (standings.length > 0) {
      const timer = setTimeout(() => {
        setPreviousStandings(standings);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [standings]);

  if (!contestData) return null;

  const getRankChange = (teamId: string, currentRank: number): number | null => {
    const prevTeam = previousStandings.find(t => t.teamId === teamId);
    if (!prevTeam) return null;
    return prevTeam.rank - currentRank;
  };

  const handleTeamClick = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  return (
    <div className={cn(
      "bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl",
      livestreamMode && "text-xl"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className={cn(
                "px-4 py-3 text-left font-semibold text-gray-300",
                livestreamMode ? "text-xl" : "text-sm"
              )}>
                Rank
              </th>
              <th className={cn(
                "px-4 py-3 text-left font-semibold text-gray-300",
                livestreamMode ? "text-xl" : "text-sm"
              )}>
                Team
              </th>
              <th className={cn(
                "px-4 py-3 text-center font-semibold text-gray-300",
                livestreamMode ? "text-xl" : "text-sm"
              )}>
                Solved
              </th>
              <th className={cn(
                "px-4 py-3 text-center font-semibold text-gray-300",
                livestreamMode ? "text-xl" : "text-sm"
              )}>
                Penalty
              </th>
              {contestData.problems.map(problem => (
                <th
                  key={problem.index}
                  className={cn(
                    "px-3 py-3 text-center font-semibold text-gray-300",
                    livestreamMode ? "text-xl" : "text-sm"
                  )}
                >
                  {problem.index}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => {
              const rankChange = getRankChange(team.teamId, team.rank);
              const isHighlighted = highlightTeams.includes(team.teamId);

              return (
                <tr
                  key={team.teamId}
                  onClick={() => handleTeamClick(team.teamId)}
                  className={cn(
                    "border-b border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer",
                    isHighlighted && "bg-blue-900/30 hover:bg-blue-900/40",
                    team.rank === 1 && "bg-yellow-900/20 hover:bg-yellow-900/30"
                  )}
                >
                  {/* Rank */}
                  <td className={cn(
                    "px-4 py-3 font-bold",
                    livestreamMode ? "text-2xl" : "text-base"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        team.rank === 1 && "text-yellow-400",
                        team.rank === 2 && "text-gray-300",
                        team.rank === 3 && "text-orange-400",
                        team.rank > 3 && "text-white"
                      )}>
                        {team.rank}
                      </span>
                      {rankChange !== null && rankChange !== 0 && (
                        <span className={cn(
                          "text-xs font-normal animate-bounce",
                          rankChange > 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {rankChange > 0 ? `↑${rankChange}` : `↓${Math.abs(rankChange)}`}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Team name */}
                  <td className={cn(
                    "px-4 py-3 text-white font-medium",
                    livestreamMode ? "text-xl" : "text-base"
                  )}>
                    {team.teamName}
                  </td>

                  {/* Solved */}
                  <td className={cn(
                    "px-4 py-3 text-center text-green-400 font-bold",
                    livestreamMode ? "text-2xl" : "text-lg"
                  )}>
                    {team.solved}
                  </td>

                  {/* Penalty */}
                  <td className={cn(
                    "px-4 py-3 text-center text-gray-300",
                    livestreamMode ? "text-xl" : "text-base"
                  )}>
                    {team.penalty}
                  </td>

                  {/* Problems */}
                  {contestData.problems.map(problem => {
                    const status = team.problems[problem.index];
                    if (!status) {
                      return (
                        <td key={problem.index} className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-gray-600">—</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={problem.index} className="px-3 py-3">
                        <div className="flex items-center justify-center">
                          <div className={cn(
                            "px-2 py-1 rounded text-center font-mono transition-all",
                            livestreamMode ? "text-base min-w-[60px]" : "text-xs min-w-[50px]",
                            getProblemStatusColor(status.solved, status.attempts),
                            status.firstToSolve && "ring-2 ring-yellow-400 animate-pulse"
                          )}>
                            {status.solved ? (
                              <div className="flex flex-col items-center">
                                <span>{status.solveTime}</span>
                                {status.attempts > 0 && (
                                  <span className="text-[10px]">+{status.attempts}</span>
                                )}
                              </div>
                            ) : status.attempts > 0 ? (
                              <span>−{status.attempts}</span>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {standings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No submissions yet at this timestamp
        </div>
      )}
    </div>
  );
}
