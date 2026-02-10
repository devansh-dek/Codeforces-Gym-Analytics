// Codeforces API Client

import axios from 'axios';
import crypto from 'crypto';
import { CodeforcesSubmission, CodeforcesStanding } from '@/types';

const CF_API_BASE = 'https://codeforces.com/api';
const API_KEY = process.env.NEXT_PUBLIC_CF_API_KEY || '';
const API_SECRET = process.env.NEXT_PUBLIC_CF_API_SECRET || '';

export class CodeforcesAPI {
  private static async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'CFGymAnalytics/1.0',
          },
        });

        if (response.data.status !== 'OK') {
          throw new Error(response.data.comment || 'API request failed');
        }

        return response.data.result;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Failed after retries');
  }

  static async getContestSubmissions(contestId: number): Promise<CodeforcesSubmission[]> {
    const url = `${CF_API_BASE}/contest.status?contestId=${contestId}&from=1&count=100000`;
    return this.fetchWithRetry<CodeforcesSubmission[]>(url);
  }

  static async getContestStandings(
    contestId: number,
    from: number = 1,
    count: number = 10000
  ): Promise<CodeforcesStanding> {
    const url = `${CF_API_BASE}/contest.standings?contestId=${contestId}&from=${from}&count=${count}&showUnofficial=false`;
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
