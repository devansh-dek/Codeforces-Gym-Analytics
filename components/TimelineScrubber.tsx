'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';

interface TimelineScrubberProps {
  onTimeChange?: (time: number) => void;
}

export default function TimelineScrubber({ onTimeChange }: TimelineScrubberProps) {
  const { timeline, contestData, setCurrentTime, play, pause } = useAppStore();
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  // Auto-play animation
  useEffect(() => {
    if (!timeline.isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }

      const delta = timestamp - lastUpdateRef.current;
      
      // Update every 100ms
      if (delta > 100) {
        const newTime = Math.min(
          timeline.currentTime + (delta / 1000) * timeline.playbackSpeed,
          timeline.maxTime
        );

        setCurrentTime(newTime);
        onTimeChange?.(newTime);

        if (newTime >= timeline.maxTime) {
          pause();
        }

        lastUpdateRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeline.isPlaying, timeline.currentTime, timeline.maxTime, timeline.playbackSpeed, setCurrentTime, onTimeChange, pause]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    onTimeChange?.(time);
  };

  const jumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
    onTimeChange?.(seconds);
  };

  const presets = [
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
    { label: '1 hour', seconds: 3600 },
    { label: '2 hours', seconds: 7200 },
  ];

  if (!contestData) return null;

  const currentMinutes = Math.floor(timeline.currentTime / 60);
  const maxMinutes = Math.floor(timeline.maxTime / 60);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-xl">
      <div className="space-y-4">
        {/* Time display */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            {formatTime(timeline.currentTime)}
          </div>
          <div className="text-gray-400">
            / {formatTime(timeline.maxTime)}
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max={timeline.maxTime}
            value={timeline.currentTime}
            onChange={handleSliderChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          {/* Progress fill */}
          <div 
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg pointer-events-none"
            style={{ width: `${(timeline.currentTime / timeline.maxTime) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Play/Pause */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => timeline.isPlaying ? pause() : play()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {timeline.isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            {/* Speed control */}
            <select
              value={timeline.playbackSpeed}
              onChange={(e) => useAppStore.getState().setPlaybackSpeed(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
            </select>
          </div>

          {/* Preset jumps */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Jump to:</span>
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => jumpToTime(Math.min(preset.seconds, timeline.maxTime))}
                disabled={preset.seconds > timeline.maxTime}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded text-sm transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress markers */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0:00</span>
          <span>{Math.floor(maxMinutes / 4)}:{(15 * Math.floor(maxMinutes / 60)).toString().padStart(2, '0')}</span>
          <span>{Math.floor(maxMinutes / 2)}:00</span>
          <span>{Math.floor(maxMinutes * 3 / 4)}:{(45 * Math.floor(maxMinutes / 60)).toString().padStart(2, '0')}</span>
          <span>{formatTime(timeline.maxTime)}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          position: relative;
          z-index: 10;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          position: relative;
          z-index: 10;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          border: none;
        }
      `}</style>
    </div>
  );
}
