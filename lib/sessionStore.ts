// lib/sessionStore.ts
import { Session, GeneratedQuestion } from '../types/types';

// Configuration
const SESSION_TTL = 60 * 60 * 1000; // 1 hour
const MAX_SESSIONS = 1000;
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Singleton pattern for Next.js - ensure single instance across hot reloads
const globalForSessions = globalThis as unknown as {
    sessionStore: Map<string, Session> | undefined;
    cleanupInterval: NodeJS.Timeout | undefined;
};

// Use existing store or create new one
const sessions = globalForSessions.sessionStore ?? new Map<string, Session>();
globalForSessions.sessionStore = sessions;

// Setup cleanup only once
if (!globalForSessions.cleanupInterval) {
    const cleanupInterval = setInterval(() => {
        const now = Date.now();
        let cleaned = 0;

        for (const [id, session] of sessions.entries()) {
            if (session.expiresAt < now) {
                sessions.delete(id);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired sessions. Active: ${sessions.size}`);
        }
    }, CLEANUP_INTERVAL);

    globalForSessions.cleanupInterval = cleanupInterval;

    // Prevent memory leaks on server shutdown
    if (typeof process !== 'undefined') {
        process.on('SIGTERM', () => {
            clearInterval(cleanupInterval);
        });
    }
}

export function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

export function createSession(questions: GeneratedQuestion[]): string {
    // Check if we've hit the max sessions limit
    if (sessions.size >= MAX_SESSIONS) {
        const sortedSessions = Array.from(sessions.entries())
            .sort((a, b) => a[1].createdAt - b[1].createdAt);

        const toRemove = Math.floor(MAX_SESSIONS * 0.1);
        for (let i = 0; i < toRemove; i++) {
            sessions.delete(sortedSessions[i][0]);
        }

        console.log(`⚠️ Session limit reached. Removed ${toRemove} oldest sessions.`);
    }

    const id = generateSessionId();
    const now = Date.now();

    const session: Session = {
        id,
        questions,
        createdAt: now,
        expiresAt: now + SESSION_TTL,
        accessCount: 0,
    };

    sessions.set(id, session);

    console.log(`✅ Session created: ${id} (Total active: ${sessions.size})`);
    console.log(`📦 Stored ${questions.length} questions`);
    console.log(`🔑 All session IDs:`, Array.from(sessions.keys()));

    return id;
}

export function getSession(id: string): GeneratedQuestion[] | null {
    console.log(`🔍 Looking for session: ${id}`);
    console.log(`📊 Total sessions in store: ${sessions.size}`);
    console.log(`🔑 Available session IDs:`, Array.from(sessions.keys()));

    const session = sessions.get(id);

    if (!session) {
        console.log(`❌ Session not found: ${id}`);
        return null;
    }

    // Check if expired
    if (session.expiresAt < Date.now()) {
        sessions.delete(id);
        console.log(`⏰ Session expired: ${id}`);
        return null;
    }

    // Increment access count
    session.accessCount++;

    console.log(`✅ Session accessed: ${id} (Count: ${session.accessCount})`);

    return session.questions;
}

export function deleteSession(id: string): void {
    sessions.delete(id);
    console.log(`🗑️ Session deleted: ${id}`);
}

export function getSessionCount(): number {
    return sessions.size;
}

export function getSessionStats() {
    const now = Date.now();
    const active = Array.from(sessions.values()).filter(s => s.expiresAt > now);

    return {
        total: sessions.size,
        active: active.length,
        expired: sessions.size - active.length,
    };
}
