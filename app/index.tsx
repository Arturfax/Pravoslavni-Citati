import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";

function getDailyVerseIndex(): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return dayOfYear % BIBLE_VERSES.length;
}

// Matches the widget's Swift formula: (ordinality(day, in: year) - 1) % count
// Swift ordinality returns 1 for Jan 1, so index = (dayOfYear_1based - 1) % count
function getWidgetDailyVerseIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear =
    Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
  return (dayOfYear - 1) % BIBLE_VERSES.length;
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatSeconds(date: Date): string {
  return date.getSeconds().toString().padStart(2, "0");
}

function formatDate(date: Date): string {
  const days = [
    "Недеља",
    "Понедељак",
    "Уторак",
    "Среда",
    "Четвртак",
    "Петак",
    "Субота",
  ];
  const months = [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(new Date());
  const [verseIndex, setVerseIndex] = useState(getDailyVerseIndex());
  const widgetVerseIndex = getWidgetDailyVerseIndex();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshVerse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    setVerseIndex((prev) => (prev + 1) % BIBLE_VERSES.length);
  }, [fadeAnim]);

  const handleWidgetInfo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/widget-info");
  }, []);

  const handleViewVerses = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/verses");
  }, []);

  const verse = BIBLE_VERSES[verseIndex];
  const widgetVerse = BIBLE_VERSES[widgetVerseIndex];
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.inner,
          {
            paddingTop: topPadding + 8,
            paddingBottom: bottomPadding + 16,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={styles.crossContainer}
            accessibilityLabel="Православни Цитати"
          >
            <FontAwesome5 name="cross" size={18} color={Colors.gold} />
          </View>
          <Pressable
            onPress={handleWidgetInfo}
            style={({ pressed }) => [
              styles.widgetBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={12}
            accessibilityLabel="Информације о виџету"
            accessibilityRole="button"
          >
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={Colors.gold}
            />
          </Pressable>
        </View>

        <View style={styles.clockSection}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(now)}</Text>
            <Text style={styles.secondsText}>{formatSeconds(now)}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(now)}</Text>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.verseWrapper}
          contentContainerStyle={styles.verseScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.verseCard, styles.widgetVerseCard]}>
            <View style={styles.verseLabelRow}>
              <FontAwesome5
                name="bible"
                size={13}
                color={Colors.gold}
                style={{ marginRight: 7 }}
              />
              <Text style={styles.verseLabelText}>СТИХ ДАНА</Text>
            </View>

            <Text style={styles.verseText}>
              {"\u201E"}
              {widgetVerse.text}
              {"\u201C"}
            </Text>
            <Text style={styles.refText}>{widgetVerse.ref}</Text>
          </View>

          <Pressable
            onPress={handleViewVerses}
            accessibilityLabel="Погледај све стихове"
            accessibilityRole="button"
          >
            <Animated.View style={[styles.verseCard, { opacity: fadeAnim }]}>
              <View style={styles.verseLabelRow}>
                <FontAwesome5
                  name="bible"
                  size={13}
                  color={Colors.gold}
                  style={{ marginRight: 7 }}
                />
                <Text style={styles.verseLabelText}>СТИХОВИ</Text>
                <Pressable
                  onPress={handleRefreshVerse}
                  style={({ pressed }) => [
                    styles.refreshBtn,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  hitSlop={14}
                  accessibilityLabel="Освежи стих"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="refresh-circle-outline"
                    size={22}
                    color={Colors.gold}
                  />
                </Pressable>
              </View>

              <Text style={styles.verseText}>
                {"\u201E"}
                {verse.text}
                {"\u201C"}
              </Text>
              <Text style={styles.refText}>{verse.ref}</Text>
            </Animated.View>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.containerBg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  crossContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  widgetBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  clockSection: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 92,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    letterSpacing: -4,
    lineHeight: 100,
    textAlign: "center",
  },
  secondsText: {
    fontSize: 28,
    fontFamily: "Inter_400Regular",
    color: Colors.secondsColor,
    letterSpacing: -1,
    marginBottom: 10,
    marginLeft: 6,
  },
  dateText: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginTop: 6,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.goldOverlayFaint,
    marginBottom: 0,
  },
  verseWrapper: {
    flex: 1,
  },
  verseScrollContent: {
    paddingVertical: 16,
    gap: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
  verseCard: {
    backgroundColor: Colors.cardBgTranslucent,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.goldOverlayFaint,
    padding: 24,
  },
  verseLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  verseLabelText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    letterSpacing: 1.5,
    flex: 1,
  },
  refreshBtn: {
    marginLeft: 8,
  },
  widgetVerseCard: {
    opacity: 0.85,
  },
  verseText: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
    lineHeight: 32,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  refText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
