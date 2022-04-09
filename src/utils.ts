export const URLs: string[] = [
  'https://www.fietje-lastenrad.de/cb-items/fietje4/#timeframe76',
  'https://www.fietje-lastenrad.de/cb-items/fietje5/#timeframe75',
  'https://www.fietje-lastenrad.de/cb-items/fietje-1/#timeframe78',
];

export function hashCode(string: string): number {
  let hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
