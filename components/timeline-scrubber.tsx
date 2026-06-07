import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { QuizResultColors } from '@/constants/theme';

export type TimelineItem = {
  id: string;
  year: number;
  label: string;
  color?: string;
  isRelevant?:boolean;
};

type TimelineScrubberProps = {
  items: TimelineItem[];
  initialIndex?: number;
  activeGuide?: string;
  maxGapYears?: number;
  pixelsPerYear?: number;
  minGapPixels?: number;
  windowSpanYears?: number;
  onSelect?: (item: TimelineItem, index: number) => void;
};

const TRACK_HORIZONTAL_PADDING = 96;
const DOT_SIZE = 20;
const YEAR_LABEL_WIDTH = 68;
const DEFAULT_ERA_COLOR = '#5f8e3b';
const PILL_WIDTH = 76;
const BAR_TOP = 68;
const BAR_HEIGHT = 20;
const GESTURE_ACTIVE_TOP = BAR_TOP + 2;
const GESTURE_ACTIVE_BOTTOM = BAR_TOP + DOT_SIZE + 4;

const GUIDE_STYLES: Record<string, { accent: string; screenTint: string }> = {
  Culture: {
    accent: QuizResultColors.educatorGold,
    screenTint: 'rgba(155, 88, 2, 0.05)',
  },
  Hero: {
    accent: QuizResultColors.writerBlue,
    screenTint: QuizResultColors.writerBlue + '0A',
  },
  Adventurer: {
    accent: QuizResultColors.explorerRed,
    screenTint: QuizResultColors.explorerRed + '0A',
  },
  Crafter: {
    accent: QuizResultColors.crafterGreen,
    screenTint: QuizResultColors.crafterGreen + '0A',
  },
};

function buildPositions(
  items: TimelineItem[],
  pixelsPerYear: number,
  maxGapYears: number,
  minGapPixels: number
) {
  if (items.length === 0) {
    return [];
  }

  const positions: number[] = [0];
  for (let index = 1; index < items.length; index += 1) {
    const yearGap = items[index].year - items[index - 1].year;
    const effectiveGap = Math.min(Math.max(yearGap, 0), maxGapYears);
    const proportionalGap = effectiveGap * pixelsPerYear;
    const visualGap = yearGap > 0 ? minGapPixels + proportionalGap : 0;
    positions.push(positions[index - 1] + visualGap);
  }

  return positions;
}

