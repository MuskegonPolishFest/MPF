import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

type LegendItem = {
  key: string;
  label: string;
  description: string;
  iconSource: number;
};

type GuideCardProps = {
  guideStyle?: {
    label: string;
    color: string;
    chipBorder?: string;
    description?: string;
    focusesOn?: string[];
  } | null;
  isRelevant?: boolean;
  legendItems: LegendItem[];
  onExitGuide?: () => void;
};

export default function GuideCard({
  guideStyle,
  isRelevant = false,
  legendItems,
}: GuideCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!guideStyle) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        style={[
          styles.card,
          {
            width: expanded ? 320 : 220,
            borderColor: isRelevant
              ? guideStyle.color
              : guideStyle.chipBorder ?? 'rgba(255,255,255,0.2)',
            borderWidth: 1.5,
            backgroundColor: isRelevant ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.92)',
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isRelevant ? guideStyle.color : 'transparent',
                borderColor: guideStyle.color,
                borderWidth: 2,
                transform: [{ scale: isRelevant ? 1.1 : 1 }, { rotate: '45deg' }],
                shadowColor: guideStyle.color,
                shadowOpacity: isRelevant ? 0.25 : 0,
                shadowRadius: isRelevant ? 6 : 0,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
          <View style={styles.headerTextWrap}>
            {isRelevant ? (
              <Text style={[styles.relevantLabel, { color: guideStyle.color }]}>
                Year Highlighted by Guide
              </Text>
            ) : null}
            <Text
              style={[
                styles.title,
                { color: isRelevant ? guideStyle.color : '#2F3437' },
              ]}
            >
              {guideStyle.label}
            </Text>
            <Text style={styles.subtitle}>
              {expanded ? 'Tap to close' : 'Tap to learn more'}
            </Text>
          </View>
        </View>

        {expanded ? (
          <View style={styles.expandedContent}>
            {guideStyle.description ? (
              <Text style={styles.description}>
                {guideStyle.description}
              </Text>
            ) : null}

            {guideStyle.focusesOn?.length ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>This guide focuses on</Text>
                {guideStyle.focusesOn.map((item) => (
                  <Text key={item} style={styles.bulletText}>
                    • {item}
                  </Text>
                ))}
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Map icons</Text>
              {legendItems.map((item) => (
                <View key={item.key} style={styles.legendRow}>
                  <Image source={item.iconSource} style={styles.legendIcon} contentFit="contain" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F3437',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: '#6A7175',
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#42484a',
  },
  section: {
    marginTop: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F3437',
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#515558',
    marginBottom: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  legendIcon: {
    width: 22,
    height: 22,
    marginTop: 2,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2F3437',
  },
  legendDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: '#515558',
  },
  relevantLabel: {
    marginBottom: 2,
    top: -4,
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.9,
  },
});