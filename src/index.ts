import dotenv from 'dotenv';
import * as path from 'path';
import { CronJob } from 'cron';
import BotWrapper from './bot/BotWrapper';
import { Telegraf } from 'telegraf';
import SimpleDb from './persistance/SimpleDb';
import CommandService from './bot/CommandService';
import HtmlParser from './parser/HtmlParser';
import MessageFormatter from './bot/MessageFormatter';
import TextAnalyzer from './bot/TextAnalyzer';

dotenv.config({ path: path.resolve(__dirname + '/../.env') });

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set.');
}

const bot = new Telegraf(process.env.BOT_TOKEN);
const simpleDb = new SimpleDb();
const htmlParser = new HtmlParser();
const messageFormatter = new MessageFormatter();
const textNormalizer = new TextAnalyzer();
const commandService = new CommandService(
  htmlParser,
  messageFormatter,
  textNormalizer,
);
const wrapper = new BotWrapper(bot, simpleDb, commandService);

wrapper.launchBot().then(() => {
  // eslint-disable-next-line no-console
  console.log('bot launched');

  const cron = new CronJob('0 */6 * * *', async () => {
    await wrapper.notifySubscribersForBookableSaturdays();
  });

  cron.start();
});
