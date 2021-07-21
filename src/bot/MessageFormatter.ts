import moment from 'moment';
import Calendar from '../parser/Calendar';

class MessageFormatter {
  formatCalendar(calendar: Calendar): string {
    const bookableDays = calendar.getBookableDays();
    const formattedDays = bookableDays
      .map((bookableDay) => {
        return `${moment(bookableDay.getDate()).format('dddd DD.MM.yyyy')}`;
      })
      .join('\n');

    return (
      `Checkout the following days at <b>${calendar.getName()}</b> ` +
      `\n<i>${calendar.getAddress()}</i>` +
      `\n\n${formattedDays}\n\n ${calendar.getUrl()}`
    );
  }
}

export default MessageFormatter;
