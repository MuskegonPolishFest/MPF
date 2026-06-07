import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/constants/theme";

type PoiButtonProps = {
  description: string;
};

export default function PoiButton({description}: PoiButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={styles.border}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/images/point.png")}
          style={styles.icon}
        />

        <Text style={styles.borderText}>
          What caused the border change?
        </Text>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={26}
          color="#000"
        />
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>
          {description}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  border: {
    width: 440,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderColor: "#DADADA",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    width: 56,
    height: 56,
    marginRight: 12,
  },
  borderText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontFamily: Typography.body.fontFamily,
    color: "#000",
  },
  expandedContent: {
    marginTop: 12,
  },
  expandedText: {
    fontSize: Typography.small.fontSize,
    fontFamily: Typography.small.fontFamily, 
    color: "#333",
  },
});