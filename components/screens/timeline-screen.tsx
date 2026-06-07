import { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizResultColors } from '@/constants/theme';

import { TimelineItem, TimelineScrubber } from '@/components/timeline-scrubber';
import { EraColors, EraTabTheme, FontFamily, MainColors } from '@/constants/theme';
import { EraKey, POI_DETAILS } from '@/constants/contentData';
import { HOTSPOT_POSITIONS } from '@/constants/hotspotPositions';
import GuideCard from '../GuideCard';
import LegendCard from '../LegendCard';
import GuideLegendModal from '../GuideLegendModal';
import GuideIntroModal from '../GuideIntroModal';

const HOME_ICON = require('@/assets/General_Icons/ Home_icon.svg');

import MapHotspot from '@/components/MapHotspot';
import { EndJourneyFullScreen } from '@/components/EndJourneyFullScreen';
import { useVisited } from '@/components/VisitedContext';
import PoiButton from '../PoiButton';


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

const ERA_BY_NAME = Object.fromEntries(
  ERA_DEFINITIONS.map((era) => [era.name, era])
) as Record<string, EraDefinition>;

const DEFAULT_INDEX = Math.max(
  ERA_ITEMS.findIndex((item) => item.year === 1635),
  0
);

const MAP_1635 = require('@/assets/maps_svg/1635-Realsize.svg');
const MAP_1699 = require('@/assets/maps_svg/1699,1701,1713.svg');
const MAP_1721 = require('@/assets/maps_svg/1721.svg');
const MAP_1772 = require('@/assets/maps_svg/1772.svg');
const MAP_1793 = require('@/assets/maps_svg/1793.svg');
const MAP_1795 = require('@/assets/maps_svg/1795.svg');
const MAP_1807 = require('@/assets/maps_svg/1807.svg');
const MAP_1815 = require('@/assets/maps_svg/1815.svg');
const MAP_1831 = require('@/assets/maps_svg/1831.svg');
const MAP_1846 = require('@/assets/maps_svg/1846.svg');
const MAP_1848 = require('@/assets/maps_svg/1848.svg');
const MAP_1867 = require('@/assets/maps_svg/1867.svg');
const MAP_1871 = require('@/assets/maps_svg/1871.svg');
const MAP_1878 = require('@/assets/maps_svg/1878, 1884,1894,1904.svg');
const MAP_1917 = require('@/assets/maps_svg/1917.svg');
const MAP_1918 = require('@/assets/maps_svg/1918 - 5.svg');
const MAP_1919 = require('@/assets/maps_svg/1919-1.svg');
const MAP_1920 = require('@/assets/maps_svg/1920, 1923.svg');
const MAP_1922 = require('@/assets/maps_svg/1922-2, 1924, 1935.svg');
const MAP_1938 = require('@/assets/maps_svg/1938 -1.svg');
const MAP_1939 = require('@/assets/maps_svg/1939-2.svg');
const MAP_1940 = require('@/assets/maps_svg/1940.1942.svg');
const MAP_1944 = require('@/assets/maps_svg/1944.svg');
const MAP_1945 = require('@/assets/maps_svg/1945 - 5.svg');
const MAP_1948 = require('@/assets/maps_svg/1948, 1951, 1960, 1970, 1975, 1980, 1987.svg');
const MAP_1989 = require('@/assets/maps_svg/1989.svg');
const MAP_1993 = require('@/assets/maps_svg/1993, 2002, 2011.svg');

const RIGHT_ALIGNED_MAP_POSITION = { right: 0, top: '32%' };
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

