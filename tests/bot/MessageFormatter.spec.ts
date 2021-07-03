import MessageFormatter from '../../src/bot/MessageFormatter';
import BookableDay from '../../src/parser/BookableDay';

const CALENDAR_NAME = 'Calendar Name';
const CALENDAR_URL = 'Calendar Url';
const CALENDAR_ADDRESS = 'Calendar Address';
const MONDAY = '2021-07-05T00:00:00';
const TUESDAY = '2021-07-06T00:00:00';

describe('MessageFormatter', () => {
  it('should format calendar information', () => {
    const messageFormatter = new MessageFormatter();

    const result = messageFormatter.formatBookableDays(
      CALENDAR_NAME,
      CALENDAR_URL,
      CALENDAR_ADDRESS,
      [],
    );

    expect(result).toContain(
      `Checkout the following days at <b>${CALENDAR_NAME}</b>`,
    );
    expect(result).toContain(`<i>${CALENDAR_ADDRESS}</i>`);
    expect(result).toContain(`${CALENDAR_URL}`);
  });

  it('should format bookable days', () => {
    const messageFormatter = new MessageFormatter();
    const bookableDay1 = new BookableDay(new Date(MONDAY));
    const bookableDay2 = new BookableDay(new Date(TUESDAY));

    const result = messageFormatter.formatBookableDays(
      CALENDAR_NAME,
      CALENDAR_URL,
      CALENDAR_ADDRESS,
      [bookableDay1, bookableDay2],
    );

    expect(result).toContain('Monday 05.07.2021\nTuesday 06.07.2021');
  });
});
