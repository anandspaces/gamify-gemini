// app/api/session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionStore';

// Define CORS headers (same as generate-game)
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params in Next.js 15+
        const { id: sessionId } = await params;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required', success: false },
                { status: 400, headers: corsHeaders } // Add CORS
            );
        }

        console.log(`📖 Fetching session: ${sessionId}`);

        const questions = getSession(sessionId);

        if (!questions) {
            return NextResponse.json(
                { error: 'Session not found or expired', success: false },
                { status: 404, headers: corsHeaders } // Add CORS
            );
        }

        console.log(`✅ Returned ${questions.length} questions for session ${sessionId}`);

        return NextResponse.json(
            {
                success: true,
                questions,
            },
            { headers: corsHeaders } // Add CORS
        );

    } catch (error) {
        console.error('❌ Error fetching session:', error);

        return NextResponse.json(
            { error: 'Failed to fetch session', success: false },
            { status: 500, headers: corsHeaders } // Add CORS
        );
    }
}

// Add OPTIONS handler for preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}