import { db } from '../database/connection.js';
import { exams, STATUS } from '../database/schema.js';
import { logger } from '../utils/logger.util.js';
import { CronJob } from 'cron';
import { and, eq, gte, sql } from 'drizzle-orm';

export default CronJob.from({
  name: 'EXAM CRON',
  cronTime: '* * * * *',
  onTick: async (onComplete) => {
    logger.info('exam.cron.ts has started.');
    await db
      .update(exams)
      .set({ status: STATUS.ENDED })
      .where(
        and(
          eq(exams.status, STATUS.STARTED),
          gte(exams.endedAt, sql`CURRENT_TIMESTAMP`)
        )
      );
    await onComplete();
  },
  waitForCompletion: true,
  onComplete: () => {
    logger.info('exam.cron.ts has completed.');
  },
  errorHandler: (error) => {
    logger.error('Error occured in exam.cron.ts. Aborting exam.cron.ts.');
    logger.error(error);
  },
});
