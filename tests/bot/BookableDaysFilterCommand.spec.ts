import BookableDaysFilterCommand from '../../src/bot/commands/BookableDaysFilterCommand';
import HtmlParser from '../../src/parser/HtmlParser';
import Calendar from '../../src/parser/Calendar';
import MessageFormatter from '../../src/bot/MessageFormatter';
import BookableDay from '../../src/parser/BookableDay';

jest.mock('../../src/parser/HtmlParser');
jest.mock('../../src/bot/MessageFormatter');

function givenHtmlParserReturns(calendars: Calendar[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HtmlParser.mockImplementation(() => {
    return {
      parseCalendarsUrl: () => {
        return calendars;
      },
    };
  });
}

const FORMATTED_MESSAGES = 'Formatted Message';
const formatBookableDaysMock = jest
  .fn()
  .mockImplementation(() => FORMATTED_MESSAGES);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
MessageFormatter.mockImplementation(() => {
  return {
    formatBookableDays: formatBookableDaysMock,
  };
});

const context = {
  reply: jest.fn(),
};

const MONDAY = '2021-07-05T00:00:00';
const TUESDAY = '2021-07-06T00:00:00';

describe('BookableDaysFilterCommand', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should reply with Nothing! when no days available', async () => {
    givenHtmlParserReturns([]);
    const bookableDaysFilterCommand = new BookableDaysFilterCommand(
      () => false,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await bookableDaysFilterCommand.command(context);

    expect(context.reply).toHaveBeenNthCalledWith(1, 'Nothing!');
  });

  it('should reply with formatted message when calendar has available days', async () => {
    const calendar = new Calendar(
      'Calendar Name',
      'Calendar Address',
      'Calendar Url',
    );
    calendar.addBookableDay(new BookableDay(new Date(MONDAY)));
    givenHtmlParserReturns([calendar]);
    const bookableDaysFilterCommand = new BookableDaysFilterCommand(() => true);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await bookableDaysFilterCommand.command(context);

    expect(context.reply).toHaveBeenNthCalledWith(1, FORMATTED_MESSAGES, {
      parse_mode: 'HTML',
    });
  });

  it('should reply only for calendars that have available days', async () => {
    const calendar1 = new Calendar(
      'Calendar Name',
      'Calendar Address',
      'Calendar Url',
    );
    calendar1.addBookableDay(new BookableDay(new Date(MONDAY)));
    const calendar2 = new Calendar(
      'Calendar2 Name',
      'Calendar2 Address',
      'Calendar2 Url',
    );
    givenHtmlParserReturns([calendar1, calendar2]);
    const bookableDaysFilterCommand = new BookableDaysFilterCommand(() => true);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await bookableDaysFilterCommand.command(context);

    expect(context.reply).toHaveBeenNthCalledWith(1, FORMATTED_MESSAGES, {
      parse_mode: 'HTML',
    });
  });

  it('should filter all found calendars', async () => {
    const calendar1 = new Calendar(
      'Calendar1 Name',
      'Calendar1 Address',
      'Calendar1 Url',
    );
    calendar1.addBookableDay(new BookableDay(new Date(MONDAY)));
    calendar1.addBookableDay(new BookableDay(new Date(TUESDAY)));
    const calendar2 = new Calendar(
      'Calendar2 Name',
      'Calendar2 Address',
      'Calendar2 Url',
    );
    calendar2.addBookableDay(new BookableDay(new Date(MONDAY)));
    calendar2.addBookableDay(new BookableDay(new Date(TUESDAY)));
    givenHtmlParserReturns([calendar1, calendar2]);
    const bookableDaysFilterCommand = new BookableDaysFilterCommand(
      (bookableDay) => bookableDay.isMonday,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await bookableDaysFilterCommand.command(context);

    expect(context.reply).toHaveBeenNthCalledWith(2, FORMATTED_MESSAGES, {
      parse_mode: 'HTML',
    });
    expect(formatBookableDaysMock).toHaveBeenNthCalledWith(
      1,
      'Calendar1 Name',
      'Calendar1 Url',
      'Calendar1 Address',
      [new BookableDay(new Date(MONDAY))],
    );

    expect(formatBookableDaysMock).toHaveBeenNthCalledWith(
      2,
      'Calendar2 Name',
      'Calendar2 Url',
      'Calendar2 Address',
      [new BookableDay(new Date(MONDAY))],
    );
  });
});
