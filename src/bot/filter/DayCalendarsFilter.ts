import Calendar from '../../parser/Calendar';
import ICalendarsFilter from './ICalendarsFilter';
import DayToFilter from './DayToFilter';

class DayCalendarsFilter implements ICalendarsFilter {
  private readonly day: DayToFilter;
  private readonly calendars: Calendar[];

  constructor(calendars: Calendar[], day: DayToFilter) {
    this.calendars = calendars;
    this.day = day;
  }

  filterCalendars(): Calendar[] {
    const newCalendars: Calendar[] = [];
    for (const calendar of this.calendars) {
      const filteredCalendar = this.filterCalendarDays(calendar);
      if (filteredCalendar.getBookableDays().length) {
        newCalendars.push(filteredCalendar);
      }
    }
    return newCalendars;
  }

  filterCalendarDays(calendar: Calendar): Calendar {
    const newCalendar = new Calendar(
      calendar.getName(),
      calendar.getAddress(),
      calendar.getUrl(),
    );
    calendar
      .getBookableDays((day) => day.getDate().getDay() === this.day)
      .map((day) => newCalendar.addBookableDay(day));
    return newCalendar;
  }
}

export default DayCalendarsFilter;
