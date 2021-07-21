import CommandService from '../../src/bot/CommandService';
import HtmlParser from '../../src/parser/HtmlParser';
import Calendar from '../../src/parser/Calendar';
import BookableDay from '../../src/parser/BookableDay';
import DayCalendarsFilter from '../../src/bot/filter/DayCalendarsFilter';
import MessageFormatter from '../../src/bot/MessageFormatter';
import TextNormalizer from '../../src/bot/TextNormalizer';
import ICalendarsFilter from '../../src/bot/filter/ICalendarsFilter';

jest.mock('../../src/parser/HtmlParser');
jest.mock('../../src/parser/BookableDay');
jest.mock('../../src/parser/Calendar');
jest.mock('../../src/bot/filter/DayCalendarsFilter');
jest.mock('../../src/bot/MessageFormatter');
jest.mock('../../src/bot/TextNormalizer');

// const TODAY_DATE = new Date('2021-07-06T00:00:00');
const MONDAY_DATE = new Date('2021-07-05T00:00:00');
const TUESDAY_DATE = new Date('2021-07-06T00:00:00');
// const WEDNESDAY_DATE = new Date('2021-07-07T00:00:00');
// const THURSDAY_DATE = new Date('2021-07-08T00:00:00');
// const FRIDAY_DATE = new Date('2021-07-09T00:00:00');
// const SATURDAY_DATE = new Date('2021-07-10T00:00:00');
// const IN_THIS_WEEK_DATE = new Date('2021-07-08T00:00:00');
// const IN_NEXT_WEEK_DATE = new Date('2021-07-15T00:00:00');

function commandServiceFactory() {
  const htmlParser = new HtmlParser();
  const messageFormatter = new MessageFormatter();
  const textNormalizer = new TextNormalizer();
  return new CommandService(htmlParser, messageFormatter, textNormalizer);
}

function givenBookableDay(date: Date): BookableDay {
  return new BookableDay(date);
}

function givenCalendar(name: string, bookableDays: BookableDay[]): Calendar {
  const calendar = new Calendar(name, `${name} address`, `${name} url`);
  bookableDays.forEach((day) => calendar.addBookableDay(day));
  return calendar;
}

function givenHtmlParserReturns(calendars: Calendar[]) {
  HtmlParser.prototype.parseCalendarsUrl = jest
    .fn()
    .mockResolvedValue(calendars);
}

const filterCalendarsMock = jest.fn();
DayCalendarsFilter.prototype.filterCalendars = filterCalendarsMock;
function givenDaysCalendarFilterReturns(calendars: Calendar[]) {
  filterCalendarsMock.mockReturnValue(calendars);
}

const formatCalendarMock = jest.fn();
MessageFormatter.prototype.formatCalendar = formatCalendarMock;

const normalizeTextMock = jest.fn();
const extractFiltersFromTextMock = jest.fn();
TextNormalizer.prototype.normalize = normalizeTextMock.mockImplementation(
  (text) => text,
);
TextNormalizer.prototype.extractFiltersFromText = extractFiltersFromTextMock;
function givenExtractedFilters(filters: ICalendarsFilter[]) {
  extractFiltersFromTextMock.mockReturnValue(filters);
}

describe('CommandService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should retour nothing found when no day an any calendar were found', async () => {
    // givenHtmlParserReturns([]);
    givenDaysCalendarFilterReturns([]);
    const commandService = commandServiceFactory();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filter = {
      filterCalendars: jest.fn().mockImplementation(() => []),
    } as DayCalendarsFilter;
    givenExtractedFilters([filter]);

    const actual = await commandService.query('monday');

    expect(actual).toEqual(['I was not able to find any bookable days']);
  });

  // it('should filter parsed calendar for Mondays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar1', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   givenExtractedFilters([new DayCalendarsFilter(DayToFilter.MONDAY)]);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('monday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.MONDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });
  //
  // it('should filter parsed calendar for Tuesdays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('tuesday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.TUESDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });
  //
  // it('should filter parsed calendar for Wednesdays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('wednesday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.WEDNESDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });
  //
  // it('should filter parsed calendar for Thursdays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('thursday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.THURSDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });
  //
  // it('should filter parsed calendar for Fridays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('friday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.FRIDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });
  //
  // it('should filter parsed calendar for Saturdays', async () => {
  //   const calendarsToFilter = [
  //     givenCalendar('calendar', [
  //       givenBookableDay(MONDAY_DATE),
  //       givenBookableDay(TUESDAY_DATE),
  //     ]),
  //   ];
  //   givenHtmlParserReturns(calendarsToFilter);
  //   const commandService = commandServiceFactory();
  //
  //   await commandService.query('saturday');
  //
  //   expect(DayCalendarsFilter).toHaveBeenCalledWith(DayToFilter.SATURDAY);
  //   expect(filterCalendarsMock).toHaveBeenCalledWith(calendarsToFilter);
  // });

  it('should format filtered calendar', async () => {
    const calendarsToFilter = [
      givenCalendar('calendar', [
        givenBookableDay(MONDAY_DATE),
        givenBookableDay(TUESDAY_DATE),
      ]),
    ];
    givenHtmlParserReturns(calendarsToFilter);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filter = {
      filterCalendars: jest.fn().mockImplementation((calendars) => calendars),
    } as DayCalendarsFilter;
    givenExtractedFilters([filter]);

    const commandService = commandServiceFactory();
    await commandService.query('monday');

    expect(formatCalendarMock).toHaveBeenCalledWith(calendarsToFilter[0]);
  });

  it('should filter calendars with all returned filters from TextNormalizer', async () => {
    const commandService = commandServiceFactory();
    const TEXT = 'Non Normalized text ';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filter1 = {
      filterCalendars: jest.fn().mockImplementation((calendars) => calendars),
    } as DayCalendarsFilter;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filter2 = {
      filterCalendars: jest.fn().mockImplementation((calendars) => calendars),
    } as DayCalendarsFilter;
    givenExtractedFilters([filter1, filter2]);

    await commandService.query(TEXT);

    expect(filter1.filterCalendars).toHaveBeenCalled();
    expect(filter2.filterCalendars).toHaveBeenCalled();
  });
});
