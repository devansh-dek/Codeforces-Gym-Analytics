// Codeforces API Client
// Uses Next.js API routes as proxy to bypass CORS restrictions

import axios from 'axios';
import { CodeforcesSubmission, CodeforcesStanding } from '@/types';

// Use relative URLs for API routes (Next.js proxy)
const API_BASE = '/api/contest';

export class CodeforcesAPI {
  private static async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, {
          timeout: 30000,
        });

        // Check for Codeforces API errors
        if (response.data.status === 'FAILED') {
          throw new Error(response.data.comment || 'API request failed');
        }

        if (response.data.status !== 'OK') {
          throw new Error(response.data.comment || 'API request failed');
        }

        return response.data.result;
      } catch (error: any) {
        // Don't retry if it's a Codeforces error (contest not found, etc.)
        if (error.response?.data?.status === 'FAILED') {
          throw new Error(error.response.data.comment || 'Contest not found or unavailable');
        }
        
        // Retry for network errors
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Failed after retries');
  }

  static async getContestSubmissions(contestId: number): Promise<CodeforcesSubmission[]> {
    const url = `${API_BASE}/status?contestId=${contestId}&from=1&count=100000`;
    return this.fetchWithRetry<CodeforcesSubmission[]>(url);
  }

  static async getContestStandings(
    contestId: number,
    from: number = 1,
    count: number = 10000
  ): Promise<CodeforcesStanding> {
    const url = `${API_BASE}/standings?contestId=${contestId}&from=${from}&count=${count}&showUnofficial=false`;
    return this.fetchWithRetry<CodeforcesStanding>(url);
  }

  static async getGymStandings(gymId: number): Promise<CodeforcesStanding> {
    // For gym contests, use the same endpoint
    return this.getContestStandings(gymId);
  }

  static async getGymSubmissions(gymId: number): Promise<CodeforcesSubmission[]> {
    return this.getContestSubmissions(gymId);
  }

  // Helper to check if a contest is a gym
  static isGymContest(contestId: number): boolean {
    return contestId >= 100000;
  }

  // For gym mashups, we might need to handle multiple contests
  static async getMultipleContestData(contestIds: number[]): Promise<{
    submissions: CodeforcesSubmission[];
    standings: CodeforcesStanding[];
  }> {
    const submissions: CodeforcesSubmission[] = [];
    const standings: CodeforcesStanding[] = [];

    for (const contestId of contestIds) {
      try {
        const [subs, stand] = await Promise.all([
          this.getContestSubmissions(contestId),
          this.getContestStandings(contestId),
        ]);
        submissions.push(...subs);
        standings.push(stand);
      } catch (error) {
        console.error(`Failed to fetch data for contest ${contestId}:`, error);
      }
    }

    return { submissions, standings };
  }
}
