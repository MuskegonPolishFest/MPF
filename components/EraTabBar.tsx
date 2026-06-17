// components/EraTabBar.tsx

import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

import { ERA_TABS, EraKey, EraTab } from "../constants/contentData";
import { ThemedText } from "@/components/themed-text";
import { MainColors } from "@/constants/theme";

type Props = {
  selectedKey: EraKey;
  onSelect: (key: EraKey) => void;
  activeColor: string;
  tabs?: EraTab[];
};

export default function EraTabBar({
  selectedKey,
  onSelect,
  activeColor,
  tabs = ERA_TABS,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isSelected = selectedKey === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              style={[
                styles.tab,
                isSelected && { backgroundColor: activeColor },
              ]}
              activeOpacity={0.8}
            >
              <ThemedText
                type="small"
                style={[
                  styles.tabText,
                  isSelected && { color: "#FFFFFF" },
                ]}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  scrollContent: {
    paddingHorizontal: 16,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },

  tabText: {
    color: MainColors.primaryBlack,
  },
});
