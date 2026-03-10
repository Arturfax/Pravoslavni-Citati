import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";
import WidgetPreferences from "../modules/widget-preferences";

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
  const [verseIndex, setVerseIndex] = useState(getDailyVerseIndex());
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [quotePagerHeight, setQuotePagerHeight] = useState(0);
  const widgetVerseIndex = getWidgetDailyVerseIndex();
  const quotePagerRef = React.useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      WidgetPreferences.getPinnedVerseIndex().then((idx) => {
        setPinnedIndex(idx ?? null);
      });
    }, []),
  );

  const handleWidgetInfo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/widget-info");
  }, []);

  const handleTogglePinnedVerse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (pinnedIndex === verseIndex) {
      WidgetPreferences.clearPinnedVerse();
      setPinnedIndex(null);
    } else {
      WidgetPreferences.setPinnedVerseIndex(verseIndex);
      setPinnedIndex(verseIndex);
    }
  }, [pinnedIndex, verseIndex]);

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
          <Text style={styles.headerDateText}>{formatDate(new Date())}</Text>
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

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.heroLabelRow}>
              <FontAwesome5
                name="bible"
                size={13}
                color={Colors.gold}
                style={{ marginRight: 7 }}
              />
              <Text style={styles.verseLabelText}>ЦИТАТ ДАНА</Text>
            </View>

            <Text style={styles.heroVerseText}>
              {"\u201E"}
              {widgetVerse.text}
              {"\u201C"}
            </Text>
            <Text style={styles.heroRefText}>{widgetVerse.ref}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.verseCard, styles.bottomVerseCard]}>
            <View style={styles.verseLabelRow}>
              <View style={styles.verseHeaderButton}>
                <FontAwesome5
                  name="bible"
                  size={13}
                  color={Colors.gold}
                  style={{ marginRight: 7 }}
                />
                <Text style={styles.verseLabelText}>ЦИТАТИ</Text>
              </View>
              <Pressable
                onPress={handleTogglePinnedVerse}
                style={({ pressed }) => [
                  styles.refreshBtn,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
                hitSlop={14}
                accessibilityLabel={
                  pinnedIndex === verseIndex
                    ? "Уклони цитат са виџета"
                    : "Постави цитат на виџет"
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={
                    pinnedIndex === verseIndex ? "bookmark" : "bookmark-outline"
                  }
                  size={22}
                  color={Colors.gold}
                />
              </Pressable>
            </View>

            <View
              style={styles.bottomVerseContent}
              onLayout={({ nativeEvent }) => {
                const nextHeight = Math.round(nativeEvent.layout.height);
                if (nextHeight > 0 && nextHeight !== quotePagerHeight) {
                  setQuotePagerHeight(nextHeight);
                }
              }}
            >
              {quotePagerHeight > 0 ? (
                <FlatList
                  ref={quotePagerRef}
                  data={BIBLE_VERSES}
                  key={quotePagerHeight}
                  keyExtractor={(_, index) => String(index)}
                  initialScrollIndex={verseIndex}
                  getItemLayout={(_, index) => ({
                    length: quotePagerHeight,
                    offset: quotePagerHeight * index,
                    index,
                  })}
                  renderItem={({ item }) => (
                    <View
                      style={[styles.quotePage, { height: quotePagerHeight }]}
                    >
                      <Text style={styles.verseText}>
                        {"\u201E"}
                        {item.text}
                        {"\u201C"}
                      </Text>
                      <Text style={styles.refText}>{item.ref}</Text>
                    </View>
                  )}
                  pagingEnabled
                  decelerationRate="fast"
                  disableIntervalMomentum
                  snapToInterval={quotePagerHeight}
                  snapToAlignment="start"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={({ nativeEvent }) => {
                    const nextIndex = Math.round(
                      nativeEvent.contentOffset.y / quotePagerHeight,
                    );
                    if (nextIndex !== verseIndex) {
                      setVerseIndex(nextIndex);
                    }
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
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
    marginBottom: 6,
  },
  crossContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerDateText: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    textAlign: "center",
    marginHorizontal: 12,
  },
  widgetBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 16,
  },
  heroSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
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
  verseHeaderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  heroLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
  divider: {
    height: 1,
    backgroundColor: Colors.goldOverlayFaint,
    marginBottom: 16,
  },
  bottomVerseCard: {
    flex: 1,
  },
  bottomVerseContent: {
    flex: 1,
    overflow: "hidden",
  },
  quotePage: {
    justifyContent: "center",
  },
  heroVerseText: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
    lineHeight: 30,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 14,
  },
  heroRefText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    textAlign: "center",
    letterSpacing: 0.5,
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
