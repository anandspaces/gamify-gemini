// app/api/generate-game/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/gemini';
import { QuestionRequest } from '@/types/types';
import { createSession } from '@/lib/sessionStore';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

// Define CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Or specify your Flutter app's origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
};

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Rate limiting - 5 requests per minute per IP
        const clientId = getClientIdentifier(request);
        const rateLimit = checkRateLimit(clientId, { maxRequests: 10, windowMs: 60 * 1000 });

        if (!rateLimit.allowed) {
            console.log(`🚫 Rate limit exceeded for ${clientId}`);
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    success: false,
                    retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
                },
                {
                    status: 429,
                    headers: {
                        ...corsHeaders, // Add CORS headers
                        'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
                        'X-RateLimit-Remaining': String(rateLimit.remaining),
                    }
                }
            );
        }

        const body: QuestionRequest = await request.json();

        // Validate request
        if (!body.subject || !body.topic || !body.class || !body.chapter) {
            return NextResponse.json(
                { error: 'Missing required fields: subject, topic, class, chapter', success: false },
                { status: 400, headers: corsHeaders } // Add CORS headers
            );
        }

        // Sanitize inputs
        const sanitizedBody = {
            subject: String(body.subject).trim().substring(0, 100),
            topic: String(body.topic).trim().substring(0, 100),
            class: String(body.class).trim().substring(0, 20),
            chapter: String(body.chapter).trim().substring(0, 100),
        };

        console.log(`\n🎯 New game request from ${clientId}: `, sanitizedBody);

        // Generate questions using Gemini API
        const questions = await generateQuestions(sanitizedBody);

        // Log generated questions for debugging
        console.log('📚 Total Questions:', questions.length);
        console.log('📝 Sample Questions:');
        questions.slice(0, 3).forEach((q, idx) => {
            console.log(`  ${idx + 1}. ${q.question} `);
        });

        // Create session and store questions
        const sessionId = createSession(questions);

        // Get base URL from request
        const baseUrl = request.nextUrl.origin;
        const gameUrl = `${baseUrl}/?id=${sessionId}`;

        const duration = Date.now() - startTime;
        console.log(`✅ Game generated in ${duration}ms for ${clientId}\n`);

        return NextResponse.json(
            {
                success: true,
                sessionId,
                gameUrl,
                questionCount: questions.length,
            },
            { headers: corsHeaders } // Add CORS headers
        );

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Error in generate-game API (${duration}ms):`, error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate game',
                success: false
            },
            { status: 500, headers: corsHeaders } // Add CORS headers
        );
    }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}