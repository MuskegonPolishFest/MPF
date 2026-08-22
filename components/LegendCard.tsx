import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'expo-image';

type LegendItem = {
  key: string;
  label: string;
  description: string;
  iconSource: number | string;
};

type LegendCardProps = {
  legendItems: LegendItem[];
  expanded: boolean;
  onToggle: () => void;
};

export default function LegendCard({ legendItems, expanded, onToggle }: LegendCardProps) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          {
            width: expanded ? 320 : 140,
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1.5,
            backgroundColor: 'rgba(255,255,255,0.92)',
          },
        ]}
      >
        <Pressable onPress={onToggle} style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Legend</Text>
            <Text style={styles.subtitle}>
              {expanded ? 'Tap to close' : 'Tap to see more'}
            </Text>
          </View>
        </Pressable>

        {expanded ? (
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.expandedContent}>
              <Text style={styles.sectionLabel}>Map icons</Text>

              <ScrollView style={styles.legendScroll} showsVerticalScrollIndicator>
                <View style={styles.legendGrid}>
                  {legendItems.map((item) => (
                    <View key={item.key} style={styles.legendCell}>
                      <Image
                        source={item.iconSource}
                        style={styles.legendIcon}
                        contentFit="contain"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.legendLabel}>{item.label}</Text>
                        <Text style={styles.legendDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
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
    flexShrink: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F3437',
    marginBottom: 8,
  },
  legendScroll: {
    maxHeight: 480,
    flexShrink: 1,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  legendCell: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
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
});
