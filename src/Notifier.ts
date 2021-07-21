import { Telegraf } from 'telegraf';
import HtmlParser from './parser/HtmlParser';
import { URLs } from './utils';
import MessageFormatter from './bot/MessageFormatter';
import SimpleDb from './persistance/SimpleDb';
import DayCalendarsFilter from './bot/filter/DayCalendarsFilter';
import DayToFilter from './bot/filter/DayToFilter';

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
    const saturdayFilter = new DayCalendarsFilter(DayToFilter.SATURDAY);
    const filteredCalendars = saturdayFilter.filterCalendars(calendars);
    if (filteredCalendars.length) {
      const notificationMessage = filteredCalendars
        .map((filteredCalendar) =>
          this.messageFormatter.formatCalendar(filteredCalendar),
        )
        .join('\n\n');
      for (const id of this.simpleDb.getChatIds()) {
        await this.bot.telegram.sendMessage(id, notificationMessage, {
          parse_mode: 'HTML',
        });
      }
    }
  }
}
