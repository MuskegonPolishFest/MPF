import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

type LegendItem = {
  key: string;
  label: string;
  description: string;
  iconSource: number;
};

type GuideLegendModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  accentColor?: string;
  description?: string;
  legendItems: LegendItem[];
  buttonLabel?: string;
  onClose: () => void;
};

export default function GuideLegendModal({
  visible,
  title,
  subtitle,
  accentColor = '#2F3437',
  description,
  legendItems,
  buttonLabel = 'Close',
  onClose,
}: GuideLegendModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.dot, { backgroundColor: accentColor, borderColor: accentColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.subtitleText}>{subtitle}</Text>
              <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
            </View>
          </View>

          {description ? <Text style={styles.description}>{description}</Text> : null}

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
            style={[styles.primaryButton, { backgroundColor: accentColor }]}
            onPress={onClose}
          >
            <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
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
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A7175',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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