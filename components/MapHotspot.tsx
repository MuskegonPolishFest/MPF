import { Image } from 'expo-image';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  top: number | `${number}%`;
  left: number | `${number}%`;
  iconSource: any;
  imageSource: any;
  isOpen: boolean;
  onHotspotPress: () => void;
  onPopupPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleTop: string;
  yearLabel: string;
  description: string;
};

export default function MapHotspot({
  top,
  left,
  iconSource,
  imageSource,
  isOpen,
  onHotspotPress,
  onPopupPress,
  style,
  titleTop,
  yearLabel,
  description,
}: Props) {
  const numericTop = typeof top === 'number' ? top : parseFloat(String(top));
  const openDownward = !Number.isNaN(numericTop) && numericTop < 250;

  return (
    <View
      style={[
        styles.container,
        { top, left },
        style,
        isOpen && styles.openContainer,
      ]}
    >
      <Pressable style={styles.hotspotButton} onPress={onHotspotPress}>
        <Image source={iconSource} style={styles.hotspotIcon} contentFit="contain" />
      </Pressable>

      {isOpen && (
        <Pressable
          style={[
            styles.popupWrapper,
            openDownward ? styles.popupWrapperDown : styles.popupWrapperUp,
          ]}
          onPress={onPopupPress}
        >
          {openDownward && <View style={styles.triangleDown} />}

          <View style={styles.popup}>
            <Image source={imageSource} style={styles.popupImage} contentFit="cover" />

            <View style={styles.textSection}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{titleTop}</Text>
                <Text style={styles.year}>{yearLabel}</Text>
              </View>

              <Text style={styles.description}>{description}</Text>
            </View>
          </View>

          {!openDownward && <View style={styles.triangleUp} />}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  openContainer: {
    zIndex: 9999,
    elevation: 9999,
  },
  popupWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  popupWrapperUp: {
    bottom: 44,
  },
  popupWrapperDown: {
    top: 44,
  },
  popup: {
    width: 296,
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  popupImage: {
    width: '100%',
    height: 152,
    borderRadius: 8,
  },
  textSection: {
    paddingTop: 8,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E2A2A',
  },
  year: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E2A2A',
  },
  description: {
    fontSize: 19,
    lineHeight: 27,
    color: '#2E2A2A',
  },
  triangleUp: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
  },
  triangleDown: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginBottom: -6,
  },
  hotspotButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotIcon: {
    width: 34,
    height: 34,
  },
});