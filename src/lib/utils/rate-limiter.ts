// src/lib/rate-limiter.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

interface Bucket {
  tokens: number;
  lastRefill: number;
}

// Configuration constants
const WINDOW_SIZE_MS = 60 * 1000; // 60 seconds
const MAX_TOKENS = 10; // Maximum allowed requests per window
// Calculate the token refill rate (tokens per millisecond)
const REFILL_RATE = MAX_TOKENS / WINDOW_SIZE_MS;

// Create an LRU cache to store each IP's bucket.
// The cache automatically removes entries that haven't been used for the TTL.
const bucketCache = new LRUCache<string, Bucket>({
  max: 500,
  ttl: WINDOW_SIZE_MS,
});

/**
 * Checks the rate limit for a given IP or request.
 *
 * @param key A unique identifier for the requester (IP address).
 * @param limit Maximum allowed tokens per window.
 * @returns True if the request is allowed; otherwise, false.
 */
function checkRateLimitForKey(key: string, limit: number = MAX_TOKENS): boolean {
  const now = Date.now();
  // Retrieve the current bucket for this key, or initialize one.
  let bucket = bucketCache.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
  }

  // Refill the token bucket based on the time passed.
  const timePassed = now - bucket.lastRefill;

  bucket.tokens = Math.min(limit, bucket.tokens + timePassed * REFILL_RATE);
  bucket.lastRefill = now;

  // If there's at least one token available, consume it and allow the request.
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    bucketCache.set(key, bucket);

    return true;
  }

  // Otherwise, deny the request.
  bucketCache.set(key, bucket);

  return false;
}

/**
 * Rate limiter middleware for Next.js API routes.
 * It extracts the IP address from the request and checks the rate limit.
 *
 * @param req Next.js API request.
 * @param res Next.js API response.
 * @param limit Maximum allowed requests per window (default is 10).
 * @returns True if allowed, false if rate limit exceeded.
 */
export function rateLimiter(req: NextApiRequest, res: NextApiResponse, limit?: number): boolean {
  // Extract IP address from headers or socket.
  const token = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = Array.isArray(token) ? token[0] : token || '';

  return checkRateLimitForKey(key, limit);
}

/**
 * An alternative function to check rate limit by explicitly passing an IP.
 *
 * @param ip The IP address as a string.
 * @param limit Maximum allowed requests per window.
 * @returns True if allowed, false if rate limit exceeded.
 */
export function rateLimiterByIP(ip: string, limit?: number): boolean {
  return checkRateLimitForKey(ip, limit);
}
