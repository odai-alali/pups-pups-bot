import DayToFilter from './filter/DayToFilter';
import DayCalendarsFilter from './filter/DayCalendarsFilter';
import ICalendarsFilter from './filter/ICalendarsFilter';

class TextNormalizer {
  toLowerCase(text: string): string {
    return text.toLowerCase().trim();
  }

  cleanEmojis(text: string): string {
    return text.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
  }

  normalize(text: string): string {
    return this.toLowerCase(this.cleanEmojis(text));
  }

  extractDaysToFilter(text: string): DayToFilter[] {
    const normalizedText = this.normalize(text);
    const daysToFilter = [];
    if (normalizedText.includes('monday')) {
      daysToFilter.push(DayToFilter.MONDAY);
    }
    if (normalizedText.includes('tuesday')) {
      daysToFilter.push(DayToFilter.TUESDAY);
    }
    if (normalizedText.includes('wednesday')) {
      daysToFilter.push(DayToFilter.WEDNESDAY);
    }
    if (normalizedText.includes('thursday')) {
      daysToFilter.push(DayToFilter.THURSDAY);
    }
    if (normalizedText.includes('friday')) {
      daysToFilter.push(DayToFilter.FRIDAY);
    }
    if (normalizedText.includes('saturday')) {
      daysToFilter.push(DayToFilter.SATURDAY);
    }
    return daysToFilter;
  }

  extractFiltersFromText(text: string): ICalendarsFilter[] {
    const daysToFilter = this.extractDaysToFilter(text);

    return daysToFilter.map(
      (dayToFilter) => new DayCalendarsFilter(dayToFilter),
    );
  }
}

export default TextNormalizer;
