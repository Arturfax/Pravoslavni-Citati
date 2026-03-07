import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";

export default function VersesScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradientAlt}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={12}
          accessibilityLabel="Назад"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-down" size={26} color={Colors.gold} />
        </Pressable>
        <Text style={styles.headerTitle}>Стихови</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={BIBLE_VERSES}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.verseCard}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.cardBody}>
              <FontAwesome5
                name="bible"
                size={12}
                color={Colors.gold}
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.verseText}>
                {"\u201E"}
                {item.text}
                {"\u201C"}
              </Text>
              <Text style={styles.refText}>{item.ref}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.containerBg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  verseCard: {
    backgroundColor: Colors.cardBgTranslucent,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.goldOverlayFaint,
    padding: 20,
    flexDirection: "row",
    gap: 14,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.goldOverlayMedium,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  indexText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.gold,
  },
  cardBody: {
    flex: 1,
    alignItems: "center",
  },
  verseText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
    lineHeight: 26,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  refText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
