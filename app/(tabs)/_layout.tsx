import { Tabs } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "rgba(10, 10, 10, 0.15)", // More transparent
          borderTopWidth: 0,
          elevation: 0,
          height: 72, // Taller vertically
          bottom: Platform.OS === "ios" ? 22 : 12, // Lowered
          left: 55, // Narrower horizontally
          right: 55,
          borderRadius: 36,
          paddingBottom: Platform.OS === "ios" ? 14 : 0, 
          paddingTop: Platform.OS === "ios" ? 6 : 0,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.15)",
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={20} // Weaker blur
            style={[StyleSheet.absoluteFill, { borderRadius: 36, overflow: "hidden" }]}
          />
        ),
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          letterSpacing: 0.3,
        },
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
