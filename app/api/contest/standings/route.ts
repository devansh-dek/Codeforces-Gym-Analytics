// API Route: Proxy for Codeforces contest.standings endpoint
// This bypasses CORS restrictions by making server-side requests

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

function generateApiSig(
  methodName: string,
  params: Record<string, string>,
  apiSecret: string
): string {
  const rand = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const toHash = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;
  const hash = crypto.createHash('sha512').update(toHash).digest('hex');
  
  return `${rand}${hash}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contestId = searchParams.get('contestId');
  const from = searchParams.get('from') || '1';
  const count = searchParams.get('count') || '10000';
  const showUnofficial = searchParams.get('showUnofficial') || 'false';

  if (!contestId) {
    return NextResponse.json(
      { error: 'Contest ID is required' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_CF_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CF_API_SECRET;
    
    let url: string;
    
    if (apiKey && apiSecret) {
      // Authenticated request for private mashups
      const params: Record<string, string> = {
        contestId,
        from,
        count,
        showUnofficial,
        apiKey,
        time: Math.floor(Date.now() / 1000).toString(),
      };
      
      const apiSig = generateApiSig('contest.standings', params, apiSecret);
      
      const queryString = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
      
      url = `https://codeforces.com/api/contest.standings?${queryString}&apiSig=${apiSig}`;
    } else {
      // Unauthenticated request for public contests
      url = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=${from}&count=${count}&showUnofficial=${showUnofficial}`;
    }
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'CFGymAnalytics/1.0',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Codeforces API Error:', error.message);
    
    // Check if it's a Codeforces API error response
    if (error.response?.data?.status === 'FAILED') {
      return NextResponse.json(
        { 
          status: 'FAILED',
          comment: error.response.data.comment || 'Codeforces API error'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        status: 'FAILED',
        comment: error.message || 'Failed to fetch standings' 
      },
      { status: error.response?.status || 500 }
    );
  }
}
