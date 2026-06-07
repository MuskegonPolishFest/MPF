import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

type LegendItem = {
  key: string;
  label: string;
  description: string;
  iconSource: number;
};

type GuideIntroModalProps = {
  visible: boolean;
  guideLabel: string;
  guideColor: string;
  guideDescription?: string;
  legendItems: LegendItem[];
  onStartExploring: () => void;
};

export default function GuideIntroModal({
  visible,
  guideLabel,
  guideColor,
  guideDescription,
  legendItems,
  onStartExploring,
}: GuideIntroModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={onStartExploring}>
        <Pressable style={styles.card} onPress={() => {}}>
            <View style={styles.headerRow}>
            <View style={[styles.dot, { backgroundColor: guideColor, borderColor: guideColor }]} />
            <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Your journey begins</Text>
                <Text style={[styles.title, { color: guideColor }]}>{guideLabel}</Text>
            </View>
            </View>

            <Text style={styles.description}>
            {guideDescription ??
                'Explore Poland’s history through this guide’s lens and use the map icons to discover stories along the way.'}
            </Text>

            <Text style={styles.sectionTitle}>Map icons</Text>

            <View style={styles.legendList}>
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

            <Pressable
            style={[styles.primaryButton, { backgroundColor: guideColor }]}
            onPress={onStartExploring}
            >
            <Text style={styles.primaryButtonText}>Start Exploring</Text>
            </Pressable>
        </Pressable>
        </Pressable>
    </Modal>
    );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 27, 29, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.98)',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
    marginRight: 12,
    borderWidth: 2,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A7175',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2F3437',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#42484A',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F3437',
    marginBottom: 12,
  },
  legendList: {
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  legendIcon: {
    width: 26,
    height: 26,
    marginTop: 2,
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F3437',
  },
  legendDescription: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: '#515558',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});