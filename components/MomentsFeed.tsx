'use client';

import { ContestMoment } from '@/types';
import { formatTime } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface MomentsFeedProps {
  moments: ContestMoment[];
  onJumpToMoment: (timestamp: number) => void;
}

export default function MomentsFeed({ moments, onJumpToMoment }: MomentsFeedProps) {
  const { timeline } = useAppStore();

  const getMomentIcon = (type: ContestMoment['type']) => {
    switch (type) {
      case 'rank_takeover':
        return '👑';
      case 'big_jump':
        return '🚀';
      case 'first_solve':
        return '🎯';
      case 'clutch_solve':
        return '⚡';
      case 'freeze_chaos':
        return '❄️';
      default:
        return '📌';
    }
  };

  const getMomentColor = (type: ContestMoment['type']) => {
    switch (type) {
      case 'rank_takeover':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'big_jump':
        return 'border-blue-500 bg-blue-900/20';
      case 'first_solve':
        return 'border-green-500 bg-green-900/20';
      case 'clutch_solve':
        return 'border-purple-500 bg-purple-900/20';
      case 'freeze_chaos':
        return 'border-cyan-500 bg-cyan-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const visibleMoments = moments.filter(m => m.timestamp <= timeline.currentTime);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">🔥 Key Moments</h2>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {visibleMoments.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No moments detected yet...
          </div>
        ) : (
          visibleMoments.map((moment) => (
            <div
              key={moment.id}
              onClick={() => onJumpToMoment(moment.timestamp)}
              className={`border-l-4 p-3 rounded cursor-pointer hover:scale-105 transition-transform ${getMomentColor(moment.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getMomentIcon(moment.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 font-mono">
                      {formatTime(moment.timestamp)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {moment.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">
                    {moment.description}
                  </p>
                  {moment.metadata && (
                    <div className="mt-1 text-xs text-gray-400">
                      {moment.metadata.rankChange !== undefined && (
                        <span>Rank change: {moment.metadata.rankChange > 0 ? '+' : ''}{moment.metadata.rankChange}</span>
                      )}
                      {moment.metadata.problemIndex && (
                        <span> • Problem {moment.metadata.problemIndex}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
