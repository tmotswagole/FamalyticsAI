import type { NextApiRequest, NextApiResponse } from 'next';
import { Arcjet } from '@/utils/arcjet/router';
import handleUserRequest from './user/route';
import handleRoleRequest from './role/route';
import handleOrganizationRequest from './organization/route';
import handleSubscriptionRequest from './subscription/route';
import handleSessionRequest from './session/route';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const rateLimit = await Arcjet.enforceRateLimitingWithTime(req, 1000);
    if (!rateLimit.success) {
      return res.status(429).json({ error: rateLimit.reason });
    }

    const { path } = req.query;
    
    switch (path?.[0]) {
      case 'user':
        return handleUserRequest(req, res);
      case 'role':
        return handleRoleRequest(req, res);
      case 'organization':
        return handleOrganizationRequest(req, res);
      case 'subscription':
        return handleSubscriptionRequest(req, res);
      case 'session':
        return handleSessionRequest(req, res);
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Authentication API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
