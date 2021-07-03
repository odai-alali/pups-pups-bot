import HtmlParser, {
  BOOKABLE_DAY_CLASS,
  CALENDAR_ADDRESS_CLASS,
  CALENDAR_CLASS,
  CALENDAR_NAME_CLASS,
} from '../../src/parser/HtmlParser';
import Calendar from '../../src/parser/Calendar';
import rp from 'request-promise';
import resetAllMocks = jest.resetAllMocks;
import restoreAllMocks = jest.restoreAllMocks;

const CALENDAR_URL = 'http://calendar.test';

jest.mock('request-promise');

function givenResponse(htmlResponse: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rp.mockImplementation(() => Promise.resolve(htmlResponse));
}

describe('HtmlParser', () => {
  afterEach(() => {
    restoreAllMocks();
  });
  afterAll(() => {
    resetAllMocks();
  });

  it('should parse calendar elements using selector', async () => {
    givenResponse(
      `<div class="${CALENDAR_CLASS}"></div><div class="${CALENDAR_CLASS}"></div>`,
    );
    const htmlParser = new HtmlParser();

    const result = await htmlParser.getCalendarElements(CALENDAR_URL);

    expect(result).toHaveLength(2);
  });

  it('should parse and trim calendar name from calendar element', async () => {
    const CALENDAR_NAME = 'Calendar Name';
    givenResponse(`
            <div class="${CALENDAR_CLASS}">
                <div class="${CALENDAR_NAME_CLASS}">
                
                    ${CALENDAR_NAME}   
                    
                    
                </div>
            </div>`);
    const htmlParser = new HtmlParser();
    const calendarElements = await htmlParser.getCalendarElements(CALENDAR_URL);
    const name = htmlParser.getCalendarName(calendarElements[0]);

    expect(name).toEqual(CALENDAR_NAME);
  });

  it('should parse and trim calendar name from calendar element', async () => {
    const CALENDAR_ADDRESS = 'Calendar Name';
    givenResponse(`
            <div class="${CALENDAR_CLASS}">
                <div class="${CALENDAR_ADDRESS_CLASS}">
                    <span>more text</span>
                    ${CALENDAR_ADDRESS}   
                    
                    <button>map button</button>
                </div>
            </div>`);
    const htmlParser = new HtmlParser();
    const calendarElements = await htmlParser.getCalendarElements(CALENDAR_URL);
    const address = htmlParser.getCalendarAddress(calendarElements[0]);

    expect(address).toEqual(CALENDAR_ADDRESS);
  });

  it('should parse available dates for booking', async () => {
    const TIMESTAMP1 = 1617660000;
    const DATE1 = '2021-04-05T22:00:00';
    const TIMESTAMP2 = 1617746400;
    const DATE2 = '2021-04-06T22:00:00';
    givenResponse(`
            <div class="${CALENDAR_CLASS}">
                <ul>
                    <li class="${BOOKABLE_DAY_CLASS}" id="${TIMESTAMP1}"></li>
                    <li class="${BOOKABLE_DAY_CLASS}" id="${TIMESTAMP2}"></li>
                    <li id="1617919200"></li>
                    <li id="1618005600"></li>
                </ul>
            </div>`);
    const htmlParser = new HtmlParser();
    const calendarElements = await htmlParser.getCalendarElements(CALENDAR_URL);
    const result = htmlParser.getAvailableDates(calendarElements[0]);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(new Date(DATE1));
    expect(result).toContainEqual(new Date(DATE2));
  });

  it('should parse calendar information into Calendar objects', async () => {
    givenResponse(`
      <div class="${CALENDAR_CLASS}">
          <div class="${CALENDAR_NAME_CLASS}">
            Füllkorn – unverpackt &amp; bio   
          </div>
          <div class="${CALENDAR_ADDRESS_CLASS}">
             <a href="http://maps.google.com/?q=Kornstraße 12, Bremen 28201, Bremen-Neustadt" target="_blank" class="cb-button align-right cb-small">Auf der Karte zeigen</a>
             <span class="cb-row-title">Adresse</span>
             Kornstraße 12, Bremen 28201, Bremen-Neustadt
          </div>
          <ul>
              <li class="${BOOKABLE_DAY_CLASS}" id="1617919200"></li>
              <li class="${BOOKABLE_DAY_CLASS}" id="1618005600"></li>
              <li id="1617919200"></li>
              <li  id="1618005600"></li>
          </ul>
      </div>
    `);
    const htmlParser = new HtmlParser();

    const calendars = await htmlParser.parseCalendarsUrl([CALENDAR_URL]);

    expect(calendars.length).toEqual(1);
    expect(calendars[0]).toBeInstanceOf(Calendar);
    expect(calendars[0].getAddress()).toEqual(
      'Kornstraße 12, Bremen 28201, Bremen-Neustadt',
    );
    expect(calendars[0].getBookableDays()).toHaveLength(2);
  });
});
