import { Redis } from '@upstash/redis';
import { portfolioData as defaultData } from '../src/data/portfolioData.js';

const redis = Redis.fromEnv();
const KEY = 'portfolio:data';
const EDITABLE_FIELDS = ['resumeUrl', 'projects', 'blogs', 'research'] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updates = req.body || {};
  const invalidKeys = Object.keys(updates).filter(
    (key) => !EDITABLE_FIELDS.includes(key as (typeof EDITABLE_FIELDS)[number])
  );

  if (invalidKeys.length > 0) {
    return res.status(400).json({ error: `Cannot edit field(s): ${invalidKeys.join(', ')}` });
  }

  try {
    const current = (await redis.get(KEY)) || defaultData;
    const next = { ...(current as object), ...updates };
    await redis.set(KEY, next);
    return res.status(200).json(next);
  } catch (err) {
    console.error('POST /api/portfolio-update failed:', err);
    return res.status(500).json({ error: 'Failed to save changes' });
  }
}
