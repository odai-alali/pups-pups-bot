import HtmlParser from '../../parser/HtmlParser';
import { Context } from 'telegraf';
import MessageFormatter from '../MessageFormatter';
import { URLs } from '../../utils';
import ICommand from './ICommand';
import Calendar, { BookableDaysFilterFunction } from '../../parser/Calendar';

export default class BookableDaysFilterCommand implements ICommand {
  private htmlParser: HtmlParser;
  private messageFormatter: MessageFormatter;
  private filterFunction: BookableDaysFilterFunction;

  constructor(filterFunction: BookableDaysFilterFunction) {
    this.filterFunction = filterFunction;
    this.htmlParser = new HtmlParser();
    this.messageFormatter = new MessageFormatter();
  }

  command = async (ctx: Context): Promise<void> => {
    const calendars: Calendar[] = await this.htmlParser.parseCalendarsUrl(URLs);
    const daysAvailable = calendars
      .map(
        (calendar) => calendar.getBookableDays(this.filterFunction).length > 0,
      )
      .reduce((p, c) => p || c, false);

    if (!daysAvailable) {
      await ctx.reply('Nothing!');
    } else {
      for (const calendar of calendars) {
        if (calendar.getBookableDays(this.filterFunction).length > 0) {
          await ctx.reply(
            this.messageFormatter.formatBookableDays(
              calendar.getName(),
              calendar.getUrl(),
              calendar.getAddress(),
              calendar.getBookableDays(this.filterFunction),
            ),
            {
              parse_mode: 'HTML',
            },
          );
        }
      }
    }
  };
}
