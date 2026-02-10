'use client';

import { ContestData } from '@/types';
import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StatisticsPanel() {
  const { contestData, timeline } = useAppStore();

  if (!contestData) return null;

  // Calculate statistics at current time
  const submissionsAtTime = contestData.submissions.filter(
    s => s.relativeTimeSeconds <= timeline.currentTime
  );

  // Verdict distribution
  const verdictCounts: Record<string, number> = {};
  submissionsAtTime.forEach(sub => {
    verdictCounts[sub.verdict] = (verdictCounts[sub.verdict] || 0) + 1;
  });

  const verdictData = Object.entries(verdictCounts).map(([verdict, count]) => ({
    verdict: verdict === 'OK' ? 'AC' : verdict.substring(0, 3),
    count,
  }));

  // Problem difficulty (by first solve time)
  const problemDifficulty = contestData.problems.map(problem => {
    const firstSolve = contestData.submissions.find(
      s => s.problem.index === problem.index && s.verdict === 'OK'
    );
    return {
      problem: problem.index,
      time: firstSolve ? Math.floor(firstSolve.relativeTimeSeconds / 60) : contestData.durationSeconds / 60,
    };
  }).sort((a, b) => a.time - b.time);

  // Submission timeline (submissions per 10 minutes)
  const timelineBuckets: Record<number, number> = {};
  submissionsAtTime.forEach(sub => {
    const bucket = Math.floor(sub.relativeTimeSeconds / 600) * 10; // 10-minute buckets
    timelineBuckets[bucket] = (timelineBuckets[bucket] || 0) + 1;
  });

  const submissionTimeline = Object.entries(timelineBuckets)
    .map(([time, count]) => ({ time: parseInt(time), count }))
    .sort((a, b) => a.time - b.time);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Verdict Distribution */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Verdict Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={verdictData}
              dataKey="count"
              nameKey="verdict"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {verdictData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Problem Difficulty */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Problem Difficulty (First Solve)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={problemDifficulty}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="problem" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Bar dataKey="time" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Submission Activity */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 lg:col-span-2">
        <h3 className="text-white font-semibold mb-4">Submission Activity Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={submissionTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" label={{ value: 'Minutes', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
