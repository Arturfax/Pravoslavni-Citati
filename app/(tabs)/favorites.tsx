import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";
import { CHURCH_IMAGES } from "@/constants/images";

const FAVORITES_KEY = "favorites";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
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

  const removeFavorite = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) => {
      const next = prev.filter((i) => i !== index);
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const favoriteVerses = favorites.map((i) => ({ ...BIBLE_VERSES[i], index: i }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={CHURCH_IMAGES[3]} // Use a specific beautiful image for favorites
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        contentFit="cover"
        contentPosition="center"
        transition={300}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.overlayHeavy }]} />

      <View style={[styles.inner, { paddingTop: topPadding + 8 }]}>
        <View style={styles.headerRow}>
          <Ionicons name="heart" size={18} color={Colors.gold} />
          <Text style={styles.headerText}>ОМИЉЕНИ ЦИТАТИ</Text>
        </View>

        {favoriteVerses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="heart-outline"
              size={48}
              color={Colors.gold}
              style={{ opacity: 0.5 }}
            />
            <Text style={styles.emptyText}>
              Немате омиљених цитата.
            </Text>
            <Text style={styles.emptySubtext}>
              Додајте цитате притиском на срце на почетној страни.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteVerses}
            keyExtractor={(item) => String(item.index)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.verseText}>
                  {"\u201E"}
                  {item.text}
                  {"\u201C"}
                </Text>
                <Text style={styles.refText}>{item.ref}</Text>
                <Pressable
                  onPress={() => removeFavorite(item.index)}
                  style={({ pressed }) => [
                    styles.removeBtn,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  hitSlop={10}
                  accessibilityLabel="Уклони из омиљених"
                  accessibilityRole="button"
                >
                  <Ionicons name="heart-dislike-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
            )}
          />
        )}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 115,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 115,
  },
  card: {
    backgroundColor: Colors.overlayCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    marginBottom: 12,
  },
  verseText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    lineHeight: 26,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
  },
  refText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
