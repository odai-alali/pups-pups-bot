import $, { Element, SelectorType } from 'cheerio';
import rp from 'request-promise';
import BookableDay from './BookableDay';
import Calendar from './Calendar';

export const CALENDAR_CLASS = 'cb-timeframe';
export const CALENDAR_NAME_CLASS = 'cb-location-name';
export const CALENDAR_ADDRESS_CLASS = 'cb-address';
export const BOOKABLE_DAY_CLASS = 'bookable';
const CALENDAR_SELECTOR: SelectorType = `.${CALENDAR_CLASS}`;
const CALENDAR_NAME_SELECTOR: SelectorType = `.${CALENDAR_NAME_CLASS}`;
const CALENDAR_ADDRESS_SELECTOR: SelectorType = `.${CALENDAR_ADDRESS_CLASS}`;
const BOOKABLE_DAY_SELECTOR: SelectorType = `.${BOOKABLE_DAY_CLASS}`;

class HtmlParser {
  public getAvailableDates(calendar: Element): Date[] {
    const bookableDates: Date[] = [];
    $(BOOKABLE_DAY_SELECTOR, $(calendar)).each((index, element) => {
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
      const calendarElements = await this.getCalendarElements(url);
      for (const calendarElement of calendarElements) {
        const calendarName = this.getCalendarName(calendarElement);
        const calendarAddress = this.getCalendarAddress(calendarElement);
        const availableDates = this.getAvailableDates(calendarElement);
        const calendar = new Calendar(calendarName, calendarAddress, url);
        for (const availableDat of availableDates) {
          calendar.addBookableDay(new BookableDay(availableDat));
        }
        calendars.push(calendar);
      }
    }
    return calendars;
  }

  public async getCalendarElements(url: string): Promise<Element[]> {
    const html = await rp(url);
    const calendarElements: Element[] = [];
    $(CALENDAR_SELECTOR, html).each((index, element) => {
      calendarElements.push(element);
    });
    return calendarElements;
  }

  public getCalendarAddress(element: Element): string {
    return $(CALENDAR_ADDRESS_SELECTOR, $(element))
      .contents()
      .filter((index, node) => {
        return node.nodeType === 3;
      })
      .text()
      .trim();
  }

  public getCalendarName(element: Element): string {
    return $(CALENDAR_NAME_SELECTOR, $(element)).text().trim();
  }
}

export default HtmlParser;
