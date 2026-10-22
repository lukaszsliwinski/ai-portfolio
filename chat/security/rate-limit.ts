// Fixed-window rate limit per IP address.
import { limits } from "@/chat/config";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Kept in memory: counters reset on restart and aren't shared between
// instances, which is fine for a single container.
const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): {
  success: boolean;
  resetSeconds: number;
} {
  const windowMs = limits.rateLimitWindowHours * 60 * 60 * 1000;

  const now = Date.now();
  const entry = store.get(ip);

  // Expired entries are swept only when the map grows, to keep lookups cheap.
  if (store.size > 500) {
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) store.delete(key);
    }
  }

  if (!entry || now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, resetSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= limits.rateLimitRequests) {
    const resetSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
    return { success: false, resetSeconds };
  }

  entry.count += 1;
  return {
    success: true,
    resetSeconds: Math.ceil((entry.resetTime - now) / 1000),
  };
}
