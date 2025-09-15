import app from './app.js';
import examCron from './crons/exam.cron.js';
import { env } from './env.js';
import { logger } from './utils/logger.util.js';

function startCrons() {
  examCron.start();
}

startCrons();

app.listen(env.PORT, () => {
  logger.info(`Listening on port ${env.PORT}`);
});
