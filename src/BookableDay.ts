import moment from 'moment';

export class BookableDay {
  date: Date;
  calendarUrl: string;

  get isSaturday(): boolean {
    return this.date.getDay() === 6;
  }

  get isFriday(): boolean {
    return this.date.getDay() === 5;
  }

  get isThursday(): boolean {
    return this.date.getDay() === 4;
  }

  get isInThisWeek(): boolean {
    return moment().isoWeek() === moment(this.date).isoWeek();
  }

  get isInNextWeek(): boolean {
    return moment().isoWeek() + 1 === moment(this.date).isoWeek();
  }

  constructor(date: Date, calendarUrl: string) {
    this.date = date;
    this.calendarUrl = calendarUrl;
  }
}
