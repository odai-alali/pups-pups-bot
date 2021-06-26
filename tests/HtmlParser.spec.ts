import HtmlParser from '../src/HtmlParser';

describe('HtmlParser', () => {
  it('should parse calendar divs', () => {
    const htmlParser = new HtmlParser();

    const calendars = htmlParser.selectCalendars(
      '<div>0</div><div class="cb-timeframe">1</div><div class="cb-timeframe">2</div><div>0</div>',
    );

    expect(calendars.length).toEqual(2);
  });
});
