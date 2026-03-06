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
    icon: "construct-outline" as const,
    title: "Build the App",
    desc: "Lock screen widgets require a native app build via Expo EAS (Expo Application Services). You cannot add lock screen widgets through Expo Go — a standalone build is needed.",
  },
  {
    icon: "cloud-upload-outline" as const,
    title: "Publish via EAS Build",
    desc: "Run `eas build --platform ios` to create a production .ipa file. This packages the app with native iOS widget extensions (WidgetKit).",
  },
  {
    icon: "phone-portrait-outline" as const,
    title: "Install on Your iPhone",
    desc: "Install the published app from the App Store or via TestFlight. Once installed natively, your iPhone will recognize the widget.",
  },
  {
    icon: "lock-closed-outline" as const,
    title: "Add to Lock Screen",
    desc: "Long press your iPhone lock screen → tap Customize → tap the lock screen area → tap Add Widgets → find Bible Clock and add it. The widget will show the current time and your verse.",
  },
];

export default function WidgetInfoScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0D1225", "#070B16", "#040710"]}
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
        >
          <Ionicons name="chevron-down" size={26} color={Colors.gold} />
        </Pressable>
        <Text style={styles.headerTitle}>Lock Screen Widget</Text>
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
          <Text style={styles.heroTitle}>Add to Your Lock Screen</Text>
          <Text style={styles.heroSubtitle}>
            Keep God's Word on your lock screen — the time and a daily Bible
            verse, always within reach.
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
            iOS lock screen widgets require a native app build. Follow these
            steps to get the widget on your device.
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
            <Text style={styles.tipTitle}>Quick Tip</Text>
            <Text style={styles.tipText}>
              Once the app is live in the App Store, widgets are available
              immediately. You can add multiple widget sizes — small (time only),
              medium (time + verse), and large (full verse).
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
    backgroundColor: "#040710",
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
    color: "#F0EAD6",
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
    backgroundColor: "rgba(201, 168, 76, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#F0EAD6",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(240, 234, 214, 0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  noteCard: {
    backgroundColor: "rgba(201, 168, 76, 0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.2)",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240, 234, 214, 0.75)",
    lineHeight: 21,
  },
  stepCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "rgba(15, 22, 38, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.12)",
    padding: 16,
    gap: 14,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(201, 168, 76, 0.15)",
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
    color: "#F0EAD6",
  },
  stepDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(240, 234, 214, 0.65)",
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(201, 168, 76, 0.12)",
    marginVertical: 20,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(15, 22, 38, 0.7)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.12)",
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
    color: "rgba(240, 234, 214, 0.65)",
    lineHeight: 21,
  },
});
