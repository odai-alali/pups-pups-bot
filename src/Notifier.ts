import { Telegraf } from 'telegraf';
import { BookableDay } from './BookableDay';
import HtmlParser from './HtmlParser';
import { URLs } from './utils';
import MessageFormatter from './bot/MessageFormatter';
import SimpleDb from './persistance/SimpleDb';

const htmlParser = new HtmlParser();

export class Notifier {
  private bot: Telegraf;
  private messageFormatter: MessageFormatter;

  constructor(bot: Telegraf) {
    this.bot = bot;
    this.messageFormatter = new MessageFormatter();
  }

  async sendToAll(message: string): Promise<void> {
    for (const id of SimpleDb.getInstance().getChatIds()) {
      this.bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' });
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
        for (const id of SimpleDb.getInstance().getChatIds()) {
          this.bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' });
        }
      }
    }
  }
}
