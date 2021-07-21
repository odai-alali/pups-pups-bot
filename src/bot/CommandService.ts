import HtmlParser from '../parser/HtmlParser';
import { URLs } from '../utils';
import MessageFormatter from './MessageFormatter';
import TextNormalizer from './TextNormalizer';

class CommandService {
  private readonly htmlParser: HtmlParser;
  private readonly messageFormatter: MessageFormatter;
  private readonly textNormalizer: TextNormalizer;

  constructor(
    htmlParser: HtmlParser,
    messageFormatter: MessageFormatter,
    textNormalizer: TextNormalizer,
  ) {
    this.htmlParser = htmlParser;
    this.messageFormatter = messageFormatter;
    this.textNormalizer = textNormalizer;
  }

  async query(text: string): Promise<string[]> {
    const calendars = await this.htmlParser.parseCalendarsUrl(URLs);
    const messages: string[] = [];
    const filters = this.textNormalizer.extractFiltersFromText(text);
    for (const filter of filters) {
      const filteredCalendars = filter.filterCalendars(calendars);
      if (filteredCalendars.length) {
        messages.push(
          ...filteredCalendars.map((filteredCalendar) => {
            return this.messageFormatter.formatCalendar(filteredCalendar);
          }),
        );
      }
    }
    if (messages.length) {
      return messages;
    }
    return ['I was not able to find any bookable days'];
  }
}

export default CommandService;
