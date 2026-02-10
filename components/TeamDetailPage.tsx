'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { TeamStanding } from '@/types';
import { formatTime } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TeamDetailPageProps {
  teamId: string;
}

export default function TeamDetailPage({ teamId }: TeamDetailPageProps) {
  const { contestData } = useAppStore();
  const router = useRouter();
  const [rankHistory, setRankHistory] = useState<Array<{ time: number; rank: number }>>([]);
  const [solveTimeline, setSolveTimeline] = useState<Array<{ problem: string; time: number; attempts: number }>>([]);

  useEffect(() => {
    if (!contestData) return;

    // Build rank history over time
    const history: Array<{ time: number; rank: number }> = [];
    contestData.snapshots.forEach(snapshot => {
      const team = snapshot.standings.find(t => t.teamId === teamId);
      if (team) {
        history.push({ time: snapshot.timestamp / 60, rank: team.rank });
      }
    });
    setRankHistory(history);

    // Build solve timeline
    const timeline: Array<{ problem: string; time: number; attempts: number }> = [];
    const finalSnapshot = contestData.snapshots[contestData.snapshots.length - 1];
    const teamData = finalSnapshot?.standings.find(t => t.teamId === teamId);
    
    if (teamData) {
      Object.values(teamData.problems).forEach(prob => {
        if (prob.solved && prob.solveTime !== undefined) {
          timeline.push({
            problem: prob.problemIndex,
            time: prob.solveTime,
            attempts: prob.attempts,
          });
        }
      });
      timeline.sort((a, b) => a.time - b.time);
    }
    setSolveTimeline(timeline);
  }, [contestData, teamId]);

  if (!contestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">No contest data loaded</div>
      </div>
    );
  }

  const teamInfo = contestData.teams[teamId];
  if (!teamInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Team not found</div>
      </div>
    );
  }

  const finalSnapshot = contestData.snapshots[contestData.snapshots.length - 1];
  const teamStats = finalSnapshot?.standings.find(t => t.teamId === teamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg mb-4"
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="text-4xl font-bold text-white mb-2">{teamInfo.name}</h1>
        <p className="text-gray-400">
          Members: {teamInfo.members.join(', ')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Final Rank</div>
          <div className="text-3xl font-bold text-yellow-400">#{teamStats?.rank || '-'}</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Problems Solved</div>
          <div className="text-3xl font-bold text-green-400">{teamStats?.solved || 0}</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Penalty</div>
          <div className="text-3xl font-bold text-white">{teamStats?.penalty || 0}</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Attempts</div>
          <div className="text-3xl font-bold text-white">
            {teamStats ? Object.values(teamStats.problems).reduce((sum, p) => sum + p.attempts + (p.solved ? 1 : 0), 0) : 0}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Rank vs Time */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Rank Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rankHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              <YAxis 
                reversed 
                stroke="#9CA3AF"
                label={{ value: 'Rank', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line type="monotone" dataKey="rank" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Solve Timeline */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Solve Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={solveTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="problem" 
                stroke="#9CA3AF"
                label={{ value: 'Problem', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="time" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Problem-by-Problem Breakdown */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Problem Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contestData.problems.map(problem => {
            const status = teamStats?.problems[problem.index];
            return (
              <div
                key={problem.index}
                className={`border rounded-lg p-4 ${
                  status?.solved
                    ? 'border-green-500 bg-green-900/20'
                    : status?.attempts
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-white">{problem.index}</span>
                  {status?.solved && <span className="text-2xl">✅</span>}
                  {!status?.solved && status?.attempts ? <span className="text-2xl">❌</span> : null}
                </div>
                <div className="text-gray-400 text-sm">
                  {status?.solved ? (
                    <>
                      <div>Solved at: {status.solveTime} min</div>
                      <div>Attempts: {status.attempts + 1}</div>
                      <div>Penalty: {status.penalty} min</div>
                    </>
                  ) : status?.attempts ? (
                    <div>Failed attempts: {status.attempts}</div>
                  ) : (
                    <div>Not attempted</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clutch Moments */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4">🔥 Key Moments</h2>
        <div className="space-y-3">
          {contestData.moments
            .filter(m => m.teamId === teamId)
            .map(moment => (
              <div key={moment.id} className="border-l-4 border-blue-500 bg-blue-900/20 p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{moment.description}</span>
                  <span className="text-gray-400 text-sm">{formatTime(moment.timestamp)}</span>
                </div>
              </div>
            ))}
          {contestData.moments.filter(m => m.teamId === teamId).length === 0 && (
            <div className="text-gray-400 text-center py-4">No key moments detected</div>
          )}
        </div>
      </div>
    </div>
  );
}
