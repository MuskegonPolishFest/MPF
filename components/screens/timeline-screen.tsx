import { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimelineItem, TimelineScrubber } from '@/components/timeline-scrubber';
import MapHotspot from '@/components/MapHotspot';
import { EndJourneyFullScreen } from '@/components/EndJourneyFullScreen';
import { useVisited } from '@/components/VisitedContext';
import { QuizResultColors, FontFamily, MainColors } from '@/constants/theme';
import { EraKey } from '@/constants/contentData';
import GuideCard from '../GuideCard';
import LegendCard from '../LegendCard';
import GuideLegendModal from '../GuideLegendModal';
import GuideIntroModal from '../GuideIntroModal';
import { MAP_BY_KEY, DEFAULT_MAP_KEY } from '@/constants/staticMaps';
import { refreshExperienceContent, useExperienceContent } from '@/hooks/useExperienceContent';
import PoiButton from '../PoiButton';

const HOME_ICON = require('@/assets/General_Icons/ Home_icon.svg');

/* Legacy hardcoded era timeline data moved to useExperienceContent().
type EraDefinition = {
  eraKey: EraKey;
  name: string;
  summary: string;
  timeframe: string;
  years: number[];
  color: string;
  borderExplanation?: string;
};

type TimelineScreenProps = {
  onPressContent?: (era: EraKey) => void;
  onTimelineYearChange?: (year: number) => void;
  initialYear?: number;
  activeGuide?: string;
};

const ERA_DEFINITIONS: EraDefinition[] = [
  {
    eraKey: 'golden_age',
    name: EraTabTheme.golden_age.label,
    summary: 'A time of political strength, cultural flourishing, and territorial expansion.',
    timeframe: 'Late 15th — Mid-17th Century',
    years: [1635, 1653],
    color: EraColors.golden_age,
  },
  {
    eraKey: 'wars_partitions',
    name: 'The Silver Age & Era of Wars',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th — 19th Century',
    years: [1686, 1699, 1701, 1713, 1721, 1742],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: First Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th — 19th Century',
    years: [1772, 1792],
    color: EraColors.wars_partitions,
  },
    {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Second Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th — 19th Century',
    years: [1793],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'wars_partitions',
    name: 'Silver Age & Era of Wars: Third Partition',
    summary: 'Marked by wars, weakening government, and foreign interference.',
    timeframe: 'Late 17th — 19th Century',
    years: [1795],
    color: EraColors.wars_partitions,
  },
  {
    eraKey: 'independence',
    name: EraTabTheme.independence.label,
    summary: 'A century of failed uprisings and growing nationalism.',
    timeframe: '19th Century — WW1',
    years: [1804, 1807, 1815, 1831, 1846, 1848, 1862, 1867, 1871, 1878, 1884, 1894, 1904],
    color: EraColors.independence,
  },
  {
    eraKey: 'rebirth',
    name: EraTabTheme.rebirth.label,
    summary: 'Poland regained its independence and rebuilt itself as a sovereign state.',
    timeframe: '1914 — 1939',
    years: [1914, 1917, 1918, 1919, 1920, 1921, 1924, 1933, 1938],
    color: EraColors.rebirth,
  },
  {
    eraKey: 'ww2',
    name: EraTabTheme.ww2.label,
    summary: 'Poland was invaded and divided between Nazi Germany and the Soviet Union.',
    timeframe: '1939 — 1945',
    years: [1939, 1940, 1942, 1944],
    color: EraColors.ww2,
  },
  {
    eraKey: 'liberation',
    name: 'Liberation & Reorganization',
    summary: 'N/A',
    timeframe: '1945 — 1948',
    years: [1945],
    color: EraColors.liberation,
  },
  {
    eraKey: 'communist',
    name: EraTabTheme.communist.label,
    summary: 'Communist Poland under Soviet influence.',
    timeframe: '1948 — 1980',
    years: [1948, 1951, 1960, 1970],
    color: EraColors.communist,
  },
    {
    eraKey: 'growingDiscontent',
    name: 'Growing Discontent',
    summary: 'N/A',
    timeframe: '1980 — 1989',
    years: [1980, 1985],
    color: EraColors.growingDiscontent,
  },
  {
    eraKey: 'modern',
    name: EraTabTheme.modern.label,
    summary: 'Where we are today: a democratic republic and member of the EU and NATO.',
    timeframe: '1989 — Present',
    years: [1989, 1993, 2002, 2009],
    color: EraColors.modern,
  },
];

type TimelineEraItem = TimelineItem & { eraKey: EraKey };

const ERA_ITEMS: TimelineEraItem[] = ERA_DEFINITIONS.flatMap((era) =>
  era.years.map((year) => ({
    id: `${era.name}-${year}`,
    year,
    label: era.name,
    color: era.color,
    eraKey: era.eraKey,
  }))
);
*/

