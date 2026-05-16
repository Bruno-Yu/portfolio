import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database } from '@cloudflare/workers-types';
import type { TokenPayload } from '../services/auth.js';

type Bindings = {
  DB: D1Database;
  CF_ANALYTICS_API_TOKEN?: string;
  CF_ZONE_ID?: string;
};

const router = new Hono<{
  Bindings: Bindings;
  Variables: { user?: TokenPayload };
}>();

router.use('/*', authMiddleware);

router.get('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const cfToken = c.env.CF_ANALYTICS_API_TOKEN;
  const zoneId = c.env.CF_ZONE_ID;

  if (!cfToken || !zoneId) {
    return c.json(
      { success: false, error: { code: 'ANALYTICS_NOT_CONFIGURED', message: 'Analytics credentials not set' } },
      503,
    );
  }

  const daysParam = c.req.query('days');
  const days = Math.min(90, Math.max(1, parseInt(daysParam ?? '30') || 30));

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequests1dGroups(
            limit: ${days}
            filter: { date_geq: "${sinceStr}" }
            orderBy: [date_ASC]
          ) {
            date: dimensions { date }
            sum { requests }
            uniq { uniques }
          }
        }
      }
    }
  `;

  try {
    const resp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfToken}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!resp.ok) {
      return c.json(
        { success: false, error: { code: 'ANALYTICS_UNAVAILABLE', message: 'Analytics API error' } },
        502,
      );
    }

    const json: {
      data?: {
        viewer?: {
          zones?: Array<{
            httpRequests1dGroups?: Array<{
              date: { date: string };
              sum: { requests: number };
              uniq: { uniques: number };
            }>;
          }>;
        };
      };
    } = await resp.json();

    const groups = json?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
    const daily = groups.map((g) => ({
      date: g.date.date,
      requests: g.sum.requests,
      uniques: g.uniq.uniques,
    }));

    const totalRequests = daily.reduce((acc, d) => acc + d.requests, 0);
    const uniqueVisitors = daily.reduce((acc, d) => acc + d.uniques, 0);

    return c.json({
      success: true,
      data: { totalRequests, uniqueVisitors, daily },
    });
  } catch (err) {
    console.error('Analytics fetch error:', err);
    return c.json(
      { success: false, error: { code: 'ANALYTICS_UNAVAILABLE', message: 'Failed to fetch analytics' } },
      502,
    );
  }
});

export const analyticsRoutes = router;
