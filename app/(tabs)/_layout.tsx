import { useCallback, useMemo } from "react";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { PanResponder, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const navigateToIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= state.routes.length || nextIndex === state.index) {
        return;
      }

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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx <= -28) {
            navigateToIndex(state.index + 1);
            return;
          }

          if (gestureState.dx >= 28) {
            navigateToIndex(state.index - 1);
          }
        },
      }),
    [navigateToIndex, state.index],
  );

  return (
    <View style={styles.tabBarShell} {...panResponder.panHandlers}>
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
        {state.routes.map((route, index) => {
          const focused = index === state.index;

          return (
            <View key={route.key} style={styles.activePillSlot}>
              {focused ? (
                <View style={styles.activePill}>
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
                </View>
              ) : null}
            </View>
          );
        })}
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

          const onPress = () => navigateToIndex(index);

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              onLongPress={onLongPress}
              onPress={onPress}
              style={styles.tabButton}
              testID={options?.tabBarButtonTestID}
            >
              <View style={styles.tabButtonContent}>
                <View style={styles.iconWrap}>{icon}</View>
                <Text
                  numberOfLines={1}
                  style={[styles.tabLabel, focused && styles.tabLabelActive]}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
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
    flexDirection: "row",
    paddingHorizontal: 5,
    zIndex: 0,
  },
  activePillSlot: {
    flex: 1,
    paddingHorizontal: 4,
  },
  activePill: {
    flex: 1,
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
    paddingHorizontal: 5,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    paddingHorizontal: 4,
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
