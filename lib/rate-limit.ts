// Local-development primitive only. Production must use a shared, durable limiter.
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };
const MAX_RATE_LIMIT_KEY_LENGTH = 256;

export class MemoryRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly limit: number, private readonly windowMs: number, private readonly now: () => number = () => Date.now()) {
    if (!Number.isInteger(limit) || limit < 1) throw new Error("Rate-limit count must be a positive integer.");
    if (!Number.isFinite(windowMs) || windowMs <= 0) throw new Error("Rate-limit window must be positive.");
  }

  check(key: string): RateLimitResult {
    if (typeof key !== "string" || key.length === 0 || key.length > MAX_RATE_LIMIT_KEY_LENGTH) throw new Error("Rate-limit key is invalid.");
    const current = this.now();
    const recent = (this.hits.get(key) ?? []).filter(timestamp => current - timestamp < this.windowMs);
    if (recent.length >= this.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((this.windowMs - (current - recent[0])) / 1000));
      this.hits.set(key, recent);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }
    recent.push(current);
    this.hits.set(key, recent);
    return { allowed: true, remaining: Math.max(0, this.limit - recent.length), retryAfterSeconds: 0 };
  }
}
