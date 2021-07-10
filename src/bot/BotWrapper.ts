import { Context, Telegraf } from 'telegraf';
import SimpleDb from '../persistance/SimpleDb';
import CommandService from './CommandService';

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
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private async registerBotCommands() {
    this.bot.start((ctx) => {
      ctx.message;
      ctx.reply(`Hi ${ctx.message.from.first_name}!`);
      this.simpleDb.addChatId(ctx.message.chat.id);
    });

    this.bot.hears(new RegExp('^(?!/start$|/help).*'), (ctx) =>
      this.onTextCommand(ctx),
    );
  }

  async onTextCommand(ctx: Context): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const answer = await this._commandService.query(ctx.message.text);
    return ctx.reply(answer, { parse_mode: 'HTML' });
  }
}

export default BotWrapper;
