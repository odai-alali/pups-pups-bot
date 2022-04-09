import dotenv from 'dotenv';
import * as path from 'path';
import { CronJob } from 'cron';
import { Telegraf } from 'telegraf';
import logger from 'loglevel';
import BotWrapper from './bot/BotWrapper';
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

    const cron = new CronJob('*/5 * * * *', async () => {
      await wrapper.notifySubscribersForBookableSaturdays();
    });

    const exitHandler = () => {
      bot.stop();
      cron.stop();
      process.exit(0);
    };

    const unexpectedErrorHandler = (error: Error) => {
      logger.error(error);
      bot.stop();
      cron.stop();
      process.exit(1);
    };

    wrapper.launchBot().then(() => {
      // eslint-disable-next-line no-console
      logger.info('bot launched');

      wrapper.sendToAllOldChatIds(
        'Hi! I have fixed my Code 🥳' +
          'click /start and I will keep an eye on the calendars and notify you as soon as I find a free saturday!',
      );

      cron.start();
    });

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      exitHandler();
    });
    process.on('SIGINT', () => {
      logger.info('SIGINT received');
      exitHandler();
    });
  });
