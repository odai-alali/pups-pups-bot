import $, { Cheerio, Element } from 'cheerio';
import rp from 'request-promise';
import { BookableDay } from './BookableDay';

export default class HtmlParser {
  public selectCalendars(html: string): Cheerio<Element>[] {
    const calendars: Cheerio<Element>[] = [];
    $('.cb-timeframe', html).each((index, element) => {
      calendars.push($(element));
    });
    return calendars;
  }

  public getAvailableDates(calendar: Cheerio<Element>): Date[] {
    const bookableDates: Date[] = [];
    $('ul.cb-calendar li.bookable', calendar).each((index, element) => {
      const id = $(element).attr('id');
      if (id) {
        bookableDates.push(new Date(parseInt(id) * 1000));
      }
    });
    return bookableDates;
  }

  public async parseCalendar(url: string): Promise<BookableDay[]> {
    const bookableDays: BookableDay[] = [];
    const html = await rp(url);
    const calendars: Cheerio<Element>[] = this.selectCalendars(html);
    for (const calendar of calendars) {
      const availableDates = this.getAvailableDates(calendar);
      for (const availableDat of availableDates) {
        bookableDays.push(new BookableDay(availableDat, url));
      }
    }
    return bookableDays;
  }
}
