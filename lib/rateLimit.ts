// lib/rateLimit.ts
/**
 * Simple in-memory rate limiter for API endpoints
 * Prevents abuse by limiting requests per IP
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (entry.resetAt < now) {
            rateLimitMap.delete(ip);
        }
    }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number; // Max requests per window
    windowMs: number; // Time window in milliseconds
}

export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    // No entry or expired window - create new
    if (!entry || entry.resetAt < now) {
        const resetAt = now + config.windowMs;
        rateLimitMap.set(identifier, { count: 1, resetAt });
        return { allowed: true, remaining: config.maxRequests - 1, resetAt };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    // Increment count
    entry.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

export function getClientIdentifier(request: Request): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier
    return 'unknown';
}
