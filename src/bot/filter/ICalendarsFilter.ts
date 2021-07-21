import Calendar from '../../parser/Calendar';

interface ICalendarsFilter {
  filterCalendars(calendars: Calendar[]): Calendar[];
}

export default ICalendarsFilter;
