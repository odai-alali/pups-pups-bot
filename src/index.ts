import dotenv from 'dotenv';
import { Notifier } from './Notifier';
import * as path from 'path';
import { CronJob } from 'cron';
import BotWrapper from './bot/BotWrapper';
import { Telegraf } from 'telegraf';
import SimpleDb from './persistance/SimpleDb';

dotenv.config({ path: path.resolve(__dirname + '/../.env') });

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set.');
}

const bot = new Telegraf(process.env.BOT_TOKEN);
const simpleDb = new SimpleDb();
const wrapper = new BotWrapper(bot, simpleDb);

wrapper.launchBot().then(() => {
  // eslint-disable-next-line no-console
  console.log('bot launched');
  const notifier = new Notifier(bot, simpleDb);

  const cron = new CronJob('0 */6 * * *', async () => {
    notifier.notifyBookableDays();
  });

  cron.start();
});
