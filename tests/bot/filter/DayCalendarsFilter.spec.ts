import DayCalendarsFilter from '../../../src/bot/filter/DayCalendarsFilter';
import BookableDay from '../../../src/parser/BookableDay';
import Calendar from '../../../src/parser/Calendar';
import DayToFilter from '../../../src/bot/filter/DayToFilter';

// const TODAY_DATE = new Date('2021-07-06T00:00:00');
const MONDAY_DATE = new Date('2021-07-05T00:00:00');
const TUESDAY_DATE = new Date('2021-07-06T00:00:00');
// const WEDNESDAY_DATE = new Date('2021-07-07T00:00:00');
// const THURSDAY_DATE = new Date('2021-07-08T00:00:00');
// const FRIDAY_DATE = new Date('2021-07-09T00:00:00');
// const SATURDAY_DATE = new Date('2021-07-10T00:00:00');
// const IN_THIS_WEEK_DATE = new Date('2021-07-08T00:00:00');
// const IN_NEXT_WEEK_DATE = new Date('2021-07-15T00:00:00');

function givenBookableDay(date: Date) {
  return new BookableDay(date);
}

function givenCalendar(name: string, bookableDays: BookableDay[]) {
  const calendar = new Calendar(name, `${name} address`, `${name} url`);
  bookableDays.forEach((day) => calendar.addBookableDay(day));
  return calendar;
}

describe('DayCalendarsFilter', () => {
  it('should filter calendars', () => {
    const calendar1 = givenCalendar('Calendar1', [
      givenBookableDay(MONDAY_DATE),
      givenBookableDay(TUESDAY_DATE),
    ]);
    const calendar2 = givenCalendar('Calendar2', [
      givenBookableDay(TUESDAY_DATE),
    ]);
    const dayFilter = new DayCalendarsFilter(DayToFilter.MONDAY);

    const filteredCalendars = dayFilter.filterCalendars([calendar1, calendar2]);

    expect(filteredCalendars).toHaveLength(1);
  });
});
