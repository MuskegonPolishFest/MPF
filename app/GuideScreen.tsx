import { EARLIEST_TIMELINE_YEAR_BY_ERA, EraKey } from "@/constants/contentData";
import { MainColors, QuizResultColors, Typography } from "@/constants/theme";
import { useExperienceContent } from "@/hooks/useExperienceContent";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GUIDE_ERA: Record<string, EraKey> = {
  Culture: "golden_age",
  Hero: "wars_partitions",
  Crafter: "rebirth",
  Adventurer: "ww2",
};

export default function GuideScreen() {
  const content = useExperienceContent();

  const yearFor = (guide: string) => {
    const eraKey = GUIDE_ERA[guide];
    return String(
      content.earliestTimelineYearByEra[eraKey] ?? EARLIEST_TIMELINE_YEAR_BY_ERA[eraKey]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Do You Know {"\n"}Who Your Guide Is?</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Educator */}
        <Link
          href={{
            pathname: "/",
            params: { openTimelineAtYear: yearFor("Culture"), guide: "Culture" },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <View style={styles.diagonal} />
            <View style={styles.goCircle}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color="white"
                style={{
                  alignSelf: "center",
                  marginTop: 18,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.cardText}>
                <Text style={{ color: QuizResultColors.educatorGold }}>
                  The Culture Buff
                </Text>
                {"\n"}
              </Text>

              <Text style={[styles.cardText, styles.fullLine]}>
                from the{" "}
                <Text style={{ color: QuizResultColors.educatorGold }}>
                  Golden Age
                </Text>
              </Text>
            </View>

            <Image
              source={require("../assets/images/Academic.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>

        {/* Writer */}
        <Link
          href={{
            pathname: "/",
            params: { openTimelineAtYear: yearFor("Hero"), guide: "Hero" },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <View style={styles.diagonal} />
            <View style={styles.goCircle}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color="white"
                style={{
                  alignSelf: "center",
                  marginTop: 18,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.cardText}>
                <Text style={{ color: QuizResultColors.writerBlue }}>
                  The Unsung Hero Guide
                </Text>
              </Text>

              <Text style={[styles.cardText, styles.fullLine]}>
                from the{" "}
                <Text style={{ color: QuizResultColors.writerBlue }}>
                  Era of War & Partitions
                </Text>
              </Text>
            </View>

            <Image
              source={require("../assets/images/Writer.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>

        {/* Crafter */}
        <Link
          href={{
            pathname: "/",
            params: { openTimelineAtYear: yearFor("Crafter"), guide: "Crafter" },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <View style={styles.diagonal} />
            <View style={styles.goCircle}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color="white"
                style={{
                  alignSelf: "center",
                  marginTop: 18,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.cardText}>
                <Text style={{ color: QuizResultColors.crafterGreen }}>
                  The Crafter
                </Text>{" "}
                from the
              </Text>

              <Text
                style={[
                  styles.cardText,
                  styles.fullLine,
                  { color: QuizResultColors.crafterGreen },
                ]}
              >
                Rebirth of Poland
              </Text>
            </View>

            <Image
              source={require("../assets/images/Crafting.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>

        {/* Explorer */}
        <Link
          href={{
            pathname: "/",
            params: { openTimelineAtYear: yearFor("Adventurer"), guide: "Adventurer" },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <View style={styles.diagonal} />
            <View style={styles.goCircle}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color="white"
                style={{
                  alignSelf: "center",
                  marginTop: 18,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.cardText}>
                <Text style={{ color: QuizResultColors.explorerRed }}>
                  The Adventurer
                </Text>{" "}
                from the
              </Text>

              <Text
                style={[
                  styles.cardText,
                  styles.fullLine,
                  { color: QuizResultColors.explorerRed },
                ]}
              >
                World War II & Occupation
              </Text>
            </View>

            <Image
              source={require("../assets/images/Explorer.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Button */}
      <View
        style={{ alignSelf: "flex-end", marginTop: 24, marginHorizontal: 54 }}
      >
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Explore the map yourself</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MainColors.backgroundBeige,
  },

  card: {
    width: 300,
    height: 340,
    backgroundColor: "white",
    borderRadius: 24,
    marginVertical: 20,
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#3d3d3d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3.84,
    elevation: 8,
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 40,
  },

  textWrapper: {
    marginVertical: 30,
    alignSelf: "flex-start",
  },

  cardText: {
    fontSize: 18,
    fontWeight: "black",
    fontFamily: "Inter-Black",
    textAlign: "left",
    marginHorizontal: 14,
    width: "60%",
    alignSelf: "flex-start",
    color: "#000",
    lineHeight: 26,
  },

  fullLine: {
    width: "100%",
    alignSelf: "stretch",
    marginTop: -24,
  },

  image: {
    width: "90%",
    height: "60%",
    borderRadius: 24,
    marginTop: -2,
  },

  diagonal: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    backgroundColor: MainColors.backgroundBeige,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },

  goCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 3,
  },

  title: {
    fontSize: 70,
    fontWeight: "black",
    fontFamily: "Inter-Black",
    zIndex: 3,
  },

  titleContainer: {
    marginHorizontal: 60,
    width: "60%",
    zIndex: 3,
    alignSelf: "flex-start",
  },

  button: {
    backgroundColor: MainColors.pointRed,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: Typography.button.fontSize,
    fontWeight: "black",
    fontFamily: Typography.button.fontFamily,
  },
});