type TimelineScreenProps = {
  onPressContent?: (era: EraKey) => void;
  onTimelineYearChange?: (year: number) => void;
  initialYear?: number;
  activeGuide?: string;
};

type TimelineEraItem = TimelineItem & { eraKey: EraKey };

const LEFT_BACKGROUND_VECTOR = require('@/assets/maps_svg/background-vector.svg');

const CULTURE_ICON = require('@/assets/POI_Icon/POI_Culture.svg');
// const HOTSPOT_IMAGE = require('@/assets/content_images/CommunistPoland/CommunistPoland_1.png');
const HOTSPOT_ICONS = {
  culture: require('@/assets/POI_Icon/POI_Culture.svg'),
  biography: require('@/assets/POI_Icon/POI_Biography.svg'),
  history: require('@/assets/POI_Icon/POI_History.svg'),
  science: require('@/assets/POI_Icon/POI_Science.svg'),
};

const LEGEND_ITEMS = [
  {
    key: 'culture',
    label: 'Culture',
    description: 'Highlights cultural traditions, art, and identity.',
    iconSource: HOTSPOT_ICONS.culture,
  },
  {
    key: 'biography',
    label: 'Biography',
    description: 'Introduces important people connected to this era.',
    iconSource: HOTSPOT_ICONS.biography,
  },
  {
    key: 'history',
    label: 'History',
    description: 'Explains major historical moments and turning points.',
    iconSource: HOTSPOT_ICONS.history,
  },
  {
    key: 'science',
    label: 'Science',
    description: 'Shows discoveries, inventions, and scientific impact.',
    iconSource: HOTSPOT_ICONS.science,
  },
];

const GUIDE_LENS: Record<string, number[]> = {
  Culture: [1635, 1653],
  Hero: [1772, 1793, 1795],
  Adventurer: [1939, 1944, 1945],
  Crafter: [1914, 1918, 1920],
};

const GUIDE_STYLES: Record<
  string,
  {
    label: string;
    color: string;
    screenTint: string;
    tint: string;
    description?: string;
    focusesOn?: string[];
  }
> = {
  Culture: {
    label: 'The Culture Buff',
    color: QuizResultColors.educatorGold,
    screenTint: 'rgba(155, 88, 2, 0.05)',
    tint: 'rgba(155, 88, 2, 0.01)',
    description:
    'A guide for exploring key moments through context, teaching, and historical meaning.',
  focusesOn: [
    'historical context',
    'important turning points',
    'educational takeaways',]
  },
  Hero: {
    label: 'The Unsung Hero',
    color: QuizResultColors.writerBlue,
    screenTint: QuizResultColors.writerBlue + '0A',
    tint: 'rgba(155, 88, 2, 0.08)',
    description:
    'A guide for exploring key moments through context, teaching, and historical meaning.',
  focusesOn: [
    'Cultural Resistance',
    'Everyday Heroes',
    'Hope for Independence'
  ]
  },
  Adventurer: {
    label: 'Adventurer',
    color: QuizResultColors.explorerRed,
    screenTint: QuizResultColors.explorerRed + '0A',
    tint: 'rgba(155, 88, 2, 0.08)',
    description:
    'A guide for exploring key moments through context, teaching, and historical meaning.',
  focusesOn: [
    'Stories of Survival',
    'Resistance Movements',
    'Personal Sacrifices'

  ]
  },
  Crafter: {
    label: 'Crafter',
    color: QuizResultColors.crafterGreen,
    screenTint: QuizResultColors.crafterGreen + '0A',
    tint: 'rgba(155, 88, 2, 0.08)',
    description:
    'A guide for exploring key moments through context, teaching, and historical meaning.',
    focusesOn: [
    'Polish-Soviet War',
    'Resurgence of National Pride',
    'Cultural Renaissance'

  ]
  },
};

