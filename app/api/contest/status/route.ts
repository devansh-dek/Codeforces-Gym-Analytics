// API Route: Proxy for Codeforces contest.status endpoint
// This bypasses CORS restrictions by making server-side requests

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contestId = searchParams.get('contestId');
  const from = searchParams.get('from') || '1';
  const count = searchParams.get('count') || '100000';

  if (!contestId) {
    return NextResponse.json(
      { error: 'Contest ID is required' },
      { status: 400 }
    );
  }

  try {
    const url = `https://codeforces.com/api/contest.status?contestId=${contestId}&from=${from}&count=${count}`;
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'CFGymAnalytics/1.0',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Codeforces API Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: error.response?.status || 500 }
    );
  }
}
