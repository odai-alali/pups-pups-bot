import MessageFormatter from '../../src/bot/MessageFormatter';
import BookableDay from '../../src/parser/BookableDay';
import Calendar from '../../src/parser/Calendar';

const MONDAY = '2021-07-05T00:00:00';
const TUESDAY = '2021-07-06T00:00:00';

function givenBookableDay(date: Date) {
  return new BookableDay(date);
}

function givenCalendar(name: string, bookableDays: BookableDay[]) {
  const calendar = new Calendar(name, `${name} address`, `${name} url`);
  bookableDays.forEach((day) => calendar.addBookableDay(day));
  return calendar;
}

describe('MessageFormatter', () => {
  it('should format calendar', () => {
    const messageFormatter = new MessageFormatter();
    const calendar = givenCalendar('Calendar', []);

    const result = messageFormatter.formatCalendar(calendar);

    expect(result).toContain('Checkout the following days at <b>Calendar</b>');
    expect(result).toContain('<i>Calendar address</i>');
    expect(result).toContain('Calendar url');
  });

  it('should format bookable days', () => {
    const messageFormatter = new MessageFormatter();
    const bookableDay1 = givenBookableDay(new Date(MONDAY));
    const bookableDay2 = givenBookableDay(new Date(TUESDAY));
    const calendar = givenCalendar('Calendar', [bookableDay1, bookableDay2]);

    const result = messageFormatter.formatCalendar(calendar);

    expect(result).toContain('Monday 05.07.2021\nTuesday 06.07.2021');
  });
});
