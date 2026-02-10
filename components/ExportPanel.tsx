'use client';

import { useAppStore } from '@/lib/store';
import { ExportUtils } from '@/lib/export-utils';
import { useState } from 'react';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const { contestData, currentStandings, timeline } = useAppStore();
  const [exportStatus, setExportStatus] = useState<string>('');

  if (!isOpen || !contestData) return null;

  const handleExportCSV = () => {
    const csv = ExportUtils.exportStandingsCSV(currentStandings, timeline.currentTime);
    const timestamp = Math.floor(timeline.currentTime / 60);
    ExportUtils.downloadCSV(csv, `standings-${timestamp}min.csv`);
    setExportStatus('✅ CSV exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const handleExportReport = () => {
    const report = ExportUtils.exportContestReport(contestData);
    const blob = new Blob([report], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contest-${contestData.contestId}-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setExportStatus('✅ Report exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const handleCopyOverlay = () => {
    if (currentStandings.length === 0) return;
    const top3 = currentStandings.slice(0, 3);
    const overlays = top3.map(team => 
      ExportUtils.generateStreamOverlay(team.rank, team.teamName, team.solved, team.penalty)
    ).join('\n\n');
    
    navigator.clipboard.writeText(overlays);
    setExportStatus('✅ Stream overlays copied to clipboard!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📤 Export & Tools</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            {/* CSV Export */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Export Current Standings (CSV)</h3>
              <p className="text-gray-400 text-sm mb-3">
                Download standings at current timestamp as CSV file
              </p>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Download CSV
              </button>
            </div>

            {/* Full Report */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Export Contest Report (JSON)</h3>
              <p className="text-gray-400 text-sm mb-3">
                Complete contest data including moments, statistics, and final standings
              </p>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Download Report
              </button>
            </div>

            {/* Stream Overlays */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Copy Stream Overlays (HTML)</h3>
              <p className="text-gray-400 text-sm mb-3">
                Get HTML code for top 3 teams to use in OBS Browser Source
              </p>
              <button
                onClick={handleCopyOverlay}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Copy HTML
              </button>
            </div>

            {/* Contest Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Contest Information</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <div>ID: {contestData.contestId}</div>
                <div>Problems: {contestData.problems.length}</div>
                <div>Teams: {Object.keys(contestData.teams).length}</div>
                <div>Total Submissions: {contestData.submissions.length}</div>
                <div>Key Moments: {contestData.moments.length}</div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {exportStatus && (
            <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-400 text-center">
              {exportStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