;
export function TimelineScrubber({
  items,
  initialIndex = 0,
  activeGuide,
  maxGapYears = 40,
  pixelsPerYear = 4.4,
  minGapPixels = 18,
  windowSpanYears = 75,
  onSelect,
}: TimelineScrubberProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(Math.min(initialIndex, Math.max(items.length - 1, 0)));
  const [windowStartYear, setWindowStartYear] = useState(items[0]?.year ?? 0);
  const canHandlePanRef = useRef(false);
  const guideStyle = activeGuide ? GUIDE_STYLES[activeGuide] : null;

  const positions = useMemo(
    () => buildPositions(items, pixelsPerYear, maxGapYears, minGapPixels),
    [items, maxGapYears, minGapPixels, pixelsPerYear]
  );

  const minYear = items[0]?.year ?? 0;
  const maxYear = items[items.length - 1]?.year ?? 0;
  const maxWindowStartYear = Math.max(maxYear - windowSpanYears, minYear);
  const visibleStartYear = windowStartYear;
  const visibleEndYear = windowStartYear + windowSpanYears;

  const visibleIndices = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const indices: number[] = [];
    for (let index = 0; index < items.length; index += 1) {
      const year = items[index].year;
      if (year < visibleStartYear) {
        continue;
      }
      if (year > visibleEndYear) {
        break;
      }
      indices.push(index);
    }

    if (indices.length === 0) {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < items.length; index += 1) {
        const distance = Math.abs(items[index].year - visibleStartYear);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      indices.push(nearestIndex);
    }

    return indices;
  }, [items, visibleEndYear, visibleStartYear]);

  const visibleStartIndex = visibleIndices[0] ?? 0;
  const visibleEndIndex = visibleIndices[visibleIndices.length - 1] ?? 0;

  const markerXByIndex = useMemo(() => {
    const markerMap: Record<number, number> = {};

    if (visibleIndices.length === 0 || containerWidth === 0 || positions.length === 0) {
      return markerMap;
    }

    if (visibleIndices.length === 1) {
      markerMap[visibleIndices[0]] = containerWidth / 2;
      return markerMap;
    }

    const leftEdge = TRACK_HORIZONTAL_PADDING;
    const rightEdge = Math.max(containerWidth - TRACK_HORIZONTAL_PADDING, leftEdge + 1);
    const usableWidth = rightEdge - leftEdge;
    const startPosition = positions[visibleStartIndex] ?? 0;
    const endPosition = positions[visibleEndIndex] ?? startPosition;
    const span = Math.max(endPosition - startPosition, 1);

    visibleIndices.forEach((index) => {
      const normalized = (positions[index] - startPosition) / span;
      markerMap[index] = leftEdge + normalized * usableWidth;
    });

    return markerMap;
  }, [containerWidth, positions, visibleEndIndex, visibleIndices, visibleStartIndex]);

  const activeMarkerX = markerXByIndex[activeIndex] ?? containerWidth / 2;
  const scrubberCenterX = useSharedValue(activeMarkerX);

  const getNearestVisibleIndex = useCallback(
    (touchX: number) => {
      if (visibleIndices.length === 0) {
        return activeIndex;
      }

      let nearest = visibleIndices[0];
      let nearestDistance = Number.POSITIVE_INFINITY;

      visibleIndices.forEach((index) => {
        const markerX = markerXByIndex[index] ?? 0;
        const distance = Math.abs(markerX - touchX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      return nearest;
    },
    [activeIndex, markerXByIndex, visibleIndices]
  );

  const selectIndex = useCallback(
    (nextIndex: number) => {
      if (items.length === 0) {
        return;
      }

      const boundedIndex = Math.min(Math.max(nextIndex, 0), items.length - 1);
      setActiveIndex(boundedIndex);
      onSelect?.(items[boundedIndex], boundedIndex);
    },
    [items, onSelect]
  );

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const boundedInitial = Math.min(Math.max(initialIndex, 0), items.length - 1);
    const initialYear = items[boundedInitial].year;
    const initialWindowStartYear = Math.min(Math.max(initialYear, minYear), maxWindowStartYear);

    setActiveIndex(boundedInitial);
    setWindowStartYear(initialWindowStartYear);
  }, [initialIndex, items, maxWindowStartYear, minYear]);

  useEffect(() => {
    const activeYear = items[activeIndex]?.year;
    if (activeYear == null) {
      return;
    }

    if (activeYear < windowStartYear) {
      setWindowStartYear(Math.max(activeYear, minYear));
      return;
    }

    if (activeYear > visibleEndYear) {
      setWindowStartYear(Math.min(activeYear - windowSpanYears, maxWindowStartYear));
    }
  }, [activeIndex, items, maxWindowStartYear, minYear, visibleEndYear, windowSpanYears, windowStartYear]);

  useEffect(() => {
    if (containerWidth === 0) {
      return;
    }

    scrubberCenterX.value = withTiming(activeMarkerX, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeMarkerX, containerWidth, scrubberCenterX]);

  const activePillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: scrubberCenterX.value - PILL_WIDTH / 2 }],
    };
  });

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((event) => {
      const withinActiveBand =
        event.y >= GESTURE_ACTIVE_TOP && event.y <= GESTURE_ACTIVE_BOTTOM;

      canHandlePanRef.current = withinActiveBand;
      if (!withinActiveBand) {
        return;
      }

      const nextIndex = getNearestVisibleIndex(event.x);
      selectIndex(nextIndex);
    })
    .onUpdate((event) => {
      if (!canHandlePanRef.current) {
        return;
      }

      const nextIndex = getNearestVisibleIndex(event.x);
      if (nextIndex !== activeIndex) {
        selectIndex(nextIndex);
      }
    })
    .onEnd((event) => {
      if (!canHandlePanRef.current) {
        return;
      }

      const nextIndex = getNearestVisibleIndex(event.x);
      selectIndex(nextIndex);
    })
    .onFinalize(() => {
      canHandlePanRef.current = false;
    });

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const goToPrevious = () => {
    const nextWindowStart = Math.max(windowStartYear - windowSpanYears, minYear);
    setWindowStartYear(nextWindowStart);

    const nextWindowEnd = nextWindowStart + windowSpanYears;
    const firstVisibleInWindow = items.findIndex(
      (item) => item.year >= nextWindowStart && item.year <= nextWindowEnd
    );

    if (firstVisibleInWindow >= 0) {
      selectIndex(firstVisibleInWindow);
    }
  };

  const goToNext = () => {
    const nextWindowStart = Math.min(windowStartYear + windowSpanYears, maxWindowStartYear);
    setWindowStartYear(nextWindowStart);

    const nextWindowEnd = nextWindowStart + windowSpanYears;
    const firstVisibleInWindow = items.findIndex(
      (item) => item.year >= nextWindowStart && item.year <= nextWindowEnd
    );

    if (firstVisibleInWindow >= 0) {
      selectIndex(firstVisibleInWindow);
    }
  };

  const isPreviousDisabled = windowStartYear <= minYear;
  const isNextDisabled = windowStartYear >= maxWindowStartYear;


  return (
    <View style={styles.root} onLayout={onContainerLayout}>
      <Pressable
        onPress={goToPrevious}
        disabled={isPreviousDisabled}
        hitSlop={10}
        style={[styles.arrowButton, styles.leftArrow, isPreviousDisabled && styles.disabledArrow]}>
        <Text style={styles.arrowText}>◀</Text>
      </Pressable>

      <Pressable
        onPress={goToNext}
        disabled={isNextDisabled}
        hitSlop={10}
        style={[styles.arrowButton, styles.rightArrow, isNextDisabled && styles.disabledArrow]}>
        <Text style={styles.arrowText}>▶</Text>
      </Pressable>

      <GestureDetector gesture={panGesture}>
        <View style={styles.gestureArea}>
          <View style={styles.track}>
            {visibleIndices.slice(1).map((currentIndex, visibleOffset) => {
              const previousIndex = visibleIndices[visibleOffset] ?? currentIndex;
              const segmentLeft = markerXByIndex[previousIndex] ?? TRACK_HORIZONTAL_PADDING;
              const segmentRight = markerXByIndex[currentIndex] ?? segmentLeft;
              const segmentWidth = Math.max(segmentRight - segmentLeft, 2);
              const currentItem = items[currentIndex];
              const previousItem = items[previousIndex];

              const isSegmentRelevant =
                currentItem?.isRelevant !== false ||
                previousItem?.isRelevant !== false;
              const segmentColor =
                items[currentIndex]?.color ?? items[previousIndex]?.color ?? DEFAULT_ERA_COLOR;
              const isSegmentDimmed =
                items[currentIndex]?.isRelevant === false &&
                items[previousIndex]?.isRelevant === false;
                


              return (
                <View
                  key={`${items[currentIndex]?.id ?? currentIndex}-segment`}
                  style={[
                    styles.trackSegment,
                    {
                      left: segmentLeft,
                      width: segmentWidth,
                      backgroundColor: segmentColor,
                      opacity: isSegmentRelevant ? 1 : 0.8,
                    },
                  ]}
                />
              );
            })}

            {visibleIndices.length === 1 ? (
              <View
                style={[
                  styles.trackSegment,
                  {
                    left: markerXByIndex[visibleIndices[0]] ?? TRACK_HORIZONTAL_PADDING,
                    width: 36,
                    backgroundColor: items[visibleIndices[0]]?.color ?? DEFAULT_ERA_COLOR,
                  },
                ]}
              />
            ) : null}

            {visibleIndices.map((index) => {
              const item = items[index];
              const markerLeft = markerXByIndex[index] ?? TRACK_HORIZONTAL_PADDING;
              const isActive = index === activeIndex;
              const showYearLabel = !isActive;
              const isDimmed = item.isRelevant === false;
              const isRelevant = item.isRelevant !== false;

              return (
                <View
                  key={`${item.id}-marker`}
                  style={[styles.marker, { left: markerLeft }]}
                >
                  {isRelevant ? (
                    <>
                       <View style={styles.relevantHalo} />
                       <View
                        style={[
                          styles.relevantMarkerAccent,
                          { backgroundColor: guideStyle?.accent ?? item.color },
                        ]}
                      />
                     </>
                  ) : null}
                <View
                  style={[
                    styles.dot,
                    isActive ? styles.activeDot : styles.inactiveDot,
                    {
                      opacity: item.isRelevant === false ? 1 : 1,
                      transform: [{ scale: isRelevant ? 1.12 : 1 }],
                      borderColor: isRelevant ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      borderWidth: isRelevant ? 2.5 : 1,
                      backgroundColor: isRelevant ? (item.color ?? '#ffffff') : '#D7D7D7',
                      shadowColor: item.color ?? '#000',
                      shadowOpacity: isRelevant ? 0.25 : 0,
                      shadowRadius: isRelevant ? 6 : 0,
                      shadowOffset: { width: 0, height: 0 },

                    },
                  ]}
                />
                  {showYearLabel ? (
                    <Text
                    style={[
                      styles.yearLabel,
                      isActive && styles.activeYearLabel,
                      {
                        opacity: isRelevant ? 1 : 0.65,
                        fontWeight: isRelevant ? '700' : '500',
                      },
                    ]}
                    >
                      {item.year}
                    </Text>) : null}
                </View>
              );
            })}
          </View>
        </View>
      </GestureDetector>

      <Animated.View style={[styles.activePill, activePillStyle]} pointerEvents="none">
  <View
    style={[
      styles.activePillBackground,
      { backgroundColor: items[activeIndex]?.color ?? DEFAULT_ERA_COLOR },
    ]}>
    <Text style={styles.activePillText}>{items[activeIndex]?.year}</Text>
  </View>
</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 112,
    justifyContent: 'flex-end',
  },
  gestureArea: {
    height: 122, // increased by another 10px to match BAR_TOP move
    overflow: 'hidden',
  },
  track: {
    height: 122, // increased by another 10px to match BAR_TOP move
  },
  trackSegment: {
    position: 'absolute',
    top: BAR_TOP,
    height: BAR_HEIGHT,
    borderRadius: 7,
  },
  marker: {
    position: 'absolute',
    top: BAR_TOP,
    width: 1,
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  activeDot: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  inactiveDot: {
    opacity: 0.95,
  },
  yearLabel: {
    marginTop: 12,
    width: YEAR_LABEL_WIDTH,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#515558',
  },
  activeYearLabel: {
    fontWeight: '700',
  },
  activePill: {
    position: 'absolute',
    top: 50,
    left: 0,
  },
  activePillBackground: {
    width: PILL_WIDTH,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  activePillText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
  },
  arrowButton: {
    position: 'absolute',
    top: 39,
    width: 52,
    height: 52,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  leftArrow: {
    left: 8,
  },
  rightArrow: {
    right: 8,
  },
  arrowText: {
    color: '#42484a',
    fontSize: 32,
    fontWeight: '700',
  },
  disabledArrow: {
    opacity: 0.25,
  },
  relevantHalo: {
    position: 'absolute',
    top: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  relevantMarkerAccent: {
    position: 'absolute',
    top: -24,
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
