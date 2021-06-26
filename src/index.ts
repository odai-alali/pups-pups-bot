import dotenv from 'dotenv';
import HtmlParser from './HtmlParser';
import { Notifier } from './Notifier';
import * as path from 'path';
import { BookableDay } from './BookableDay';

dotenv.config({ path: path.resolve(__dirname + '/../.env') });

const URL = 'https://www.fietje-lastenrad.de/cb-items/fietje4/#timeframe76';

const htmlParser = new HtmlParser();
const notifier = new Notifier();

notifier.startBot();

const getFilterdBookableDays = async () => {
  const bookableDays: BookableDay[] = await htmlParser.parseCalendar(URL);
  return bookableDays.filter(
    (day) => (day.isFriday && day.isInThisWeek) || day.isSaturday,
  );
};

getFilterdBookableDays().then((bookableDays) => {
  notifier.sendMessage(bookableDays);
});
