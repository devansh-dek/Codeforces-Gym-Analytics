'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { TeamStanding } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { contestData, selectedTeams, setSelectedTeams } = useAppStore();
  const [teamA, setTeamA] = useState<string>('');
  const [teamB, setTeamB] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    if (selectedTeams.length >= 2) {
      setTeamA(selectedTeams[0]);
      setTeamB(selectedTeams[1]);
    }
  }, [selectedTeams]);

  useEffect(() => {
    if (!contestData || !teamA || !teamB) return;

    // Build comparison data
    const finalSnapshot = contestData.snapshots[contestData.snapshots.length - 1];
    const teamAData = finalSnapshot.standings.find(t => t.teamId === teamA);
    const teamBData = finalSnapshot.standings.find(t => t.teamId === teamB);

    if (!teamAData || !teamBData) return;

    // Solve speed comparison
    const solveSpeed = contestData.problems.map(problem => {
      const teamASolve = teamAData.problems[problem.index];
      const teamBSolve = teamBData.problems[problem.index];
      return {
        problem: problem.index,
        teamA: teamASolve?.solved ? teamASolve.solveTime : null,
        teamB: teamBSolve?.solved ? teamBSolve.solveTime : null,
      };
    });

    // Accuracy comparison
    const teamATotal = Object.values(teamAData.problems).reduce((sum, p) => sum + p.attempts + (p.solved ? 1 : 0), 0);
    const teamBTotal = Object.values(teamBData.problems).reduce((sum, p) => sum + p.attempts + (p.solved ? 1 : 0), 0);

    const accuracy = {
      teamA: {
        attempts: teamATotal,
        solves: teamAData.solved,
        accuracy: teamATotal > 0 ? (teamAData.solved / teamATotal) * 100 : 0,
      },
      teamB: {
        attempts: teamBTotal,
        solves: teamBData.solved,
        accuracy: teamBTotal > 0 ? (teamBData.solved / teamBTotal) * 100 : 0,
      },
    };

    // Rank progression
    const rankProgression = contestData.snapshots
      .filter((_, i) => i % 5 === 0) // Sample every 5 snapshots
      .map(snapshot => {
        const a = snapshot.standings.find(t => t.teamId === teamA);
        const b = snapshot.standings.find(t => t.teamId === teamB);
        return {
          time: snapshot.timestamp / 60,
          teamA: a?.rank || 0,
          teamB: b?.rank || 0,
        };
      });

    // Radar chart data
    const radarData = [
      {
        metric: 'Problems Solved',
        teamA: teamAData.solved,
        teamB: teamBData.solved,
      },
      {
        metric: 'Speed (inverted)',
        teamA: teamAData.penalty > 0 ? Math.max(0, 500 - teamAData.penalty) / 10 : 0,
        teamB: teamBData.penalty > 0 ? Math.max(0, 500 - teamBData.penalty) / 10 : 0,
      },
      {
        metric: 'Accuracy',
        teamA: accuracy.teamA.accuracy / 2,
        teamB: accuracy.teamB.accuracy / 2,
      },
      {
        metric: 'Final Rank (inverted)',
        teamA: Math.max(0, 50 - teamAData.rank),
        teamB: Math.max(0, 50 - teamBData.rank),
      },
    ];

    setComparisonData({
      teamAData,
      teamBData,
      solveSpeed,
      accuracy,
      rankProgression,
      radarData,
    });
  }, [contestData, teamA, teamB]);

  if (!isOpen || !contestData) return null;

  const teams = Object.entries(contestData.teams);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Team Comparison</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Team Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Team A</label>
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select team...</option>
                {teams.map(([id, info]) => (
                  <option key={id} value={id}>{info.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Team B</label>
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select team...</option>
                {teams.map(([id, info]) => (
                  <option key={id} value={id}>{info.name}</option>
                ))}
              </select>
            </div>
          </div>

          {!comparisonData && (
            <div className="text-center text-gray-400 py-12">
              Select two teams to compare
            </div>
          )}

          {comparisonData && (
            <>
              {/* Stats Comparison */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-blue-400 font-bold text-2xl">{comparisonData.teamAData.rank}</div>
                  <div className="text-gray-400 text-sm">Rank</div>
                  <div className="text-purple-400 font-bold text-2xl mt-2">{comparisonData.teamBData.rank}</div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-blue-400 font-bold text-2xl">{comparisonData.teamAData.solved}</div>
                  <div className="text-gray-400 text-sm">Solved</div>
                  <div className="text-purple-400 font-bold text-2xl mt-2">{comparisonData.teamBData.solved}</div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-blue-400 font-bold text-2xl">{comparisonData.teamAData.penalty}</div>
                  <div className="text-gray-400 text-sm">Penalty</div>
                  <div className="text-purple-400 font-bold text-2xl mt-2">{comparisonData.teamBData.penalty}</div>
                </div>
              </div>

              {/* Charts */}
              <div className="space-y-6">
                {/* Rank Progression */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Rank Over Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={comparisonData.rankProgression}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis reversed stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                      <Legend />
                      <Line type="monotone" dataKey="teamA" stroke="#3B82F6" name={contestData.teams[teamA]?.name} strokeWidth={2} />
                      <Line type="monotone" dataKey="teamB" stroke="#A855F7" name={contestData.teams[teamB]?.name} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance Radar */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Performance Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={comparisonData.radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                      <PolarRadiusAxis stroke="#9CA3AF" />
                      <Radar name={contestData.teams[teamA]?.name} dataKey="teamA" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                      <Radar name={contestData.teams[teamB]?.name} dataKey="teamB" stroke="#A855F7" fill="#A855F7" fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Problem-by-Problem */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Problem Solve Times (minutes)</h3>
                  <div className="space-y-2">
                    {comparisonData.solveSpeed.map((item: any) => (
                      <div key={item.problem} className="flex items-center gap-4">
                        <div className="w-12 text-white font-bold">{item.problem}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div
                            className="bg-blue-600 h-8 flex items-center justify-end pr-2 text-white text-sm font-semibold rounded"
                            style={{ width: item.teamA ? `${(item.teamA / 300) * 100}%` : '0%' }}
                          >
                            {item.teamA || '-'}
                          </div>
                          <div className="w-16 text-center text-gray-400 text-sm">vs</div>
                          <div
                            className="bg-purple-600 h-8 flex items-center pl-2 text-white text-sm font-semibold rounded"
                            style={{ width: item.teamB ? `${(item.teamB / 300) * 100}%` : '0%' }}
                          >
                            {item.teamB || '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accuracy */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Accuracy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-blue-400 font-bold text-lg mb-2">{contestData.teams[teamA]?.name}</div>
                      <div className="text-gray-300">
                        {comparisonData.accuracy.teamA.solves} / {comparisonData.accuracy.teamA.attempts} attempts
                      </div>
                      <div className="text-white text-2xl font-bold mt-2">
                        {comparisonData.accuracy.teamA.accuracy.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold text-lg mb-2">{contestData.teams[teamB]?.name}</div>
                      <div className="text-gray-300">
                        {comparisonData.accuracy.teamB.solves} / {comparisonData.accuracy.teamB.attempts} attempts
                      </div>
                      <div className="text-white text-2xl font-bold mt-2">
                        {comparisonData.accuracy.teamB.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
