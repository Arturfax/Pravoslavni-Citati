import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runOnJS } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { BIBLE_VERSES } from "@/constants/verses";
import { CHURCH_IMAGES } from "@/constants/images";
import WidgetPreferences from "../../modules/widget-preferences";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView as any);

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
const LOOPED_VERSES = [
  BIBLE_VERSES[BIBLE_VERSES.length - 1],
  ...BIBLE_VERSES,
  BIBLE_VERSES[0],
];

function getPagerIndexForVerse(index: number): number {
  return index + 1;
}

function getVerseIndexForPager(index: number): number {
  if (index <= 0) {
    return BIBLE_VERSES.length - 1;
  }

  if (index >= BIBLE_VERSES.length + 1) {
    return 0;
  }

  return index - 1;
}

function VerseContent({
  text,
  refText,
  textOpacity,
  translateY,
}: {
  text: string;
  refText: string;
  textOpacity: Animated.AnimatedInterpolation<number>;
  translateY?: Animated.AnimatedInterpolation<number>;
}) {
  return (
    <Animated.View
      style={[
        styles.verseContent,
        { opacity: textOpacity },
        translateY ? { transform: [{ translateY }] } : null,
      ]}
    >
      <Text style={styles.verseText}>
        {"\u201E"}
        {text}
        {"\u201C"}
      </Text>
      <Text style={styles.refText}>{refText}</Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const initialVerseIndex = useRef(getDailyVerseIndex()).current;
  const initialPagerIndex = getPagerIndexForVerse(initialVerseIndex);
  const [verseIndex, setVerseIndex] = useState(initialVerseIndex);
  const [pagerIndex, setPagerIndex] = useState(initialPagerIndex);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [quotePagerHeight, setQuotePagerHeight] = useState(0);
  const quotePagerRef = useRef<FlatList>(null);
  const backgroundPagerRef = useRef<FlatList>(null);
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const likeBurst = useRef(new Animated.Value(0)).current;
  const lastLikeBurstAt = useRef(0);
  const imageCount = CHURCH_IMAGES.length;

  const safePageHeight = Math.max(quotePagerHeight, 1);
  const transitionTravel = Animated.modulo(scrollOffset, safePageHeight);
  const settledOffset = pagerIndex * safePageHeight;
  const overlayDelta = Animated.subtract(scrollOffset, settledOffset);
  const transitionInputRange = useMemo(
    () => [
      0,
      safePageHeight * 0.2,
      safePageHeight * 0.5,
      safePageHeight * 0.8,
      safePageHeight,
    ],
    [safePageHeight],
  );

  const backgroundScale = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [1, 1.01, 1.035, 1.01, 1],
    extrapolate: "clamp",
  });
  const backgroundTranslateY = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [0, -4, -14, -4, 0],
    extrapolate: "clamp",
  });
  const transitionBlurIntensity = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [0, 8, 24, 8, 0],
    extrapolate: "clamp",
  });
  const transitionBlurOpacity = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [0, 0.1, 0.22, 0.1, 0],
    extrapolate: "clamp",
  });
  const transitionVeilOpacity = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [0, 0.05, 0.16, 0.05, 0],
    extrapolate: "clamp",
  });
  const transitionGlowOpacity = transitionTravel.interpolate({
    inputRange: transitionInputRange,
    outputRange: [0, 0.03, 0.08, 0.03, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (windowHeight > 0) {
      backgroundPagerRef.current?.scrollToOffset({
        offset: pagerIndex * windowHeight,
        animated: false,
      });
    }
    if (quotePagerHeight > 0) {
      quotePagerRef.current?.scrollToOffset({
        offset: pagerIndex * quotePagerHeight,
        animated: false,
      });
      scrollOffset.setValue(pagerIndex * quotePagerHeight);
    }
  }, [pagerIndex, quotePagerHeight, scrollOffset, windowHeight]);

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

  const handleOpenAbout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAboutVisible(true);
  }, []);

  const handleCloseAbout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAboutVisible(false);
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

  const animateLikeBurst = useCallback(() => {
    const now = Date.now();
    if (now - lastLikeBurstAt.current < 650) {
      return false;
    }

    lastLikeBurstAt.current = now;
    likeBurst.stopAnimation();
    likeBurst.setValue(0);
    Animated.sequence([
      Animated.timing(likeBurst, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(likeBurst, {
        toValue: 0,
        delay: 180,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    return true;
  }, [likeBurst]);

  const handleLikeCurrentVerse = useCallback(() => {
    if (!animateLikeBurst()) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFavorites((prev) => {
      if (prev.includes(verseIndex)) {
        return prev;
      }

      const next = [...prev, verseIndex];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, [animateLikeBurst, verseIndex]);

  const handlePromptPinnedVerse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const verse = BIBLE_VERSES[verseIndex];
    const isPinned = pinnedIndex === verseIndex;

    Alert.alert(
      isPinned ? "Уклонити цитат са виџета?" : "Закачити цитат на виџет?",
      `„${verse.text}”\n${verse.ref}`,
      [
        { text: "Откажи", style: "cancel" },
        {
          text: isPinned ? "Уклони" : "Закачи",
          style: isPinned ? "destructive" : "default",
          onPress: handleTogglePinnedVerse,
        },
      ],
    );
  }, [handleTogglePinnedVerse, pinnedIndex, verseIndex]);

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

  const syncBackgroundPager = useCallback(
    (offsetY: number) => {
      if (quotePagerHeight <= 0 || windowHeight <= 0) {
        return;
      }

      backgroundPagerRef.current?.scrollToOffset({
        offset: offsetY * (windowHeight / quotePagerHeight),
        animated: false,
      });
    },
    [quotePagerHeight, windowHeight],
  );

  const handleQuoteScroll = useMemo(
    () => Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
      {
        useNativeDriver: false,
        listener: ({ nativeEvent }: { nativeEvent: { contentOffset: { y: number } } }) => {
          syncBackgroundPager(nativeEvent.contentOffset.y);
        },
      },
    ),
    [scrollOffset, syncBackgroundPager],
  );

  const quoteGestures = useMemo(() => {
    const nativeScroll = Gesture.Native();
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(250)
      .maxDistance(18)
      .onEnd((_event, success) => {
        if (success) {
          runOnJS(handleLikeCurrentVerse)();
        }
      });

    const longPress = Gesture.LongPress()
      .minDuration(520)
      .maxDistance(18)
      .onEnd((_event, success) => {
        if (success) {
          runOnJS(handlePromptPinnedVerse)();
        }
      });

    return Gesture.Simultaneous(nativeScroll, Gesture.Exclusive(longPress, doubleTap));
  }, [handleLikeCurrentVerse, handlePromptPinnedVerse]);

  const likeBurstOpacity = likeBurst.interpolate({
    inputRange: [0, 0.12, 0.72, 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: "clamp",
  });
  const likeBurstScale = likeBurst.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [0.68, 1.16, 1],
    extrapolate: "clamp",
  });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const previousVerse = BIBLE_VERSES[
    (verseIndex - 1 + BIBLE_VERSES.length) % BIBLE_VERSES.length
  ];
  const currentVerse = BIBLE_VERSES[verseIndex];
  const nextVerse = BIBLE_VERSES[(verseIndex + 1) % BIBLE_VERSES.length];

  const previousOpacity = overlayDelta.interpolate({
    inputRange: [-safePageHeight, -safePageHeight * 0.45, 0],
    outputRange: [1, 0.58, 0],
    extrapolate: "clamp",
  });
  const previousTranslateY = overlayDelta.interpolate({
    inputRange: [-safePageHeight, 0],
    outputRange: [0, -64],
    extrapolate: "clamp",
  });
  const currentOpacity = overlayDelta.interpolate({
    inputRange: [-safePageHeight * 0.5, 0, safePageHeight * 0.5],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });
  const currentTranslateY = overlayDelta.interpolate({
    inputRange: [-safePageHeight, 0, safePageHeight],
    outputRange: [52, 0, -52],
    extrapolate: "clamp",
  });
  const nextOpacity = overlayDelta.interpolate({
    inputRange: [0, safePageHeight * 0.45, safePageHeight],
    outputRange: [0, 0.58, 1],
    extrapolate: "clamp",
  });
  const nextTranslateY = overlayDelta.interpolate({
    inputRange: [0, safePageHeight],
    outputRange: [64, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: backgroundTranslateY },
              { scale: backgroundScale },
            ],
          },
        ]}
      >
        <FlatList
          ref={backgroundPagerRef}
          data={LOOPED_VERSES}
          keyExtractor={(_, index) => `bg-${index}`}
          style={StyleSheet.absoluteFill}
          scrollEnabled={false}
          pointerEvents="none"
          initialScrollIndex={initialPagerIndex}
          getItemLayout={(_, index) => ({
            length: windowHeight,
            offset: windowHeight * index,
            index,
          })}
          renderItem={({ index }) => (
            <View style={{ height: windowHeight }}>
              <Image
                source={CHURCH_IMAGES[getVerseIndexForPager(index) % imageCount]}
                style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
                contentFit="cover"
                contentPosition="center"
                transition={0}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          windowSize={3}
          initialNumToRender={3}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: transitionBlurOpacity }]}
      >
        <AnimatedBlurView
          intensity={transitionBlurIntensity as unknown as number}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.transitionVeil, { opacity: transitionVeilOpacity }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.transitionGlow, { opacity: transitionGlowOpacity }]}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.overlayHeavy }]} />

      <View style={[styles.inner, { paddingTop: topPadding + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handleOpenAbout}
            style={({ pressed }) => [
              styles.crossContainer,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={12}
            accessibilityLabel="О апликацији"
            accessibilityRole="button"
          >
            <FontAwesome5 name="cross" size={18} color={Colors.gold} />
          </Pressable>
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
                  name={pinnedIndex === verseIndex ? "pin" : "pin-outline"}
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

            <GestureDetector gesture={quoteGestures}>
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
                  <>
                    <Animated.FlatList
                      ref={quotePagerRef}
                      data={LOOPED_VERSES}
                      key={quotePagerHeight}
                      keyExtractor={(_, index) => String(index)}
                      initialScrollIndex={pagerIndex}
                      getItemLayout={(_, index) => ({
                        length: quotePagerHeight,
                        offset: quotePagerHeight * index,
                        index,
                      })}
                      renderItem={() => (
                        <View style={[styles.quotePageFrame, { height: quotePagerHeight }]} />
                      )}
                      pagingEnabled
                      decelerationRate="fast"
                      disableIntervalMomentum
                      snapToInterval={quotePagerHeight}
                      snapToAlignment="start"
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      removeClippedSubviews={false}
                      scrollEventThrottle={16}
                      onScroll={handleQuoteScroll}
                      onMomentumScrollEnd={({ nativeEvent }) => {
                        const nextPagerIndex = Math.round(
                          nativeEvent.contentOffset.y / quotePagerHeight,
                        );
                        const nextVerseIndex = getVerseIndexForPager(nextPagerIndex);
                        const normalizedPagerIndex = getPagerIndexForVerse(nextVerseIndex);
                        const isLoopBoundary = nextPagerIndex !== normalizedPagerIndex;
                        const nextQuoteOffset = isLoopBoundary
                          ? normalizedPagerIndex * quotePagerHeight
                          : nextPagerIndex * quotePagerHeight;

                        if (isLoopBoundary) {
                          quotePagerRef.current?.scrollToOffset({
                            offset: nextQuoteOffset,
                            animated: false,
                          });
                          if (windowHeight > 0) {
                            backgroundPagerRef.current?.scrollToOffset({
                              offset: normalizedPagerIndex * windowHeight,
                              animated: false,
                            });
                          }
                        }

                        scrollOffset.setValue(nextQuoteOffset);
                        syncBackgroundPager(nextQuoteOffset);
                        setPagerIndex(isLoopBoundary ? normalizedPagerIndex : nextPagerIndex);

                        if (nextVerseIndex !== verseIndex) {
                          setVerseIndex(nextVerseIndex);
                        }
                      }}
                    />
                    <View pointerEvents="none" style={styles.quoteOverlay}>
                      <VerseContent
                        text={previousVerse.text}
                        refText={previousVerse.ref}
                        textOpacity={previousOpacity}
                        translateY={previousTranslateY}
                      />
                      <VerseContent
                        text={currentVerse.text}
                        refText={currentVerse.ref}
                        textOpacity={currentOpacity}
                        translateY={currentTranslateY}
                      />
                      <VerseContent
                        text={nextVerse.text}
                        refText={nextVerse.ref}
                        textOpacity={nextOpacity}
                        translateY={nextTranslateY}
                      />
                    </View>
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.likeBurst,
                        {
                          opacity: likeBurstOpacity,
                          transform: [{ scale: likeBurstScale }],
                        },
                      ]}
                    >
                      <Ionicons name="heart" size={88} color="#E05555" />
                    </Animated.View>
                  </>
                ) : null}
              </View>
            </GestureDetector>
          </View>
        </View>
      </View>

      <Modal
        visible={isAboutVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAbout}
      >
        <View style={styles.aboutModal}>
          <Pressable
            style={styles.aboutBackdrop}
            onPress={handleCloseAbout}
            accessibilityRole="button"
            accessibilityLabel="Затвори"
          />
          <BlurView intensity={28} tint="dark" style={styles.aboutCard}>
            <View style={styles.aboutIconBg}>
              <FontAwesome5 name="cross" size={24} color={Colors.gold} />
            </View>
            <Text style={styles.aboutTitle}>О апликацији</Text>
            <Text style={styles.aboutText}>
              Аутори апликације су Лука Артуков и Михаило Ковачевић.
            </Text>
            <Pressable
              onPress={handleCloseAbout}
              style={({ pressed }) => [
                styles.aboutCloseBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityLabel="Затвори о апликацији"
              accessibilityRole="button"
            >
              <Text style={styles.aboutCloseText}>Затвори</Text>
            </Pressable>
          </BlurView>
        </View>
      </Modal>
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
  transitionVeil: {
    backgroundColor: "rgba(0, 0, 0, 0.44)",
  },
  transitionGlow: {
    backgroundColor: "rgba(203, 174, 118, 0.1)",
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
  aboutModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.56)",
  },
  aboutBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  aboutCard: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.overlayCard,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  aboutIconBg: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.iconBackground,
  },
  aboutTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 22,
  },
  aboutCloseBtn: {
    minWidth: 124,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.iconBackground,
    paddingHorizontal: 22,
  },
  aboutCloseText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.gold,
  },
  bottomVerseCard: {
    flex: 1,
  },
  bottomVerseContent: {
    flex: 1,
    overflow: "hidden",
  },
  quotePageFrame: {
    backgroundColor: "transparent",
  },
  quoteOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingTop: 94,
    paddingBottom: 132,
    paddingHorizontal: 28,
  },
  verseContent: {
    position: "absolute",
    left: 28,
    right: 28,
    top: 94,
    bottom: 132,
    justifyContent: "center",
  },
  likeBurst: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
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
