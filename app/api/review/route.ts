// API route for code review

import { NextRequest, NextResponse } from 'next/server';
import { reviewCode } from '@/lib/mistral-agent';
import { CodeReviewRequest, CodeReviewResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CodeReviewRequest = await request.json();
    const { code, language } = body;

    // Validate input
    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!language || !['javascript', 'typescript', 'python', 'go', 'rust'].includes(language)) {
      return NextResponse.json(
        { error: 'Valid language is required (javascript, typescript, python, go, or rust)' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: 'Mistral API key is not configured. Please add MISTRAL_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Perform code review
    const result = await reviewCode(code, language);

    const response: CodeReviewResponse = {
      review: result.review,
      metrics: result.metrics,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in review API:', error);
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred during code review';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

