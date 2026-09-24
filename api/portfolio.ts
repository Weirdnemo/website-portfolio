import { Redis } from '@upstash/redis';
import { portfolioData as defaultData } from '../src/data/portfolioData.js';


const redis = Redis.fromEnv();
const KEY = 'portfolio:data';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = await redis.get(KEY);

    if (!data) {
      await redis.set(KEY, defaultData);
      data = defaultData;
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (err) {
    console.error('GET /api/portfolio failed:', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(defaultData);
  }
}
