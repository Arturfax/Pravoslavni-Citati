import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const BIBLE_VERSES = [
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    ref: "Jeremiah 29:11",
  },
  {
    text: "I can do all this through him who gives me strength.",
    ref: "Philippians 4:13",
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    ref: "Psalm 23:1-3",
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    ref: "Proverbs 3:5-6",
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    ref: "Joshua 1:9",
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    ref: "Romans 8:28",
  },
  {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    ref: "John 3:16",
  },
  {
    text: "The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?",
    ref: "Psalm 27:1",
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    ref: "Matthew 11:28",
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    ref: "Philippians 4:6",
  },
  {
    text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.",
    ref: "Numbers 6:24-25",
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary.",
    ref: "Isaiah 40:31",
  },
  {
    text: "Give thanks to the Lord, for he is good; his love endures forever.",
    ref: "Psalm 107:1",
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    ref: "1 Peter 5:7",
  },
  {
    text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
    ref: "Zephaniah 3:17",
  },
  {
    text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    ref: "1 Thessalonians 5:16-18",
  },
  {
    text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    ref: "Psalm 23:4",
  },
  {
    text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.",
    ref: "Ephesians 2:8",
  },
  {
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    ref: "Matthew 6:33",
  },
  {
    text: "And now these three remain: faith, hope and love. But the greatest of these is love.",
    ref: "1 Corinthians 13:13",
  },
  {
    text: "This is the day the Lord has made; we will rejoice and be glad in it.",
    ref: "Psalm 118:24",
  },
  {
    text: "For where two or three gather in my name, there am I with them.",
    ref: "Matthew 18:20",
  },
  {
    text: "Your word is a lamp for my feet, a light on my path.",
    ref: "Psalm 119:105",
  },
  {
    text: "I have been crucified with Christ and I no longer live, but Christ lives in me.",
    ref: "Galatians 2:20",
  },
  {
    text: "The peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    ref: "Philippians 4:7",
  },
];

function getDailyVerseIndex(): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % BIBLE_VERSES.length;
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
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(new Date());
  const [verseIndex, setVerseIndex] = useState(getDailyVerseIndex());
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

  const verse = BIBLE_VERSES[verseIndex];
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0A0F1E", "#060A14", "#040710"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.inner,
          {
            paddingTop: topPadding + 16,
            paddingBottom: bottomPadding + 16,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.crossContainer}>
            <FontAwesome5 name="cross" size={18} color={Colors.gold} />
          </View>
          <Pressable
            onPress={handleWidgetInfo}
            style={({ pressed }) => [
              styles.widgetBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={12}
          >
            <Ionicons name="add-circle-outline" size={26} color={Colors.gold} />
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

        <Animated.View style={[styles.verseCard, { opacity: fadeAnim }]}>
          <View style={styles.verseLabelRow}>
            <FontAwesome5
              name="bible"
              size={13}
              color={Colors.gold}
              style={{ marginRight: 7 }}
            />
            <Text style={styles.verseLabelText}>VERSE OF THE DAY</Text>
            <Pressable
              onPress={handleRefreshVerse}
              style={({ pressed }) => [
                styles.refreshBtn,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={14}
            >
              <Ionicons
                name="refresh-circle-outline"
                size={22}
                color={Colors.gold}
              />
            </Pressable>
          </View>

          <Text style={styles.verseText}>
            {"\u201C"}
            {verse.text}
            {"\u201D"}
          </Text>
          <Text style={styles.refText}>{verse.ref}</Text>
        </Animated.View>

        <View style={styles.bottomGlow} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040710",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 92,
    fontFamily: "Inter_700Bold",
    color: "#F0EAD6",
    letterSpacing: -4,
    lineHeight: 100,
    textAlign: "center",
  },
  secondsText: {
    fontSize: 28,
    fontFamily: "Inter_400Regular",
    color: "rgba(201, 168, 76, 0.65)",
    letterSpacing: -1,
    marginBottom: 10,
    marginLeft: 6,
  },
  dateText: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: "rgba(240, 234, 214, 0.55)",
    letterSpacing: 0.3,
    marginTop: 6,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(201, 168, 76, 0.18)",
    marginHorizontal: 0,
    marginBottom: 28,
  },
  verseCard: {
    backgroundColor: "rgba(15, 22, 38, 0.85)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.18)",
    padding: 24,
    marginBottom: 12,
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
  verseText: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: "#F0EAD6",
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
  bottomGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "transparent",
  },
});
