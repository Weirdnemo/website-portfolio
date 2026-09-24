import { Redis } from '@upstash/redis';
import { portfolioData as defaultData } from '../src/data/portfolioData';

// Redis.fromEnv() reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN,
// which the Vercel <-> Upstash Marketplace integration injects automatically.
const redis = Redis.fromEnv();
const KEY = 'portfolio:data';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = await redis.get(KEY);

    // First ever request: seed Redis with the bundled default so future
    // reads/writes have something to build on.
    if (!data) {
      await redis.set(KEY, defaultData);
      data = defaultData;
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (err) {
    console.error('GET /api/portfolio failed:', err);
    // Never break the live site because Redis hiccuped — fall back to the
    // bundled data.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(defaultData);
  }
}
