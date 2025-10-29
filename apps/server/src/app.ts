import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { logger } from './lib/logger';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { buildRoutes } from './routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  // Simple request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      logger.info({ method: req.method, url: req.originalUrl, status: res.statusCode, ms }, 'req');
    });
    next();
  });

  // Basic rate limiter
  const rateLimiter = new RateLimiterMemory({ points: 100, duration: 60 });
  app.use(async (req, res, next) => {
    try {
      await rateLimiter.consume(req.ip || 'unknown');
      next();
    } catch {
      res.status(429).json({ error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } });
    }
  });

  app.use('/api', buildRoutes());

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
