import BookableDay from './BookableDay';

export declare type BookableDaysFilterFunction = (
  bookableDay: BookableDay,
) => boolean;

class Calendar {
  private name: string;
  private address: string;
  private url: string;
  private bookableDays: BookableDay[] = [];

  constructor(name: string, address: string, url: string) {
    this.name = name;
    this.address = address;
    this.url = url;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  addBookableDay(bookableDay: BookableDay): void {
    this.bookableDays.push(bookableDay);
  }

  getBookableDays(
    filterFunction: BookableDaysFilterFunction | undefined = undefined,
  ): BookableDay[] {
    if (!filterFunction) {
      return this.bookableDays;
    }
    return this.bookableDays.filter(filterFunction);
  }

  getUrl(): string {
    return this.url;
  }
}

export default Calendar;
