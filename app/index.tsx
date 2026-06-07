import TimelineScreen from '@/components/screens/timeline-screen';
import ContentScreen from '@/screens/ContentScreen';
import {
  EraKey,
  EARLIEST_TIMELINE_YEAR_BY_ERA,
} from '@/constants/contentData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type HomeView = 'timeline' | 'content';

const FADE_DURATION = 200;

const ERA_KEYS: EraKey[] = [
  'all',
  'golden_age',
  'wars_partitions',
  'independence',
  'rebirth',
  'ww2',
  'communist',
  'modern',
];

function paramFirst(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default function IndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    openTimelineAtYear?: string | string[];
    openContentEra?: string | string[];
    guide?: string | string[];
  }>();

  const [view, setView] = useState<HomeView>('timeline');
  const [contentEra, setContentEra] = useState<EraKey>('all');
  const [timelineYear, setTimelineYear] = useState<number | undefined>(1635);

  const timelineOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const currentTimelineYearRef = useRef<number | undefined>(1635);
  const contentEntryYearRef = useRef<number | undefined>(1635);
  const contentEntryEraRef = useRef<EraKey>('all');

  const isEraKey = (value: string): value is EraKey =>
    ERA_KEYS.includes(value as EraKey);

  const switchView = useCallback(
    (newView: HomeView, era?: EraKey) => {
      if (newView === 'content' && era !== undefined) {
        setContentEra(era);
        contentEntryEraRef.current = era;
        contentEntryYearRef.current = currentTimelineYearRef.current;
      }

      const [fadeIn, fadeOut] =
        newView === 'content'
          ? [contentOpacity, timelineOpacity]
          : [timelineOpacity, contentOpacity];

      setView(newView);

      Animated.parallel([
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [timelineOpacity, contentOpacity]
  );

  useEffect(() => {
    const y = paramFirst(params.openTimelineAtYear);
    if (!y) return;

    const num = Number(y);
    if (Number.isNaN(num)) return;

    setTimelineYear(num);
    currentTimelineYearRef.current = num;

    switchView('timeline');
    queueMicrotask(() => router.setParams({ openTimelineAtYear: undefined }));
  }, [params.openTimelineAtYear, router, switchView]);

  useEffect(() => {
    const era = paramFirst(params.openContentEra);
    if (!era || !isEraKey(era)) return;

    switchView('content', era);
    queueMicrotask(() => router.setParams({ openContentEra: undefined }));
  }, [params.openContentEra, router, switchView]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: timelineOpacity }]}
        pointerEvents={view === 'timeline' ? 'auto' : 'none'}
      >
        <TimelineScreen
          initialYear={timelineYear}
          activeGuide={params.guide as string}
          onTimelineYearChange={(y) => {
            currentTimelineYearRef.current = y;
          }}
          onPressContent={(era) => switchView('content', era)}
        />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: contentOpacity }]}
        pointerEvents={view === 'content' ? 'auto' : 'none'}
      >
        <ContentScreen
          initialEra={contentEra}
          onPressTimeline={(currentEra) => {
            if (currentEra === contentEntryEraRef.current) {
              if (contentEntryYearRef.current !== undefined) {
                setTimelineYear(contentEntryYearRef.current);
                currentTimelineYearRef.current = contentEntryYearRef.current;
              }
            } else {
              const fallbackYear =
                EARLIEST_TIMELINE_YEAR_BY_ERA[currentEra] ??
                contentEntryYearRef.current ??
                1635;

              setTimelineYear(fallbackYear);
              currentTimelineYearRef.current = fallbackYear;
            }

            switchView('timeline');
          }}
        />
      </Animated.View>
    </View>
  );
}