/* Legacy fallback border text moved to Sanity CMS.
const BORDER_CHANGE_BY_YEAR: Record<number, string> = {
  1635: 'Sweden signed the Treaty of Stuhmsdorf, returning territories to the Polish–Lithuanian Commonwealth.',
  1653: 'Internal conflicts and wars begin, marking the decline of Poland’s strength.',
  1686: 'Eternal Peace Treaty confirmed Russias control over Left-bank Ukraine.',
  1699: 'Treaty of Karlowitz returned remaining Podolia to Poland.',
  1721: 'Poland loses more control as its neighbors gain power.',
  1742: 'Poland’s economy and military decline further.',
  1772: 'First Partition divided 30% of Poland among Russia, Prussia, and Austria.',
  1792: 'Poland fights Russia to protect its new constitution but loses.',
  1793: 'Second Partition saw more land lost to Russia and Prussia.',
  1795: 'Third Partition erased Poland from the map.',
  1804: 'Napoleon’s rise gives Poles hope for independence.',
  1807: 'Duchy of Warsaw created by Napoleon from former Polish lands.',
  1815: 'Congress of Vienna split Duchy of Warsaw between Prussia and Russia.',
  1831: 'Congress Poland lost autonomy after the November Uprising.',
  1846: 'Free City of Cracow annexed by Austria.',
  1848: 'Eternal Peace Treaty confirmed Russia\'s control over Left-bank Ukraine.',
  1862: 'Eternal Peace Treaty confirmed Russia\'s control over Left-bank Ukraine.',
  1867: 'Austria grants some autonomy to the Polish region of Galicia.',
  1871: 'Germany is united, increasing pressure on Polish culture.',
  1878: 'Polish nationalism and independence movements grow.',
  1914: 'WWI begins – Poland’s land is controlled by Germany, Russia, and Austro-Hungary.',
  1917: 'The Russian Revolution brings hope for Polish independence.',
  1918: 'Poland declared independence and began reclaiming territory.',
  1919: 'Treaty of Versailles recreated Poland with lands from Germany.',
  1920: 'Poland gained Danzig access and seized East Galicia from ZUNR.',
  1922: 'Central Lithuania joined Poland finalizing eastern borders.',
  1938: 'Poland annexed Trans-Olza and parts of Slovak Czechoslovakia.',
  1939: 'Germany and USSR partitioned Poland in WWII.',
  1940: 'Poland is divided between Nazi Germany and the Soviet Union.',
  1944: 'Warsaw Uprising – A major rebellion against German rule fails.',
  1945: 'Post-WWII borders shifted west; eastern lands annexed by USSR.',
  1948: 'Minor border adjustment near Przemyśl with USSR.',
  1991: 'Communism ends – Poland becomes a democracy.',
  1993: 'The last Soviet troops leave Poland.',
};
*/


function getIndexFromYear(items: TimelineEraItem[], year: number, fallbackIndex: number) {
  const foundIndex = items.findIndex((item) => item.year === year);
  return foundIndex >= 0 ? foundIndex : fallbackIndex;
}


