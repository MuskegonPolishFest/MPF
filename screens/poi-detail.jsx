import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MainColors, Typography } from '@/constants/theme';
import { useVisited } from '@/components/VisitedContext';
import { POI_DETAILS, EARLIEST_TIMELINE_YEAR_BY_ERA } from '../constants/contentData';

function BackIcon({ size = 28, color = '#1C1B1F' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M27.0837 36.6666L10.417 19.9999L27.0837 3.33325L29.6253 5.90283L15.5282 19.9999L29.6253 34.097L27.0837 36.6666Z"
        fill={color}
      />
    </Svg>
  );
}

function CloseIcon({ size = 28, color = '#1C1B1F' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6L18 18M18 6L6 18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const DEFAULT_MAIN_ID = 'c1';


function paramFirst(value) {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return String(value);
}

function buildReturnParams(params) {
  const out = {};
  const root = paramFirst(params.returnRoot);
  const era = paramFirst(params.returnEra);
  const year = paramFirst(params.returnYear);
  if (root) out.returnRoot = root;
  if (era) out.returnEra = era;
  if (year != null && year !== '') out.returnYear = String(year);
  return out;
}

export default function POIDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentId = paramFirst(params.id) || DEFAULT_MAIN_ID;
  const returnParams = buildReturnParams(params);

  const mainPoi = POI_DETAILS[currentId] || POI_DETAILS[DEFAULT_MAIN_ID];
  const { visitedIds, markVisited } = useVisited();

  // Record "whether the user has visited this POI before entering this POI detail page"
  // First time entering: visitedIds does not include this id, so it is false; leaving and coming back: it is true
  const hasVisitedBeforeRef = React.useRef(visitedIds.includes(mainPoi.id));

  // Mark current POI as visited when this screen mounts or id changes
  React.useEffect(() => {
    markVisited(mainPoi.id);
  }, [mainPoi.id, markVisited]);

  const handleBack = () => {
    if (returnParams.returnRoot === 'content' && returnParams.returnEra) {
      router.dismissTo({
        pathname: '/',
        params: {
          openContentEra: returnParams.returnEra,
        },
      });
      return;
    }
    if (returnParams.returnRoot === 'timeline' && returnParams.returnYear) {
      router.dismissTo({
        pathname: '/',
        params: {
          openTimelineAtYear: returnParams.returnYear,
        },
      });
      return;
    }
    router.back();
  };

  /** Close (×): leave detail and open the timeline map for this POI’s primary era. */
  const handleClose = () => {
    const primaryEra = mainPoi.eraKeys?.[0];
    const year = primaryEra
      ? EARLIEST_TIMELINE_YEAR_BY_ERA[primaryEra]
      : EARLIEST_TIMELINE_YEAR_BY_ERA.all;
    router.replace({
      pathname: '/',
      params: {
        openTimelineAtYear: String(year),
      },
    });
  };

  const relatedPois =
    (mainPoi.relatedIds || [])
      .map((id) => {
        const poi = POI_DETAILS[id];
        if (!poi) return null;
        return {
          id: poi.id,
          title: poi.titleTop,
          value: poi.yearLabel,
          description: poi.summary || poi.description,
          image: poi.mainImage,
        };
      })
      .filter(Boolean) || [];

  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const contentFlex = isWide ? { flex: 0.65 } : null;
  const relatedFlex = isWide ? { flex: 0.35 } : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Close"
        >
          <CloseIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, isWide && styles.row]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContent, contentFlex]}>
          {/* Embedded video: use key={mediaResetKey} from useVisited() so GuideScreen reset restarts playback. */}
          <View style={styles.imagePlaceholder}>
            {mainPoi.mainImage ? (
              <Image source={mainPoi.mainImage} style={styles.mainImage} contentFit="cover" />
            ) : null}
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.poiTitle}>{mainPoi.titleTop}</Text>
            <View style={styles.rightTitleArea}>
              {hasVisitedBeforeRef.current && (
                <View style={styles.visitedBadge}>
                  <Text style={styles.visitedBadgeText}>Visited</Text>
                </View>
              )}
              <Text style={styles.poiValue}>{mainPoi.yearLabel}</Text>
            </View>
          </View>
          <Text style={styles.description}>{mainPoi.description}</Text>
        </View>

        <View style={[styles.relatedSection, relatedFlex]}>
          <Text style={styles.relatedTitle}>Related Content</Text>
          {relatedPois.map((item) => {
            const isVisited = visitedIds.includes(item.id);
            return (
            <TouchableOpacity
              key={item.id}
              style={styles.relatedCard}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: '/poi-detail',
                  params: { id: item.id, ...returnParams },
                })
              }
            >
              <View style={styles.relatedImagePlaceholder}>
                {item.image ? (
                  <Image source={item.image} style={styles.relatedImage} contentFit="cover" />
                ) : null}
              </View>
              <View style={styles.relatedCardContent}>
                <View style={styles.relatedTitleRow}>
                  <Text style={styles.relatedCardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.relatedRightArea}>
                    {isVisited && (
                      <View style={styles.visitedBadgeSmall}>
                        <Text style={styles.visitedBadgeSmallText}>Visited</Text>
                      </View>
                    )}
                    <Text style={styles.relatedCardValue}>{item.value}</Text>
                  </View>
                </View>
                <Text style={styles.relatedCardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )})}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainColors.backgroundGrey,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerSpacer: {
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  mainContent: {
    marginBottom: 24,
    // marginRight: 20,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: MainColors.secondaryGrey,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  rightTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  poiTitle: {
    ...Typography.h4,
    color: MainColors.primaryBlack,
    flex: 1,
  },
  poiValue: {
    ...Typography.h4,
    color: MainColors.primaryBlack,
  },
  visitedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: MainColors.pointRed,
  },
  visitedBadgeText: {
    ...Typography.small,
    color: '#FFFFFF',
  },
  description: {
    ...Typography.body,
    color: MainColors.primaryBlack,
  },
  relatedSection: {
    minWidth: 280,
    marginLeft: 20,
  },
  relatedTitle: {
    ...Typography.h4,
    color: MainColors.primaryBlack,
    marginBottom: 16,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 150,
  },
  relatedImagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: MainColors.secondaryGrey,
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  relatedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  relatedCardTitle: {
    ...Typography.h6,
    color: MainColors.primaryBlack,
    flex: 1,
  },
  relatedRightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  relatedCardValue: {
    ...Typography.small,
    color: MainColors.primaryBlack,
  },
  relatedCardDesc: {
    ...Typography.small,
    color: MainColors.textGrey,
  },
  visitedBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: MainColors.pointRed,
  },
  visitedBadgeSmallText: {
    ...Typography.small,
    color: '#FFFFFF',
  },
});
