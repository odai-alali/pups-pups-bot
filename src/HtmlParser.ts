import $, { Cheerio, Element } from 'cheerio';
import rp from 'request-promise';
import { BookableDay } from './BookableDay';
import Calendar from './parser/Calendar';

class HtmlParser {
  private getAvailableDates(calendar: Cheerio<Element>): Date[] {
    const bookableDates: Date[] = [];
    $('ul.cb-calendar li.bookable', calendar).each((index, element) => {
      const id = $(element).attr('id');
      if (id) {
        bookableDates.push(new Date(parseInt(id) * 1000));
      }
    });
    return bookableDates;
  }

  public async parseCalendarsUrl(urls: string[]): Promise<Calendar[]> {
    const calendars: Calendar[] = [];

    for (const url of urls) {
      const html = await rp(url);

      $('.cb-timeframe', html).each((index, element) => {
        const calendarName = $('.cb-location-name', $(element)).text().trim();
        const calendarAddress = $('.cb-address', $(element))
          .contents()
          .filter((index, node) => {
            return node.nodeType === 3;
          })
          // .wrap('p')
          .text()
          .trim();
        const availableDates = this.getAvailableDates($(element));
        const calendar = new Calendar(calendarName, calendarAddress, url);
        for (const availableDat of availableDates) {
          calendar.addBookableDay(new BookableDay(availableDat));
        }
        calendars.push(calendar);
      });
    }
    return calendars;
  }
}

export default HtmlParser;