export default function TimelineScreen({
  onPressContent,
  onTimelineYearChange,
  initialYear,
  activeGuide,
}: TimelineScreenProps) {
  const router = useRouter();
  const { resetExperience } = useVisited();
  const [endJourneyModalVisible, setEndJourneyModalVisible] = useState(false);

  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [hasShownGuideIntro, setHasShownGuideIntro] = useState(false);
  const [showGuideIntro, setShowGuideIntro] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const confirmEndJourney = useCallback(() => {
    resetExperience();
    setEndJourneyModalVisible(false);
    router.replace('/GuideScreen');
  }, [resetExperience, router]);

  const showRefreshMessage = useCallback((message: string) => {
    setRefreshMessage(message);
    ToastAndroid.show(message, ToastAndroid.SHORT);
    setTimeout(() => setRefreshMessage(null), 2200);
  }, []);

  const handleAdminRefresh = useCallback(async () => {
    showRefreshMessage('Refreshing content...');
    const result = await refreshExperienceContent();

    if (result.status === 'updated') {
      showRefreshMessage('Content updated');
      return;
    }

    if (result.status === 'cached') {
      showRefreshMessage('Using cached content');
      return;
    }

    showRefreshMessage('Wifi unavailable');
  }, [showRefreshMessage]);

  const content = useExperienceContent();
  const relevantYears = useMemo(() => (activeGuide ? GUIDE_LENS[activeGuide] ?? [] : []), [activeGuide]);
  const timelineItems: TimelineEraItem[] = useMemo(
    () =>
      content.timelineEvents.map((event) => ({
        id: event.id,
        year: event.year,
        label: event.title,
        color: event.color,
        eraKey: event.eraKey,
        isRelevant: relevantYears.includes(event.year),
      })),
    [content.timelineEvents, relevantYears]
  );
  const defaultIndex = useMemo(
    () => Math.max(timelineItems.findIndex((item) => item.year === 1635), 0),
    [timelineItems]
  );

  const initialIndex = useMemo(() => {
    if (initialYear != null && !Number.isNaN(initialYear)) {
      const foundIndex = timelineItems.findIndex((item) => item.year === initialYear);
      if (foundIndex >= 0) return foundIndex;
    }

    return defaultIndex;
  }, [defaultIndex, initialYear, timelineItems]);


    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const selectedEvent = content.timelineEvents[selectedIndex] ?? content.timelineEvents[0];
    const borderDescription = selectedEvent?.borderChangeText;
    const guideStyle = activeGuide ? GUIDE_STYLES[activeGuide] : undefined;
    useEffect(() => {
      setSelectedIndex(initialIndex);
    }, [initialIndex]);


    useEffect(() => {
      if (activeGuide && guideStyle && !hasShownGuideIntro) {
        setShowGuideIntro(true);
        setHasShownGuideIntro(true);
      }
    }, [activeGuide, guideStyle, hasShownGuideIntro]);


    const selectedItem = timelineItems[selectedIndex];
    const isCurrentYearRelevant = selectedItem?.isRelevant !== false;


  const selectedEra = useMemo(
    () => timelineItems[selectedIndex] ?? timelineItems[0],
    [selectedIndex, timelineItems]
  );

  useEffect(() => {
    if (selectedEra?.year != null) onTimelineYearChange?.(selectedEra.year);
  }, [selectedEra?.year, onTimelineYearChange]);
  const selectedEraMap = useMemo(
    () =>
      selectedEvent?.mapImageUri
        ? { uri: selectedEvent.mapImageUri }
        : MAP_BY_KEY[selectedEvent?.mapKey ?? DEFAULT_MAP_KEY],
    [selectedEvent?.mapImageUri, selectedEvent?.mapKey]
  );

  const targetEraKey = selectedEvent?.eraKey ?? selectedEra?.eraKey ?? 'golden_age';
  
  const visibleHotspots = selectedEvent?.hotspots ?? [];

  const [openPoiId, setOpenPoiId] = useState<string | null>(null);
  
  useEffect(() => {
    setOpenPoiId(null);
  }, [selectedEra?.year]);

  return (
    <View style={styles.screen}>
      <EndJourneyFullScreen
        visible={endJourneyModalVisible}
        onContinue={confirmEndJourney}
        onRequestClose={() => setEndJourneyModalVisible(false)}
      />

      {guideStyle ? (
        <GuideIntroModal
          visible={showGuideIntro}
          guideLabel={guideStyle.label}
          guideColor={guideStyle.color}
          guideDescription={guideStyle.description}
          legendItems={LEGEND_ITEMS}
          onStartExploring={() => setShowGuideIntro(false)}
        />
      ) : null}

      <GuideLegendModal
        visible={guideModalVisible}
        title={guideStyle ? guideStyle.label : 'Legend'}
        subtitle={guideStyle ? 'Your journey begins' : 'Map legend'}
        accentColor={guideStyle?.color ?? '#2F3437'}
        description={
          guideStyle?.description ??
          'Explore the map and use these icons to discover stories throughout each era.'
        }
        legendItems={LEGEND_ITEMS}
        buttonLabel={guideStyle ? 'Start Exploring' : 'Close'}
        onClose={() => setGuideModalVisible(false)}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.mapArea}>
          <View style={styles.leftLandWaterLayer} pointerEvents="none">
            <View style={styles.leftLandFill} />
            <Image source={LEFT_BACKGROUND_VECTOR} style={styles.leftVectorImage} contentFit="fill" />
          </View>

          <Image
            source={selectedEraMap}
            style={[styles.backgroundImage, { zIndex: 1 }]}
            contentFit="cover"
            contentPosition="right center"
            pointerEvents="none"
          />
            {guideStyle ? (
            <View
              pointerEvents="none"
              style={[
                styles.guideScreenTint,
                { backgroundColor: guideStyle.screenTint },
              ]}
            />
          ) : null}
    
          <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push('/GuideScreen')}
                onLongPress={handleAdminRefresh}
                delayLongPress={2000}
                activeOpacity={0.85}
              >
                <Image source={HOME_ICON} style={styles.homeIcon} contentFit="contain" />
              </TouchableOpacity>
            {refreshMessage ? (
              <View pointerEvents="none" style={styles.refreshToast}>
                <Text style={styles.refreshToastText}>{refreshMessage}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.endJourneyButton}
              onPress={() => setEndJourneyModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.endJourneyButtonText}>End your journey</Text>
            </TouchableOpacity>
          </View>

            {guideStyle ? (
              <GuideCard
                guideStyle={guideStyle}
                isRelevant={isCurrentYearRelevant}
                legendItems={LEGEND_ITEMS}
                onExitGuide={() => {
                  router.replace({
                    pathname: '/',
                    params: {
                      openTimelineAtYear: String(selectedEra.year),
                    },
                  });
                }}
              />
            ) : (
              <LegendCard legendItems={LEGEND_ITEMS} />
            )}
                
          <View style={{ flexDirection: 'column', gap: 20 }}>
            <View style={styles.eraCard}>
              <Text style={[styles.eraYear, { color: selectedEvent?.color ?? selectedEra?.color }]}>
                {selectedEvent?.year ?? selectedEra?.year}
              </Text>
  
              <Text style={styles.eraName}>{selectedEvent?.title ?? selectedEra?.label}</Text>
  
              {selectedEvent?.timePeriod ? (
                <Text style={[styles.eraTimeframe, { color: selectedEvent.color }]}>
                  {selectedEvent.timePeriod}
                </Text>
              ) : null}
  
              <Text style={styles.eraSummary}>{selectedEvent?.summary}</Text>
            </View>
          {borderDescription && (
           <PoiButton description={borderDescription} />
            )}
          </View>
            {visibleHotspots.map((hotspot) => {
              const poi = content.knowledgeById[hotspot.knowledgeId];
              const imageSource = poi?.mainImage ?? poi?.imageUri;
              const normalizedImageSource =
                typeof imageSource === 'string' ? { uri: imageSource } : imageSource;

              if (!poi || !normalizedImageSource) return null;

              return (
                <MapHotspot
                  key={hotspot.id}
                  top={hotspot.top}
                  left={hotspot.left}
                  iconSource={HOTSPOT_ICONS[hotspot.iconType] ?? CULTURE_ICON}                  
                  // iconSource={HOTSPOT_ICONS[poi.iconType]}
                  imageSource={normalizedImageSource}
                  isOpen={openPoiId === hotspot.id}
                  onHotspotPress={() =>
                    setOpenPoiId((current) => (current === hotspot.id ? null : hotspot.id))
                  }
                  // onPopupPress={() => {
                  //   console.log('Open detail page for', poi.id);
                  // }} //change this to navigate to the detail screen for the POI
                  onPopupPress={() => {
                    router.push({
                      pathname: '/poi-detail',
                      params: {
                        id: poi.id,
                        returnRoot: 'timeline',
                        returnYear: String(selectedEvent?.year ?? selectedEra?.year ?? 1635),
                      },
                    });
                  }}
                  titleTop={poi.titleTop}
                  yearLabel={poi.yearLabel}
                  description={hotspot.shortTextOverride ?? poi.summary ?? poi.description}
                  style={{ zIndex: 10, elevation: 10 }}
                />
              );
            })}

          </View>
        <View style={styles.bottomControls}>
          <View style={styles.bottomToggleContainer}>
            <View style={styles.toggleWrapper}>
              <View style={styles.activeToggle}>
                <Text style={styles.activeToggleText}>Timeline</Text>
              </View>
  
              <TouchableOpacity
                style={styles.inactiveToggle}
                onPress={() => onPressContent?.(targetEraKey)}
                activeOpacity={0.85}
              >
                <Text style={styles.inactiveToggleText}>Content</Text>
              </TouchableOpacity>
            </View>
          </View>
  
          <View style={styles.timelinePanel}>
            <TimelineScrubber
              key={`timeline-${initialYear}`}
              items={timelineItems}
              activeGuide={activeGuide}
              initialIndex={initialYear != null ? getIndexFromYear(timelineItems, initialYear, defaultIndex) : defaultIndex}
              maxGapYears={40}
              pixelsPerYear={3.8}
              minGapPixels={20}
              onSelect={(_, index) => setSelectedIndex(index)}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
              }
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#D3DCCD',
    paddingBottom: 0,
  },

  container: {
    flex: 1,
    backgroundColor: '#D3DCCD',
  },

  mapArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 18,
    overflow: 'hidden',
    zIndex: 1,
    position: 'relative',
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '41%',
    zIndex: 1,
  },

  leftLandWaterLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '44%',
    zIndex: 0,
    overflow: 'hidden',
  },

  leftLandFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D3DCCD',
  },

  leftVectorImage: {
    position: 'absolute',
    top: -170,
    left: 0,
    right: 0,
    height: '80%',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 3,
  },

  endJourneyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: MainColors.pointRed,
    maxWidth: 200,
  },

  endJourneyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FontFamily.interMedium,
    textAlign: 'center',
  },

  homeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    zIndex: 3,
  },

  homeIcon: {
    width: 32,
    height: 32,
  },

  refreshToast: {
    position: 'absolute',
    top: 6,
    left: 72,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 42, 42, 0.92)',
    zIndex: 20,
  },

  refreshToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FontFamily.interMedium,
  },

  eraCard: {
    width: 440,
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 241, 241, 0.94)',
  },

  eraYear: {
    fontSize: 48,
    fontWeight: '900',
    fontFamily: FontFamily.khula,
  },

  eraName: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    color: '#2f2b2d',
    fontFamily: FontFamily.khula,
  },

  eraTimeframe: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },

  eraSummary: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '400',
    color: '#2f2b2d',
  },

  bottomControls: {
    zIndex: 5,
    backgroundColor: '#D3DCCD',
  },

  bottomToggleContainer: {
    position: 'absolute',
    left: 20,
    bottom: 92,
    zIndex: 20,
  },

  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 2,
  },

  inactiveToggle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
  },

  activeToggle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    backgroundColor: '#2E2A2A',
  },

  activeToggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.interMedium,
  },

  inactiveToggleText: {
    color: '#2E2A2A',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.interMedium,
  },

  timelinePanel: {
    height: 88,
    justifyContent: 'flex-end',
    zIndex: 10,
    backgroundColor: '#D3DCCD',
  },
  guideScreenTint: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  
  guideChip: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    zIndex: 6,
  },
  
  guideChipDot: {
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginRight: 8,
  },
  
  guideChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F3437',
  },
});
