import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const STEPS = [
  {
    icon: "lock-closed-outline" as const,
    title: "Отвори закључани екран",
    desc: "Закључај телефон, а затим дуго притисни на закључани екран док се не појави опција за прилагођавање.",
  },
  {
    icon: "color-palette-outline" as const,
    title: "Прилагоди екран",
    desc: 'Тапни на \u201EПрилагоди\u201C на дну екрана, а затим изабери \u201EЗакључани екран\u201C.',
  },
  {
    icon: "add-circle-outline" as const,
    title: "Додај виџет",
    desc: 'Тапни на простор за виџете испод сата \u2192 тапни \u201EДодај виџете\u201C \u2192 пронађи \u201EПравославни Цитати\u201C на листи и изабери жељену величину.',
  },
  {
    icon: "checkmark-circle-outline" as const,
    title: "Потврди избор",
    desc: 'Тапни \u201EГотово\u201C у горњем десном углу. Виџет ће приказивати дневни библијски стих који се мења сваког дана.',
  },
];

export default function WidgetInfoScreen() {
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
        <Text style={styles.headerTitle}>Виџет за закључани екран</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIconBg}>
            <FontAwesome5 name="cross" size={28} color={Colors.gold} />
          </View>
          <Text style={styles.heroTitle}>Додај на закључани екран</Text>
          <Text style={styles.heroSubtitle}>
            Нека Божја реч увек буде пред тобом — тренутно време и дневни
            библијски стих, увек надохват руке.
          </Text>
        </View>

        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Colors.gold}
            style={{ marginRight: 10, marginTop: 1 }}
          />
          <Text style={styles.noteText}>
            Прати ове једноставне кораке да додаш виџет са дневним стихом на
            свој закључани екран.
          </Text>
        </View>

        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Ionicons
                  name={step.icon}
                  size={18}
                  color={Colors.gold}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.tipCard}>
          <FontAwesome5
            name="lightbulb"
            size={16}
            color={Colors.gold}
            style={{ marginRight: 10, marginTop: 1 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Корисни савет</Text>
            <Text style={styles.tipText}>
              Можеш додати виџете различитих величина — мали (само сат), средњи
              (сат + стих) и велики (цео стих). Стих се аутоматски мења сваког
              дана.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  heroIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.cardBorderSubtle,
    borderWidth: 1,
    borderColor: Colors.goldOverlayStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  noteCard: {
    backgroundColor: Colors.goldOverlay,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textLight,
    lineHeight: 21,
  },
  stepCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: Colors.cardBgSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorderSubtle,
    padding: 16,
    gap: 14,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.goldOverlayMedium,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.gold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSoft,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorderSubtle,
    marginVertical: 20,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.cardBgFaint,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorderSubtle,
    padding: 16,
  },
  tipTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSoft,
    lineHeight: 21,
  },
});
