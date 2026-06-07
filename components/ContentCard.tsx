// components/ContentCard.tsx

import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ContentCardItem } from "../constants/contentData";
import { ThemedText } from "@/components/themed-text";
import { MainColors } from "@/constants/theme";

type Props = {
  item: ContentCardItem;
  onPress?: () => void;
};

export default function ContentCard({ item, onPress }: Props) {
  const imageSource =
    typeof item.imageUri === "string" ? { uri: item.imageUri } : item.imageUri;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* Image: imageUri can be a local require() resource (number) or a remote URL (string) */}
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={styles.image}
        />
      </View>

      {/* Text area */}
      <View style={styles.textArea}>
        <View style={styles.topRow}>
          <ThemedText type="h6" style={styles.titleTop} numberOfLines={1}>
            {item.titleTop}
          </ThemedText>

          <ThemedText type="h6" style={styles.yearText} numberOfLines={1}>
            {item.yearLabel}
          </ThemedText>
        </View>

        <ThemedText type="small" style={styles.titleBottom} numberOfLines={3}>
          {item.titleBottom}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const RADIUS = 26;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 280,
    borderRadius: RADIUS,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  imageWrapper: {
    padding: 10,
    paddingBottom: 0,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 18,
  },

  textArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },

  titleTop: {
    color: MainColors.primaryBlack,
    flexShrink: 1,
  },

  yearText: {
    color: MainColors.primaryBlack,
  },

  titleBottom: {
    color: MainColors.primaryBlack,
    lineHeight: 18,
  },
});