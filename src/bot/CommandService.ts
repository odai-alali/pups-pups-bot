import HtmlParser from '../parser/HtmlParser';
import DayCalendarsFilter from './filter/DayCalendarsFilter';
import DayToFilter from './filter/DayToFilter';
import ICalendarsFilter from './filter/ICalendarsFilter';
import { URLs } from '../utils';
import MessageFormatter from './MessageFormatter';

class CommandService {
  private readonly htmlParser: HtmlParser;
  private readonly messageFormatter: MessageFormatter;

  constructor(htmlParser: HtmlParser, messageFormatter: MessageFormatter) {
    this.htmlParser = htmlParser;
    this.messageFormatter = messageFormatter;
  }

  async query(text: string): Promise<string> {
    const calendars = await this.htmlParser.parseCalendarsUrl(URLs);
    let day;
    if (text === 'monday') {
      day = DayToFilter.MONDAY;
    }
    if (text === 'tuesday') {
      day = DayToFilter.TUESDAY;
    }
    if (text === 'wednesday') {
      day = DayToFilter.WEDNESDAY;
    }
    if (text === 'thursday') {
      day = DayToFilter.THURSDAY;
    }
    if (text === 'friday') {
      day = DayToFilter.FRIDAY;
    }
    if (text === 'saturday') {
      day = DayToFilter.SATURDAY;
    }
    let filter: ICalendarsFilter | undefined = undefined;
    if (day) {
      filter = new DayCalendarsFilter(calendars, day);
      if (day && filter) {
        const filteredCalendars = filter.filterCalendars();
        if (filteredCalendars.length) {
          return filteredCalendars
            .map((filteredCalendar) => {
              return this.messageFormatter.formatCalendar(filteredCalendar);
            })
            .join('\n');
        }
      }
    }
    return 'I was not able to find any bookable Mondays';
  }
}

export default CommandService;
