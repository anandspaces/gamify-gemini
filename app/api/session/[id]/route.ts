// app/api/session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionStore';

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
                { status: 400 }
            );
        }

        console.log(`📖 Fetching session: ${sessionId}`);

        const questions = getSession(sessionId);

        if (!questions) {
            return NextResponse.json(
                { error: 'Session not found or expired', success: false },
                { status: 404 }
            );
        }

        console.log(`✅ Returned ${questions.length} questions for session ${sessionId}`);

        return NextResponse.json({
            success: true,
            questions,
        });

    } catch (error) {
        console.error('❌ Error fetching session:', error);

        return NextResponse.json(
            { error: 'Failed to fetch session', success: false },
            { status: 500 }
        );
    }
}
