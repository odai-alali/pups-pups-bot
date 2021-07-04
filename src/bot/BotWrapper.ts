import { Telegraf } from 'telegraf';
import BookableDaysFilterCommand from './commands/BookableDaysFilterCommand';
import SimpleDb from '../persistance/SimpleDb';

class BotWrapper {
  private bot!: Telegraf;
  private simpleDb: SimpleDb;

  constructor(bot: Telegraf, simpleDb: SimpleDb) {
    this.bot = bot;
    this.simpleDb = simpleDb;
  }

  async launchBot(): Promise<void> {
    await this.registerBotCommands();
    await this.bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private async registerBotCommands() {
    this.bot.start((ctx) => {
      ctx.message;
      ctx.reply(`Hi ${ctx.message.from.first_name}!`);
      this.simpleDb.addChatId(ctx.message.chat.id);
    });

    this.bot.command(
      '/monday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isMonday)
        .command,
    );

    this.bot.command(
      '/tuesday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isTuesday)
        .command,
    );

    this.bot.command(
      '/wednesday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isWednesday)
        .command,
    );

    this.bot.command(
      '/thursday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isThursday)
        .command,
    );

    this.bot.command(
      '/friday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isFriday)
        .command,
    );

    this.bot.command(
      '/saturday',
      new BookableDaysFilterCommand((bookableDay) => bookableDay.isSaturday)
        .command,
    );
  }
}

export default BotWrapper;
