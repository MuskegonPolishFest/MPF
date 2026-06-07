import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  InteractionManager,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';

import { FontFamily, MainColors } from '@/constants/theme';

const SCREEN_BG = MainColors.backgroundBeige;

/** Four eras, left → right: Kingdom → Sigismund III royal banner → PRL → modern Poland */
const FLAGS_IN_ORDER = [
  require('@/assets/flags/Flag_of_the_Kingdom_of_Poland.svg'),
  require('@/assets/flags/Choragiew_Zygmunta_III_Wazy.svg'),
  require('@/assets/flags/Flaga_PPP.svg'),
  require('@/assets/flags/Flag_of_Poland.svg'),
] as const;

/** Stagger SVG mounts after transitions + spaced timeouts so large assets don’t decode in one frame. */
const FLAG_STAGGER_MS = 160;
const FLAG_LOAD_FALLBACK_MS =
  (FLAGS_IN_ORDER.length - 1) * FLAG_STAGGER_MS + 1800;

/** Reserves vertical space for title + bodies + button so `justifyContent: 'center'` does not reflow when copy mounts. */
const COPY_BLOCK_MIN_HEIGHT = 400;

function StaggeredFlagsRow({
  active,
  onAllFlagsLoaded,
}: {
  active: boolean;
  onAllFlagsLoaded?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const loadedRef = useRef<Set<number>>(new Set());
  const reportedRef = useRef(false);

  const tryReportReady = useCallback(() => {
    if (!onAllFlagsLoaded || reportedRef.current) return;
    if (loadedRef.current.size < FLAGS_IN_ORDER.length) return;
    reportedRef.current = true;
    onAllFlagsLoaded();
  }, [onAllFlagsLoaded]);

  useEffect(() => {
    if (!active) {
      setVisibleCount(0);
      loadedRef.current.clear();
      reportedRef.current = false;
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const task = InteractionManager.runAfterInteractions(() => {
      FLAGS_IN_ORDER.forEach((_, index) => {
        const delay = index * FLAG_STAGGER_MS;
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) {
              setVisibleCount((prev) => Math.max(prev, index + 1));
            }
          }, delay)
        );
      });
    });

    return () => {
      cancelled = true;
      task.cancel();
      timeouts.forEach(clearTimeout);
      setVisibleCount(0);
      loadedRef.current.clear();
      reportedRef.current = false;
    };
  }, [active]);

  useEffect(() => {
    if (!active || !onAllFlagsLoaded || reportedRef.current) return;
    const t = setTimeout(() => {
      if (!reportedRef.current) {
        reportedRef.current = true;
        onAllFlagsLoaded();
      }
    }, FLAG_LOAD_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [active, onAllFlagsLoaded]);

  const handleFlagLoad = (index: number) => {
    loadedRef.current.add(index);
    tryReportReady();
  };

  return (
    <View style={styles.flagsRow}>
      {FLAGS_IN_ORDER.map((source, index) => (
        <View key={index} style={styles.flagCell}>
          {index < visibleCount ? (
            <Image
              source={source}
              style={styles.flagImage}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={180}
              onLoad={() => handleFlagLoad(index)}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

type Props = {
  visible: boolean;
  onContinue: () => void;
  onRequestClose: () => void;
};

const easeOut = Easing.out(Easing.cubic);

export function EndJourneyFullScreen({ visible, onContinue, onRequestClose }: Props) {
  const [copyVisible, setCopyVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCopyVisible(false);
    }
  }, [visible]);

  const handleAllFlagsLoaded = useCallback(() => {
    setCopyVisible(true);
  }, []);

  return (
    <Modal visible={visible} animationType="none" presentationStyle="fullScreen" onRequestClose={onRequestClose}>
      <Animated.View
        style={styles.root}
        entering={FadeIn.duration(420).easing(easeOut)}
      >
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
          >
            <View style={styles.content}>
              <StaggeredFlagsRow active={visible} onAllFlagsLoaded={handleAllFlagsLoaded} />

              <View style={styles.copyBlock}>
                {copyVisible ? (
                  <>
                    <Animated.View
                      style={styles.titleWrap}
                      entering={FadeInUp.delay(0).duration(560).springify().damping(22).stiffness(140)}
                    >
                      <Text style={styles.title}>Congratulations, Explorer!</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(120).duration(520).easing(easeOut)}>
                      <Text style={styles.bodyMuted}>
                        {"You've traveled across centuries of Polish history—\nwitnessing change, resilience, and transformation."}
                      </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(260).duration(520).easing(easeOut)}>
                      <View style={styles.bodyDivider} />
                      <Text style={styles.body}>
                        {"Every place you explored tells a story.\n\nAnd there's always more waiting to be discovered."}
                      </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).duration(480).easing(easeOut)}>
                      <TouchableOpacity
                        style={styles.continueButton}
                        onPress={onContinue}
                        activeOpacity={0.88}
                        accessibilityRole="button"
                        accessibilityLabel="Continue to guide"
                      >
                        <Text style={styles.continueLabel}>Restart Journey</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingVertical: 32,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  content: {
    gap: 28,
    width: '100%',
  },
  copyBlock: {
    minHeight: COPY_BLOCK_MIN_HEIGHT,
    width: '100%',
    gap: 28,
  },
  flagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    paddingHorizontal: 4,
  },
  flagCell: {
    flex: 1,
    minWidth: 0,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  titleWrap: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    color: MainColors.pointRed,
    fontFamily: FontFamily.khula,
    textAlign: 'center',
  },
  body: {
    fontSize: 21,
    lineHeight: 32,
    fontWeight: '400',
    color: MainColors.primaryBlack,
    fontFamily: FontFamily.interMedium,
    textAlign: 'center',
  },
  bodyMuted: {
    fontSize: 21,
    lineHeight: 32,
    fontWeight: '400',
    color: MainColors.secondaryGrey,
    fontFamily: FontFamily.interMedium,
    textAlign: 'center',
  },
  bodyDivider: {
    height: 1,
    backgroundColor: 'rgba(46, 42, 42, 0.12)',
    marginBottom: 24,
    marginHorizontal: 8,
  },
  continueButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 40,
    backgroundColor: MainColors.pointRed,
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.interMedium,
  },
});
