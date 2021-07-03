import HtmlParser from '../src/HtmlParser';
import Calendar from '../src/parser/Calendar';
import rp from 'request-promise';
import resetAllMocks = jest.resetAllMocks;

const CALENDAR_URL = 'http://calendar.test';

jest.mock('request-promise');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
rp.mockImplementation(() =>
  Promise.resolve(
    `
    <div class="cb-timeframe cb-box" id="84" data-tfid="84" data-itemid="584" data-locid="727">
   <span class="cb-date">01.07.21 - 31.10.21</span> <span class="cb-timeframe-title">2021_07_01-2021_10_31 Füllkorn - unverpackt &amp; bio</span>
   <div class="cb-location-name cb-big">
      Füllkorn – unverpackt &amp; bio   
   </div>
   <div class="cb-table">
      <div class="cb-address cb-row">
         <a href="http://maps.google.com/?q=Kornstraße 12, Bremen 28201, Bremen-Neustadt" target="_blank" class="cb-button align-right cb-small">Auf der Karte zeigen</a>
         <span class="cb-row-title">Adresse</span>
         Kornstraße 12, Bremen 28201, Bremen-Neustadt
      </div>
      <div class="cb-opening-hours cb-row"><span class="cb-row-title">Öffnungszeiten</span>Mo-Fr, 09:00-19:00 Uhr, Sa, 10:00-15:00 Uhr. Die Station hat sonntags/feiertags geschlossen. Du kannst Fietje aber über den Sonntag/Feiertag hinweg buchen! Der ADFC blockt die Fietjes an den Feiertagen, ohne sie zu nutzen – also einfach den Tag vorher und nachher buchen und du kannst Fietje über den Feiertag behalten.</div>
      <div class="cb-contact cb-row"><span class="cb-row-title">Kontaktdaten</span>0421 499 525 62, sawatzkiulf@gmail.com</div>
   </div>
   <div id="timeframe_84" class="cb_timeframe_form">
      <ul class="cb-calendar">
         <li id="1625270400" class="cb-tooltip day6 booked tooltipstered">
            <div class="cb-cal-inner"><span class="cb-j">3. </span><span class="cb-M">Jul </span>
            </div>
         </li>
         <li id="1625356800" class="cb-tooltip day7 closed tooltipstered">
            <div class="cb-cal-inner"><span class="cb-j">4. </span><span class="cb-M">Jul </span>
            </div>
         </li>
      </ul>
   </div>
</div>`,
  ),
);

describe('HtmlParser', () => {
  afterAll(() => {
    resetAllMocks();
  });
  it('should parse calendar divs', async () => {
    const htmlParser = new HtmlParser();

    const calendars = await htmlParser.parseCalendarsUrl([CALENDAR_URL]);

    expect(calendars.length).toEqual(1);
    expect(calendars[0]).toBeInstanceOf(Calendar);
    expect(calendars[0].getAddress()).toEqual(
      'Kornstraße 12, Bremen 28201, Bremen-Neustadt',
    );
  });
});
