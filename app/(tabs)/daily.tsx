import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Share,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";
import { CHURCH_IMAGES } from "@/constants/images";

const FAVORITES_KEY = "favorites";

function getWidgetDailyVerseIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear =
    Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
  return (dayOfYear - 1) % BIBLE_VERSES.length;
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

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const widgetVerseIndex = getWidgetDailyVerseIndex();
  const verse = BIBLE_VERSES[widgetVerseIndex];
  const [favorites, setFavorites] = useState<number[]>([]);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
        if (val) setFavorites(JSON.parse(val));
        else setFavorites([]);
      });
    }, []),
  );

  const handleToggleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) => {
      const next = prev.includes(widgetVerseIndex)
        ? prev.filter((i) => i !== widgetVerseIndex)
        : [...prev, widgetVerseIndex];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, [widgetVerseIndex]);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `„${verse.text}”\n— ${verse.ref}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [verse]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={CHURCH_IMAGES[4]}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        contentFit="cover"
        contentPosition="center"
        transition={300}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.overlayHeavy }]} />

      <View style={[styles.inner, { paddingTop: topPadding + 8 }]}>
        <Text style={styles.dateText}>{formatDate(new Date())}</Text>

        <View style={styles.content}>
          <View style={styles.labelRow}>
            <FontAwesome5
              name="bible"
              size={15}
              color={Colors.gold}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.labelText}>ЦИТАТ ДАНА</Text>
          </View>

          <View style={styles.verseContainer}>
            <FontAwesome5
              name="cross"
              size={28}
              color={Colors.gold}
              style={{ marginBottom: 24, opacity: 0.8 }}
            />
            <Text style={styles.verseText}>
              {"\u201E"}
              {verse.text}
              {"\u201C"}
            </Text>
            <Text style={styles.refText}>{verse.ref}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={handleToggleFavorite}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
                hitSlop={16}
                accessibilityLabel={
                  favorites.includes(widgetVerseIndex)
                    ? "Уклони из омиљених"
                    : "Додај у омиљене"
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={favorites.includes(widgetVerseIndex) ? "heart" : "heart-outline"}
                  size={20}
                  color={favorites.includes(widgetVerseIndex) ? "#E05555" : Colors.gold}
                />
              </Pressable>
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { opacity: pressed ? 0.6 : 1, marginLeft: 12 },
                ]}
                hitSlop={16}
                accessibilityLabel="Подели цитат"
                accessibilityRole="button"
              >
                <Ionicons name="share-social-outline" size={20} color={Colors.gold} />
              </Pressable>
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
  dateText: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    letterSpacing: 0.3,
    textAlign: "center",
    marginBottom: 6,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 115,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  labelText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    letterSpacing: 2,
  },
  verseContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  verseText: {
    fontSize: 22,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    lineHeight: 36,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  refText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.iconBackground,
    borderWidth: 1,
    borderColor: Colors.separator,
    alignItems: "center",
    justifyContent: "center",
  },
});
