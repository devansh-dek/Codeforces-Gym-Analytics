// Export utilities for generating reports and overlays

import { ContestData, TeamStanding } from '@/types';

export class ExportUtils {
  // Export standings as CSV
  static exportStandingsCSV(standings: TeamStanding[], timestamp: number): string {
    const headers = ['Rank', 'Team', 'Solved', 'Penalty'];
    const rows = standings.map(team => [
      team.rank.toString(),
      team.teamName,
      team.solved.toString(),
      team.penalty.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  // Download CSV file
  static downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Export full contest report
  static exportContestReport(contestData: ContestData): string {
    const report = {
      contestName: contestData.contestName,
      contestId: contestData.contestId,
      duration: contestData.durationSeconds,
      problems: contestData.problems,
      teams: Object.keys(contestData.teams).length,
      totalSubmissions: contestData.submissions.length,
      keyMoments: contestData.moments.length,
      finalStandings: contestData.snapshots[contestData.snapshots.length - 1].standings.slice(0, 10),
    };

    return JSON.stringify(report, null, 2);
  }

  // Generate stream overlay HTML
  static generateStreamOverlay(
    rank: number,
    teamName: string,
    solved: number,
    penalty: number
  ): string {
    return `
      <div style="
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
        border: 2px solid #3B82F6;
        border-radius: 12px;
        padding: 20px;
        color: white;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      ">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="
            background: ${rank === 1 ? '#FCD34D' : rank === 2 ? '#E5E7EB' : rank === 3 ? '#FB923C' : '#3B82F6'};
            color: ${rank <= 3 ? '#111827' : 'white'};
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
          ">
            ${rank}
          </div>
          <div style="flex: 1;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
              ${teamName}
            </div>
            <div style="display: flex; gap: 20px; font-size: 18px;">
              <span style="color: #10B981;">✅ ${solved} solved</span>
              <span style="color: #9CA3AF;">⏱️ ${penalty} penalty</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Export moment as image data URL (for screenshots)
  static async captureElement(elementId: string): Promise<string> {
    // This would use html2canvas or similar library in production
    // For now, return placeholder
    return 'data:image/png;base64,placeholder';
  }
}