const MAP_BY_FLOOR_YEAR: Array<{ startYear: number; source: number }> = [
  { startYear: 1635, source: MAP_1635 },
  { startYear: 1686, source: MAP_1699 },
  { startYear: 1721, source: MAP_1721 },
  { startYear: 1772, source: MAP_1772 },
  { startYear: 1793, source: MAP_1793 },
  { startYear: 1795, source: MAP_1795 },
  { startYear: 1807, source: MAP_1807 },
  { startYear: 1815, source: MAP_1815 },
  { startYear: 1831, source: MAP_1831 },
  { startYear: 1846, source: MAP_1846 },
  { startYear: 1848, source: MAP_1848 },
  { startYear: 1867, source: MAP_1867 },
  { startYear: 1871, source: MAP_1871 },
  { startYear: 1878, source: MAP_1878 },
  { startYear: 1917, source: MAP_1917 },
  { startYear: 1918, source: MAP_1918 },
  { startYear: 1919, source: MAP_1919 },
  { startYear: 1920, source: MAP_1920 },
  { startYear: 1922, source: MAP_1922 },
  { startYear: 1938, source: MAP_1938 },
  { startYear: 1939, source: MAP_1939 },
  { startYear: 1940, source: MAP_1940 },
  { startYear: 1944, source: MAP_1944 },
  { startYear: 1945, source: MAP_1945 },
  { startYear: 1948, source: MAP_1948 },
  { startYear: 1989, source: MAP_1989 },
  { startYear: 1993, source: MAP_1993 },
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


function getEraBackgroundMap(year: number) {
  for (let index = MAP_BY_FLOOR_YEAR.length - 1; index >= 0; index -= 1) {
    if (year >= MAP_BY_FLOOR_YEAR[index].startYear) {
      return MAP_BY_FLOOR_YEAR[index].source;
    }
  }

  return MAP_1635;
}

function getIndexFromYear(year: number) {
  const foundIndex = ERA_ITEMS.findIndex((item) => item.year === year);
  return foundIndex >= 0 ? foundIndex : DEFAULT_INDEX;
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

  const confirmEndJourney = useCallback(() => {
    resetExperience();
    setEndJourneyModalVisible(false);
    router.replace('/GuideScreen');
  }, [resetExperience, router]);

  const relevantYears = activeGuide ? GUIDE_LENS[activeGuide] ?? [] : [];
  const timelineItems = ERA_ITEMS.map((item) => ({
    ...item,
    isRelevant: relevantYears.includes(item.year),
  }));
  
  console.log("activeGuide", activeGuide)
  const initialIndex = useMemo(() => {
    if (initialYear != null && !Number.isNaN(initialYear)) {
      const foundIndex = ERA_ITEMS.findIndex((item) => item.year === initialYear);
      if (foundIndex >= 0) return foundIndex;
    }

    return DEFAULT_INDEX;
  }, [initialYear]);


    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const currentItem = ERA_ITEMS[selectedIndex] ?? ERA_ITEMS[0];
    const borderDescription = BORDER_CHANGE_BY_YEAR[currentItem.year];
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


  const selectedEra = useMemo(() => ERA_ITEMS[selectedIndex] ?? ERA_ITEMS[0], [selectedIndex]);

  useEffect(() => {
    onTimelineYearChange?.(selectedEra.year);
  }, [selectedEra.year, onTimelineYearChange]);
  const selectedEraDefinition = ERA_BY_NAME[selectedEra.label] ?? {
    name: selectedEra.label,
    summary: selectedEra.label,
    timeframe: '',
    years: [selectedEra.year],
    color: selectedEra.color ?? '#2f2b2d',
  };
  const selectedEraMap = useMemo(() => getEraBackgroundMap(selectedEra.year), [selectedEra.year]);

  const targetEraKey = selectedEra.eraKey;
  
  const visibleHotspots = useMemo(() => {
    if (targetEraKey === 'all') return [];

    return Object.values(POI_DETAILS).filter((poi) =>
      poi.eraKeys.includes(targetEraKey)
    );
  }, [targetEraKey]);

  const [openPoiId, setOpenPoiId] = useState<string | null>(null);
  
  useEffect(() => {
    setOpenPoiId(null);
  }, [selectedEra.year]);

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
                activeOpacity={0.85}
              >
                <Image source={HOME_ICON} style={styles.homeIcon} contentFit="contain" />
              </TouchableOpacity>
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
              <Text style={[styles.eraYear, { color: selectedEra.color }]}>
                {selectedEra.year}
              </Text>
  
              <Text style={styles.eraName}>{selectedEraDefinition.name}</Text>
  
              {selectedEraDefinition.timeframe ? (
                <Text style={[styles.eraTimeframe, { color: selectedEra.color }]}>
                  {selectedEraDefinition.timeframe}
                </Text>
              ) : null}
  
              <Text style={styles.eraSummary}>{selectedEraDefinition.summary}</Text>
            </View>
          {borderDescription && (
           <PoiButton description={borderDescription} />
            )}
          </View>
            {visibleHotspots.map((poi) => {
              const position = HOTSPOT_POSITIONS[poi.id];

              if (!position || !poi.mainImage) return null;

              return (
                <MapHotspot
                  key={poi.id}
                  top={position.top}
                  left={position.left}
                  iconSource={HOTSPOT_ICONS[poi.iconType] ?? CULTURE_ICON}                  
                  // iconSource={HOTSPOT_ICONS[poi.iconType]}
                  imageSource={poi.mainImage}
                  isOpen={openPoiId === poi.id}
                  onHotspotPress={() =>
                    setOpenPoiId((current) => (current === poi.id ? null : poi.id))
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
                        returnYear: String(selectedEra.year),
                      },
                    });
                  }}
                  titleTop={poi.titleTop}
                  yearLabel={poi.yearLabel}
                  description={poi.summary ?? poi.description}
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
              initialIndex={initialYear != null ? getIndexFromYear(initialYear) : DEFAULT_INDEX}
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