import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import { BookableDay } from './BookableDay';
import moment from 'moment';

const CHAT_IDS_FILE = path.resolve(__dirname + '/../_data/chatIds');

export class Notifier {
  private chatIds: number[];
  private bot: Telegraf;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error('BOT_TOKEN is not set.');
    }
    this.chatIds = this.loadChatIds();
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  public startBot(): void {
    this.bot.start((ctx) => {
      ctx.reply(
        'OK!, I will notify with a message when I find a perfect day to book your bike',
      );
      this.addChatId(ctx.message.chat.id);
    });

    this.bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private loadChatIds(): number[] {
    Notifier.createChatIdsIfNotExists();
    const content = fs.readFileSync(CHAT_IDS_FILE, 'utf-8');
    return content
      .split('\n')
      .map((id) => parseFloat(id))
      .filter((id) => !isNaN(id));
  }

  private addChatId(id: number): void {
    if (this.chatIds.includes(id)) return;
    this.chatIds.push(id);
    fs.writeFileSync(CHAT_IDS_FILE, this.chatIds.join('\n'));
  }

  private static createChatIdsIfNotExists() {
    if (!fs.existsSync(CHAT_IDS_FILE)) {
      fs.writeFileSync(CHAT_IDS_FILE, '');
    }
  }

  public sendMessage(bookableDays: BookableDay[]): void {
    const message = bookableDays
      .map((bookableDay) => {
        return `Check out ${moment(bookableDay.date).format(
          'dddd DD.MM.yyyy',
        )} at ${bookableDay.calendarUrl}\n\n`;
      })
      .join('\n');

    if (message.length === 0) return;

    for (const id of this.chatIds) {
      this.bot.telegram.sendMessage(id, message);
    }
  }
}
