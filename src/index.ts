import dotenv from 'dotenv';
import HtmlParser from './HtmlParser';
import { Notifier } from './Notifier';
import * as path from 'path';
import { CronJob } from 'cron';
import BotWrapper from './bot/BotWrapper';
import { Telegraf } from 'telegraf';

dotenv.config({ path: path.resolve(__dirname + '/../.env') });

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set.');
}

const htmlParser = new HtmlParser();

const wrapper = BotWrapper.getInstance();
const bot = new Telegraf(process.env.BOT_TOKEN);
wrapper.launchBot(bot, htmlParser).then(() => {
  // eslint-disable-next-line no-console
  console.log('bot launched');
  const notifier = new Notifier(bot);

  // DELETE
  notifier.sendToAll(
    `<b>I'm upgraded!</b> ${'\n'}The search for bookable days will be run on the calendars of Findorf and Schwackhausen.`,
  );

  const cron = new CronJob('0 */6 * * *', async () => {
    notifier.notifyBookableDays();
  });

  cron.start();
});
