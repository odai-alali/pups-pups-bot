import BookableDay from '../../src/parser/BookableDay';
import * as MockDate from 'mockdate';

const TODAY = '2021-07-06T00:00:00';
const MONDAY = '2021-07-05T00:00:00';
const TUESDAY = '2021-07-06T00:00:00';
const WEDNESDAY = '2021-07-07T00:00:00';
const THURSDAY = '2021-07-08T00:00:00';
const FRIDAY = '2021-07-09T00:00:00';
const SATURDAY = '2021-07-10T00:00:00';
const IN_THIS_WEEK = '2021-07-08T00:00:00';
const IN_NEXT_WEEK = '2021-07-15T00:00:00';

describe('BookableDay', () => {
  afterEach(() => {
    MockDate.reset();
  });
  it('should create bookable day with date', () => {
    const bookableDay = new BookableDay(new Date(TODAY));

    expect(bookableDay).toBeInstanceOf(BookableDay);
    expect(bookableDay.getDate()).toEqual(new Date(TODAY));
  });

  it('should check if bookable day is Monday', () => {
    const bookableDay = new BookableDay(new Date(MONDAY));

    expect(bookableDay.isMonday).toBeTruthy();
  });

  it('should check if bookable day is Tuesday', () => {
    const bookableDay = new BookableDay(new Date(TUESDAY));

    expect(bookableDay.isTuesday).toBeTruthy();
  });

  it('should check if bookable day is Wednesday', () => {
    const bookableDay = new BookableDay(new Date(WEDNESDAY));

    expect(bookableDay.isWednesday).toBeTruthy();
  });

  it('should check if bookable day is Thursday', () => {
    const bookableDay = new BookableDay(new Date(THURSDAY));

    expect(bookableDay.isThursday).toBeTruthy();
  });

  it('should check if bookable day is Friday', () => {
    const bookableDay = new BookableDay(new Date(FRIDAY));

    expect(bookableDay.isFriday).toBeTruthy();
  });

  it('should check if bookable day is Saturday', () => {
    const bookableDay = new BookableDay(new Date(SATURDAY));

    expect(bookableDay.isSaturday).toBeTruthy();
  });

  it('should check if bookable day is in this week', () => {
    MockDate.set(new Date(TODAY));
    const bookableDay = new BookableDay(new Date(IN_THIS_WEEK));

    expect(bookableDay.isInThisWeek).toBeTruthy();
  });

  it('should check if bookable day is in next week', () => {
    MockDate.set(new Date(TODAY));
    const bookableDay = new BookableDay(new Date(IN_NEXT_WEEK));

    expect(bookableDay.isInNextWeek).toBeTruthy();
  });
});
