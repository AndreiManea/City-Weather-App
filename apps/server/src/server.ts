import { app } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';

const port = env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
