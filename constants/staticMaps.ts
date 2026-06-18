export const MAP_BY_KEY = {
  '1635': require('@/assets/maps_svg/1635-Realsize.svg'),
  '1699': require('@/assets/maps_svg/1699,1701,1713.svg'),
  '1721': require('@/assets/maps_svg/1721.svg'),
  '1772': require('@/assets/maps_svg/1772.svg'),
  '1793': require('@/assets/maps_svg/1793.svg'),
  '1795': require('@/assets/maps_svg/1795.svg'),
  '1807': require('@/assets/maps_svg/1807.svg'),
  '1815': require('@/assets/maps_svg/1815.svg'),
  '1831': require('@/assets/maps_svg/1831.svg'),
  '1846': require('@/assets/maps_svg/1846.svg'),
  '1848': require('@/assets/maps_svg/1848.svg'),
  '1867': require('@/assets/maps_svg/1867.svg'),
  '1871': require('@/assets/maps_svg/1871.svg'),
  '1878': require('@/assets/maps_svg/1878, 1884,1894,1904.svg'),
  '1917': require('@/assets/maps_svg/1917.svg'),
  '1918': require('@/assets/maps_svg/1918 - 5.svg'),
  '1919': require('@/assets/maps_svg/1919-1.svg'),
  '1920': require('@/assets/maps_svg/1920, 1923.svg'),
  '1922': require('@/assets/maps_svg/1922-2, 1924, 1935.svg'),
  '1938': require('@/assets/maps_svg/1938 -1.svg'),
  '1939': require('@/assets/maps_svg/1939-2.svg'),
  '1940': require('@/assets/maps_svg/1940.1942.svg'),
  '1944': require('@/assets/maps_svg/1944.svg'),
  '1945': require('@/assets/maps_svg/1945 - 5.svg'),
  '1948': require('@/assets/maps_svg/1948, 1951, 1960, 1970, 1975, 1980, 1987.svg'),
  '1989': require('@/assets/maps_svg/1989.svg'),
  '1993': require('@/assets/maps_svg/1993, 2002, 2011.svg'),
} as const;

export type MapKey = keyof typeof MAP_BY_KEY;

export const DEFAULT_MAP_KEY: MapKey = '1635';

export const MAP_KEY_BY_FLOOR_YEAR: Array<{ startYear: number; mapKey: MapKey }> = [
  { startYear: 1635, mapKey: '1635' },
  { startYear: 1686, mapKey: '1699' },
  { startYear: 1721, mapKey: '1721' },
  { startYear: 1772, mapKey: '1772' },
  { startYear: 1793, mapKey: '1793' },
  { startYear: 1795, mapKey: '1795' },
  { startYear: 1807, mapKey: '1807' },
  { startYear: 1815, mapKey: '1815' },
  { startYear: 1831, mapKey: '1831' },
  { startYear: 1846, mapKey: '1846' },
  { startYear: 1848, mapKey: '1848' },
  { startYear: 1867, mapKey: '1867' },
  { startYear: 1871, mapKey: '1871' },
  { startYear: 1878, mapKey: '1878' },
  { startYear: 1917, mapKey: '1917' },
  { startYear: 1918, mapKey: '1918' },
  { startYear: 1919, mapKey: '1919' },
  { startYear: 1920, mapKey: '1920' },
  { startYear: 1922, mapKey: '1922' },
  { startYear: 1938, mapKey: '1938' },
  { startYear: 1939, mapKey: '1939' },
  { startYear: 1940, mapKey: '1940' },
  { startYear: 1944, mapKey: '1944' },
  { startYear: 1945, mapKey: '1945' },
  { startYear: 1948, mapKey: '1948' },
  { startYear: 1989, mapKey: '1989' },
  { startYear: 1993, mapKey: '1993' },
];

export function getMapKeyForYear(year: number): MapKey {
  for (let index = MAP_KEY_BY_FLOOR_YEAR.length - 1; index >= 0; index -= 1) {
    if (year >= MAP_KEY_BY_FLOOR_YEAR[index].startYear) {
      return MAP_KEY_BY_FLOOR_YEAR[index].mapKey;
    }
  }

  return DEFAULT_MAP_KEY;
}
