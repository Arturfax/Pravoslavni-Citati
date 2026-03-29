import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  FlatList,
  Share,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";
import { CHURCH_IMAGES } from "@/constants/images";
import WidgetPreferences from "../../modules/widget-preferences";

function getDailyVerseIndex(): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return dayOfYear % BIBLE_VERSES.length;
}

function formatDate(date: Date): string {
  const days = [
    "Недеља", "Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота",
  ];
  const months = [
    "јануар", "фебруар", "март", "април", "мај", "јун",
    "јул", "август", "септембар", "октобар", "новембар", "децембар",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
}

const FAVORITES_KEY = "favorites";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [verseIndex, setVerseIndex] = useState(getDailyVerseIndex());
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quotePagerHeight, setQuotePagerHeight] = useState(0);
  const quotePagerRef = React.useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      WidgetPreferences.getPinnedVerseIndex().then((idx) => {
        setPinnedIndex(idx ?? null);
      });
      AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
        if (val) setFavorites(JSON.parse(val));
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
      WidgetPreferences.setPinnedVerse(verseIndex, BIBLE_VERSES[verseIndex]);
      setPinnedIndex(verseIndex);
    }
  }, [pinnedIndex, verseIndex]);

  const handleToggleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) => {
      const next = prev.includes(verseIndex)
        ? prev.filter((i) => i !== verseIndex)
        : [...prev, verseIndex];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, [verseIndex]);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const verse = BIBLE_VERSES[verseIndex];
    try {
      await Share.share({
        message: `„${verse.text}”\n— ${verse.ref}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [verseIndex]);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={CHURCH_IMAGES[verseIndex % CHURCH_IMAGES.length]}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        contentFit="cover"
        contentPosition="center"
        transition={300}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.overlayHeavy }]} />

      <View style={[styles.inner, { paddingTop: topPadding + 8 }]}>
        <View style={styles.topRow}>
          <View style={styles.crossContainer}>
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
                onPress={handleToggleFavorite}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
                hitSlop={14}
                accessibilityLabel={
                  favorites.includes(verseIndex)
                    ? "Уклони из омиљених"
                    : "Додај у омиљене"
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={favorites.includes(verseIndex) ? "heart" : "heart-outline"}
                  size={22}
                  color={favorites.includes(verseIndex) ? "#E05555" : Colors.gold}
                />
              </Pressable>
              <Pressable
                onPress={handleTogglePinnedVerse}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.5 : 1, marginLeft: 12 },
                ]}
                hitSlop={14}
                accessibilityLabel={
                  pinnedIndex === verseIndex
                    ? "Уклони цитат са виџета"
                    : "Постави цитат на виџет"
                }
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={
                    pinnedIndex === verseIndex ? "pin" : "pin-outline"
                  }
                  size={22}
                  color={Colors.gold}
                />
              </Pressable>
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.5 : 1, marginLeft: 12 },
                ]}
                hitSlop={14}
                accessibilityLabel="Подели цитат"
                accessibilityRole="button"
              >
                <Ionicons
                  name="share-social-outline"
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
    backgroundColor: Colors.background,
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
    color: Colors.textMuted,
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
    paddingBottom: 115,
  },
  verseCard: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 12,
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
  verseLabelText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    letterSpacing: 1.5,
    flex: 1,
  },
  actionBtn: {
    marginLeft: 8,
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
  verseText: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
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
