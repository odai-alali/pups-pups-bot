import moment from 'moment';

class BookableDay {
  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  getDate(): Date {
    return this.date;
  }

  get isSaturday(): boolean {
    return this.date.getDay() === 6;
  }

  get isFriday(): boolean {
    return this.date.getDay() === 5;
  }

  get isThursday(): boolean {
    return this.date.getDay() === 4;
  }

  get isWednesday(): boolean {
    return this.date.getDay() === 3;
  }

  get isTuesday(): boolean {
    return this.date.getDay() === 2;
  }

  get isMonday(): boolean {
    return this.date.getDay() === 1;
  }

  get isInThisWeek(): boolean {
    return moment().isoWeek() === moment(this.date).isoWeek();
  }
  get isInNextWeek(): boolean {
    return moment().isoWeek() + 1 === moment(this.date).isoWeek();
  }
}

export default BookableDay;
