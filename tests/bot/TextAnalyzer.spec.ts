import TextAnalyzer from '../../src/bot/TextAnalyzer';
import DayCalendarsFilter from '../../src/bot/filter/DayCalendarsFilter';
import DayToFilter from '../../src/bot/filter/DayToFilter';

describe('TextAnalyzer', () => {
  it('should convert all text to lower case and trim it', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.toLowerCase(' TEXT ');

    expect(actual).toEqual('text');
  });

  it('should omit emojis', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.cleanEmojis('textπ');

    expect(actual).toEqual('text');
  });

  it('should normalize text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.normalize(
      ' This is a non normalized Text π ',
    );

    expect(actual).toEqual('this is a non normalized text');
  });

  it('should extract DayToFilter.MONDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' monday π ');

    expect(actual).toEqual([DayToFilter.MONDAY]);
  });

  it('should extract DayToFilter.TUESDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' Tuesday π ');

    expect(actual).toEqual([DayToFilter.TUESDAY]);
  });

  it('should extract DayToFilter.WEDNESDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' Wednesday π ');

    expect(actual).toEqual([DayToFilter.WEDNESDAY]);
  });

  it('should extract DayToFilter.THURSDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' Thursday π ');

    expect(actual).toEqual([DayToFilter.THURSDAY]);
  });

  it('should extract DayToFilter.FRIDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' FRIDAY π ');

    expect(actual).toEqual([DayToFilter.FRIDAY]);
  });

  it('should extract DayToFilter.SATURDAY from normalized text', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractDaysToFilter(' Saturday π ');

    expect(actual).toEqual([DayToFilter.SATURDAY]);
  });

  it('should return a DayCalendarFilter for extracted DayToFilter', () => {
    const textNormalizer = new TextAnalyzer();

    const actual = textNormalizer.extractFiltersFromText(' Saturday π ');

    expect(actual).toEqual([new DayCalendarsFilter(DayToFilter.SATURDAY)]);
  });
});
