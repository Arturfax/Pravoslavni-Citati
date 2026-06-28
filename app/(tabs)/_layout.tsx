import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TRACK_HORIZONTAL_PADDING = 5;
const SLOT_HORIZONTAL_PADDING = 4;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 180,
  mass: 0.8,
};

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

function AnimatedTabButton({
  accessibilityLabel,
  focused,
  icon,
  index,
  label,
  onLongPress,
  onPress,
  pillIndex,
  arrivalBoost,
  testID,
}: {
  accessibilityLabel?: string;
  focused: boolean;
  icon: ReactNode;
  index: number;
  label: string;
  onLongPress: () => void;
  onPress: () => void;
  pillIndex: SharedValue<number>;
  arrivalBoost: SharedValue<number>;
  testID?: string;
}) {
  const animatedIconStyle = useAnimatedStyle(() => {
    const distance = Math.min(Math.abs(pillIndex.value - index), 1);
    const proximity = 1 - distance;
    const scale = 1 + proximity * 0.15 + arrivalBoost.value * proximity * 0.45;

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.tabButton}
      testID={testID}
    >
      <View style={styles.tabButtonContent}>
        <Animated.View style={[styles.iconWrap, animatedIconStyle]}>
          {icon}
        </Animated.View>
        <Text
          numberOfLines={1}
          style={[styles.tabLabel, focused && styles.tabLabelActive]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const routeCount = state.routes.length;
  const trackWidth = Math.max(tabBarWidth - TRACK_HORIZONTAL_PADDING * 2, 0);
  const slotWidth = routeCount > 0 ? trackWidth / routeCount : 0;
  const pillWidth = Math.max(slotWidth - SLOT_HORIZONTAL_PADDING * 2, 0);

  const tabPositions = useMemo(
    () =>
      state.routes.map(
        (_, index) => TRACK_HORIZONTAL_PADDING + slotWidth * index + slotWidth / 2,
      ),
    [slotWidth, state.routes],
  );
  const pillLeftPositions = useMemo(
    () => tabPositions.map((center) => center - pillWidth / 2),
    [pillWidth, tabPositions],
  );
  const inputRange = useMemo(
    () => state.routes.map((_, index) => index),
    [state.routes],
  );

  const pillIndex = useSharedValue(state.index);
  const gestureStartIndex = useSharedValue(state.index);
  const isDragging = useSharedValue(0);
  const arrivalBoost = useSharedValue(0);

  const animatePillToIndex = useCallback(
    (nextIndex: number) => {
      pillIndex.value = withSpring(nextIndex, SPRING_CONFIG);
      arrivalBoost.value = 0.05;
      arrivalBoost.value = withSpring(0, SPRING_CONFIG);
    },
    [arrivalBoost, pillIndex],
  );

  const navigateToIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= state.routes.length || nextIndex === state.index) {
        return;
      }

      void Haptics.selectionAsync();

      const route = state.routes[nextIndex];
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(route.name as never);
      }
    },
    [navigation, state.index, state.routes],
  );

  useEffect(() => {
    if (isDragging.value === 0) {
      animatePillToIndex(state.index);
    }
  }, [animatePillToIndex, isDragging, state.index]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-8, 8])
        .failOffsetY([-12, 12])
        .onBegin(() => {
          gestureStartIndex.value = pillIndex.value;
          isDragging.value = 1;
        })
        .onUpdate((event) => {
          if (Math.abs(event.translationX) <= Math.abs(event.translationY) || slotWidth <= 0) {
            return;
          }

          const nextIndex = clamp(
            gestureStartIndex.value + event.translationX / slotWidth,
            0,
            routeCount - 1,
          );
          pillIndex.value = nextIndex;
        })
        .onEnd((event) => {
          isDragging.value = 0;

          let destinationIndex = state.index;
          if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
            if (event.translationX < -30 && state.index > 0) {
              destinationIndex = state.index - 1;
            } else if (event.translationX > 30 && state.index < routeCount - 1) {
              destinationIndex = state.index + 1;
            }
          }

          pillIndex.value = withSpring(destinationIndex, SPRING_CONFIG);
          arrivalBoost.value = 0.05;
          arrivalBoost.value = withSpring(0, SPRING_CONFIG);

          if (destinationIndex !== state.index) {
            runOnJS(navigateToIndex)(destinationIndex);
          }
        })
        .onFinalize(() => {
          isDragging.value = 0;
        }),
    [
      arrivalBoost,
      gestureStartIndex,
      isDragging,
      navigateToIndex,
      pillIndex,
      routeCount,
      slotWidth,
      state.index,
    ],
  );

  const activePillStyle = useAnimatedStyle(() => {
    const pillLeft = pillLeftPositions.length > 1
      ? interpolate(
        pillIndex.value,
        inputRange,
        pillLeftPositions,
        Extrapolation.CLAMP,
      )
      : pillLeftPositions[0] ?? TRACK_HORIZONTAL_PADDING + SLOT_HORIZONTAL_PADDING;

    const localProgress = isDragging.value
      ? ((pillIndex.value % 1) + 1) % 1
      : 0;
    const squeeze = Math.sin(localProgress * Math.PI);
    const scaleX = (isDragging.value ? 1 - 0.3 * squeeze : 1) + arrivalBoost.value;
    const scaleY = (isDragging.value ? 1 - 0.15 * squeeze : 1) + arrivalBoost.value * 0.55;

    return {
      width: pillWidth,
      transform: [
        { translateX: pillLeft },
        { scaleX },
        { scaleY },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={styles.tabBarShell}
        onLayout={({ nativeEvent }) => {
          const nextWidth = Math.round(nativeEvent.layout.width);
          if (nextWidth > 0 && nextWidth !== tabBarWidth) {
            setTabBarWidth(nextWidth);
          }
        }}
      >
        <BlurView
          tint="dark"
          intensity={34}
          style={[StyleSheet.absoluteFill, styles.blurBackground]}
        />
        <View pointerEvents="none" style={styles.shellTone} />
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(255, 255, 255, 0.16)",
            "rgba(255, 255, 255, 0.05)",
            "rgba(18, 20, 28, 0.18)",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.shellGlassGradient}
        />
        <View pointerEvents="none" style={styles.shellInnerStroke} />

        <View pointerEvents="none" style={styles.activePillTrack}>
          <Animated.View style={[styles.activePill, activePillStyle]}>
            <BlurView
              tint="light"
              intensity={42}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.20)",
                "rgba(255, 249, 235, 0.10)",
                "rgba(38, 32, 18, 0.24)",
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.activePillFill}
            />
            <View style={styles.activePillStroke} />
            <View style={styles.activePillInnerStroke} />
          </Animated.View>
        </View>

        <View style={styles.tabRow}>
          {state.routes.map((route, index) => {
            const focused = index === state.index;
            const options = descriptors[route.key]?.options;
            const color = focused ? Colors.gold : Colors.textMuted;
            const label =
              typeof options?.tabBarLabel === "string"
                ? options.tabBarLabel
                : typeof options?.title === "string"
                  ? options.title
                  : route.name;

            const icon =
              typeof options?.tabBarIcon === "function"
                ? options.tabBarIcon({ focused, color, size: 24 })
                : null;

            const onPress = () => {
              animatePillToIndex(index);
              navigateToIndex(index);
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <AnimatedTabButton
                key={route.key}
                accessibilityLabel={options?.tabBarAccessibilityLabel}
                focused={focused}
                icon={icon}
                index={index}
                label={label}
                onLongPress={onLongPress}
                onPress={onPress}
                pillIndex={pillIndex}
                arrivalBoost={arrivalBoost}
                testID={options?.tabBarButtonTestID}
              />
            );
          })}
        </View>
      </View>
    </GestureDetector>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Омиљени",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Почетна",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: "Цитат Дана",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bible" size={size - 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarShell: {
    position: "absolute",
    backgroundColor: "rgba(10, 10, 10, 0.15)",
    borderTopWidth: 0,
    elevation: 0,
    height: 72,
    bottom: Platform.OS === "ios" ? 22 : 12,
    left: 16,
    right: 16,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  blurBackground: {
    borderRadius: 36,
    overflow: "hidden",
  },
  shellTone: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 22, 29, 0.16)",
  },
  shellGlassGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
  },
  shellInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  activePillTrack: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  activePill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowOpacity: Platform.OS === "ios" ? 0.22 : 0,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 1 },
  },
  activePillFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  activePillStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(227, 201, 140, 0.78)",
  },
  activePillInnerStroke: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  tabRow: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: TRACK_HORIZONTAL_PADDING,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    paddingHorizontal: SLOT_HORIZONTAL_PADDING,
  },
  tabButtonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 7 : 5,
    paddingBottom: Platform.OS === "ios" ? 6 : 4,
  },
  iconWrap: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  tabLabel: {
    color: Colors.textMuted,
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.gold,
  },
});
