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
import Loki from '@lokidb/loki';
import { FSStorage } from '@lokidb/fs-storage';

dotenv.config({ path: path.resolve(__dirname + '/../.env') });

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set.');
}
export const CHAT_IDS_FILE = path.resolve(__dirname + '/../_data/pups.db');

const fsDbAdapter = new FSStorage();
const lokiDb = new Loki(CHAT_IDS_FILE, {
  env: 'NODEJS',
});
lokiDb
  .initializePersistence({
    adapter: fsDbAdapter,
    autosave: true,
    autosaveInterval: 5000,
    autoload: true,
    throttledSaves: false,
  })
  .then(() => {
    const htmlParser = new HtmlParser();
    const messageFormatter = new MessageFormatter();
    const textNormalizer = new TextAnalyzer();
    const commandService = new CommandService(
      htmlParser,
      messageFormatter,
      textNormalizer,
    );
    const bot = new Telegraf(process.env.BOT_TOKEN as string);
    const simpleDb = new SimpleDb(lokiDb);
    const wrapper = new BotWrapper(bot, simpleDb, commandService);

    wrapper.launchBot().then(() => {
      // eslint-disable-next-line no-console
      console.log('bot launched');

      wrapper.sendToAll(
        'Hi, I have got a new database, send this command to subscribe to the new DB. /start',
      );

      const cron = new CronJob('0 */6 * * *', async () => {
        await wrapper.notifySubscribersForBookableSaturdays();
      });

      cron.start();
    });
  });
