import { Context, Telegraf } from 'telegraf';
import SimpleDb from '../persistance/SimpleDb';
import CommandService from './CommandService';
import fs from 'fs';

class BotWrapper {
  private bot!: Telegraf;
  private simpleDb: SimpleDb;
  private readonly commandService: CommandService;

  constructor(
    bot: Telegraf,
    simpleDb: SimpleDb,
    commandService: CommandService,
  ) {
    this.bot = bot;
    this.simpleDb = simpleDb;
    this.commandService = commandService;
  }

  async launchBot(): Promise<void> {
    await this.registerBotCommands();
    await this.bot.launch();

    // Enable graceful stop
    process.once('SIGINT', this.onInterrupt.bind(this));
    process.once('SIGTERM', this.onTerminate.bind(this));
  }

  private onTerminate() {
    this.bot.stop('SIGTERM');
  }

  private onInterrupt() {
    this.bot.stop('SIGINT');
  }

  private async registerBotCommands() {
    this.bot.start(this.onStartCommand.bind(this));

    this.bot.hears(
      new RegExp('^(?!/start$|/help).*'),
      this.onTextCommand.bind(this),
    );
  }

  async onStartCommand(ctx: Context): Promise<void> {
    if (ctx.message?.chat && ctx.message.from) {
      await ctx.reply(`Hi ${ctx.message.from.first_name}!`);
      this.simpleDb.addSubscriber(
        ctx.message.chat.id as number,
        ctx.message.from.username as string,
      );
    }
  }

  async onTextCommand(ctx: Context): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const answers = await this.commandService.query(ctx.message.text);
    for (const answer of answers) {
      await ctx.reply(answer, { parse_mode: 'HTML' });
    }
  }

  async sendToAll(message: string): Promise<void> {
    for (const id of this.simpleDb.getAllChatIds()) {
      if (!this.simpleDb.answerHashExists(id, message)) {
        await this.bot.telegram.sendMessage(id, message, {
          parse_mode: 'HTML',
        });
        this.simpleDb.addAnswerHashForChatId(id, message);
      }
    }
  }

  // TODO delete this in the next deployment
  async sendToAllOldChatIds(message: string): Promise<void> {
    const ids = fs.readFileSync('./_data/chatIds', 'utf-8');
    ids
      .split('\n')
      .filter((id) => !!id)
      .map((id) => {
        this.bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' });
      });
  }

  async notifySubscribersForBookableSaturdays(): Promise<void> {
    const answers = await this.commandService.query('saturday');
    for (const answer of answers) {
      await this.sendToAll(answer);
    }
  }
}

export default BotWrapper;
