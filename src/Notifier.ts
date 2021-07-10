import { Telegraf } from 'telegraf';
import BookableDay from './parser/BookableDay';
import HtmlParser from './parser/HtmlParser';
import { URLs } from './utils';
import MessageFormatter from './bot/MessageFormatter';
import SimpleDb from './persistance/SimpleDb';

const htmlParser = new HtmlParser();

export class Notifier {
  private readonly bot: Telegraf;
  private readonly simpleDb: SimpleDb;
  private messageFormatter: MessageFormatter;

  constructor(bot: Telegraf, simpleDb: SimpleDb) {
    this.bot = bot;
    this.simpleDb = simpleDb;
    this.messageFormatter = new MessageFormatter();
  }

  async sendToAll(message: string): Promise<void> {
    for (const id of this.simpleDb.getChatIds()) {
      await this.bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' });
    }
  }

  async notifyBookableDays(): Promise<void> {
    const calendars = await htmlParser.parseCalendarsUrl(URLs);
    const filterFunction = (day: BookableDay) => day.isFriday;

    for (const calendar of calendars) {
      if (calendar.getBookableDays(filterFunction).length) {
        const message = this.messageFormatter.formatBookableDays(
          calendar.getName(),
          calendar.getUrl(),
          calendar.getAddress(),
          calendar.getBookableDays(filterFunction),
        );
        for (const id of this.simpleDb.getChatIds()) {
          await this.bot.telegram.sendMessage(id, message, {
            parse_mode: 'HTML',
          });
        }
      }
    }
  }
}
