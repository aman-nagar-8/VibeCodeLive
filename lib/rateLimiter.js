import { redis } from "./redis";

const CAPACITY = 5; // 5 login attempts
const REFILL_RATE = 1; // 1 token per minute
const REFILL_INTERVAL = 60; // seconds

export async function rateLimit(ip) {
  const key = `login:${ip}`;

  const now = Math.floor(Date.now() / 1000);

  const bucket = await redis.hgetall(key);

  let tokens = CAPACITY;
  let lastRefill = now;

  if (bucket.tokens && bucket.lastRefill) {
    tokens = parseFloat(bucket.tokens);
    lastRefill = parseInt(bucket.lastRefill, 10);

    const elapsed = now - lastRefill;

    const refillTokens =
      Math.floor(elapsed / REFILL_INTERVAL) * REFILL_RATE;

    tokens = Math.min(
      CAPACITY,
      tokens + refillTokens
    );

    if (refillTokens > 0) {
      lastRefill = now;
    }
  }

  if (tokens < 1) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter:
        REFILL_INTERVAL - (now - lastRefill),
    };
  }

  tokens -= 1;

  await redis.hset(key, {
    tokens,
    lastRefill,
  });

  await redis.expire(
    key,
    CAPACITY * REFILL_INTERVAL
  );

  return {
    allowed: true,
    remaining: tokens,
  };
}