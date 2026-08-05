interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Simple, high-performance in-memory Rate Limiter.
 * Window configured in hours (e.g. 1 for 1 hour, 0.5 for 30 minutes).
 */
export function checkRateLimit(ip: string): { success: boolean; resetSeconds: number } {
  const maxRequests = Number(process.env.CHAT_RATE_LIMIT_REQUESTS) || 10;
  const windowHours = Number(process.env.CHAT_RATE_LIMIT_WINDOW_HOURS) || 1;
  const windowMs = windowHours * 60 * 60 * 1000;

  const now = Date.now();
  const entry = store.get(ip);

  // Passive cleanup if storage grows large
  if (store.size > 500) {
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) store.delete(key);
    }
  }

  if (!entry || now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, resetSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    const resetSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
    return { success: false, resetSeconds };
  }

  entry.count += 1;
  return { success: true, resetSeconds: Math.ceil((entry.resetTime - now) / 1000) };
}
