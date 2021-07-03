import BookableDay from '../parser/BookableDay';
import moment from 'moment';

export default class MessageFormatter {
  formatBookableDays(
    calendarName: string,
    calendarUrl: string,
    calendarAddress: string,
    bookableDays: BookableDay[],
  ): string {
    const formattedDays = bookableDays
      .map((bookableDay) => {
        return `${moment(bookableDay.getDate()).format('dddd DD.MM.yyyy')}`;
      })
      .join('\n');

    return `Checkout the following days at <b>${calendarName}</b> \n <i>${calendarAddress}</i>\n\n${formattedDays}\n\n ${calendarUrl}`;
  }
}
