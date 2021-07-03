import Calendar from '../../src/parser/Calendar';
import BookableDay from '../../src/parser/BookableDay';

describe('Calendar', () => {
  const CALENDAR = 'Calendar1';
  const CALENDAR_URL = 'CALENDAR_URL';

  const ADDRESS = 'Address1';

  it('should have name and address and url', () => {
    const calendar = new Calendar(CALENDAR, ADDRESS, CALENDAR_URL);

    expect(calendar.getName()).toEqual(CALENDAR);
    expect(calendar.getAddress()).toEqual(ADDRESS);
    expect(calendar.getUrl()).toEqual(CALENDAR_URL);
  });

  it('should add a bookable day', () => {
    const calendar = new Calendar(CALENDAR, ADDRESS, CALENDAR_URL);
    const bookableDay = new BookableDay(new Date());
    calendar.addBookableDay(bookableDay);

    expect(calendar.getBookableDays()).toEqual([bookableDay]);
  });

  it('should filter bookable days', () => {
    const calendar = new Calendar(CALENDAR, ADDRESS, CALENDAR_URL);
    const bookableDay1 = new BookableDay(new Date('1995-12-17T00:00:00'));
    const bookableDay2 = new BookableDay(new Date('1995-12-18T00:00:00'));
    const bookableDay3 = new BookableDay(new Date('1995-12-19T00:00:00'));
    const bookableDay4 = new BookableDay(new Date('1995-12-20T00:00:00'));
    calendar.addBookableDay(bookableDay1);
    calendar.addBookableDay(bookableDay2);
    calendar.addBookableDay(bookableDay3);
    calendar.addBookableDay(bookableDay4);

    const bookableDays = calendar.getBookableDays((bookableDay) => {
      return (
        bookableDay.getDate().getTime() >=
        new Date('1995-12-18T00:00:00').getTime()
      );
    });

    expect(bookableDays).toHaveLength(3);
  });
});
