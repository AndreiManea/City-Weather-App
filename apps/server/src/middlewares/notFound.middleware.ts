import type { Request, Response } from 'express';

export function notFoundMiddleware(_req: Request, res: Response) {
  return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}
