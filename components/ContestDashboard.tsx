'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CodeforcesAPI } from '@/lib/codeforces-api';
import { TimelineEngine } from '@/lib/timeline-engine';
import TimelineScrubber from '@/components/TimelineScrubber';
import StandingsTable from '@/components/StandingsTable';
import MomentsFeed from '@/components/MomentsFeed';
import { useRouter } from 'next/navigation';

export default function ContestDashboard() {
  const {
    contestData,
    setContestData,
    currentStandings,
    setCurrentStandings,
    timeline,
    setCurrentTime,
    isLoading,
    setIsLoading,
    error,
    setError,
    livestreamMode,
    toggleLivestreamMode,
  } = useAppStore();

  const [contestInput, setContestInput] = useState('');
  const [timelineEngine, setTimelineEngine] = useState<TimelineEngine | null>(null);
  const router = useRouter();

  const loadContest = async (contestId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from Codeforces API
      const [submissions, standings] = await Promise.all([
        CodeforcesAPI.getContestSubmissions(contestId),
        CodeforcesAPI.getContestStandings(contestId),
      ]);

      // Build timeline engine
      const engine = new TimelineEngine(submissions, standings);
      setTimelineEngine(engine);

      // Generate contest data
      const data = engine.buildContestData(
        standings.contest.name,
        standings.contest.startTimeSeconds
      );

      setContestData(data);
      
      // Set initial standings
      const initialStandings = engine.computeStandingsAtTime(0);
      setCurrentStandings(initialStandings);

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load contest:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contest');
      setIsLoading(false);
    }
  };

  const handleTimeChange = (time: number) => {
    if (!timelineEngine) return;
    
    const standings = timelineEngine.computeStandingsAtTime(time);
    setCurrentStandings(standings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contestId = parseInt(contestInput);
    if (!isNaN(contestId)) {
      loadContest(contestId);
    }
  };

  const handleJumpToMoment = (timestamp: number) => {
    setCurrentTime(timestamp);
    handleTimeChange(timestamp);
  };

  // Load demo contest on mount (optional)
  useEffect(() => {
    // Uncomment to auto-load a demo contest
    // loadContest(102391); // Example gym contest
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading contest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!contestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              🏆 Codeforces Gym Analytics
            </h1>
            <p className="text-gray-400 text-lg">
              Contest Replay & Livestream Dashboard
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Enter Contest/Gym ID
                </label>
                <input
                  type="text"
                  value={contestInput}
                  onChange={(e) => setContestInput(e.target.value)}
                  placeholder="e.g., 102391 or 505970"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold text-lg transition-colors"
              >
                Load Contest
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📝 How to use:</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Enter a Codeforces Gym contest ID</li>
                <li>• Supports ICPC-style team contests</li>
                <li>• Works with gym mashups too!</li>
                <li>• Example IDs: 102391, 505970, 104901</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${livestreamMode ? 'p-2' : 'p-6'}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`font-bold text-white ${livestreamMode ? 'text-4xl' : 'text-3xl'}`}>
            {contestData.contestName}
          </h1>
          <p className="text-gray-400 mt-1">
            Contest ID: {contestData.contestId} • {contestData.problems.length} Problems
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLivestreamMode}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              livestreamMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {livestreamMode ? '🎥 Livestream Mode ON' : '🎥 Livestream Mode'}
          </button>
          
          <button
            onClick={() => {
              setContestData(null);
              setContestInput('');
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Change Contest
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="mb-6">
        <TimelineScrubber onTimeChange={handleTimeChange} />
      </div>

      {/* Main Content */}
      <div className={`grid gap-6 ${livestreamMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Standings - Takes up more space */}
        <div className={livestreamMode ? 'col-span-1' : 'lg:col-span-3'}>
          <StandingsTable standings={currentStandings} />
        </div>

        {/* Moments Feed - Sidebar */}
        {!livestreamMode && (
          <div className="lg:col-span-1">
            <MomentsFeed
              moments={contestData.moments}
              onJumpToMoment={handleJumpToMoment}
            />
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Submissions</div>
          <div className="text-2xl font-bold text-white">
            {contestData.submissions.filter(s => s.relativeTimeSeconds <= timeline.currentTime).length}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Teams</div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(contestData.teams).length}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Key Moments</div>
          <div className="text-2xl font-bold text-white">
            {contestData.moments.filter(m => m.timestamp <= timeline.currentTime).length}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Progress</div>
          <div className="text-2xl font-bold text-white">
            {Math.round((timeline.currentTime / timeline.maxTime) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
