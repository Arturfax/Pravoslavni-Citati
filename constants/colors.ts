const gold = "#C9A84C";
const goldLight = "#E8C87A";
const primary = "#D4AF37";

const gradient: [string, string, string] = ["#0A0F1E", "#060A14", "#040710"];
const gradientAlt: [string, string, string] = ["#0D1225", "#070B16", "#040710"];

export default {
  // Foundational colors for dark backgrounds
  background: "#000000",
  overlay: "rgba(0, 0, 0, 0.45)", // Semi-transparent dark overlay for images
  overlayHeavy: "rgba(0, 0, 0, 0.65)", // Heavier overlay for readability
  overlayCard: "rgba(0, 0, 0, 0.4)", // Translucent card background

  // Text colors
  text: "#Fdfdf8", // Soft warm white (cream-ish)
  textMuted: "#E4DCCF", // Muted cream

  // Cards & surfaces (for modal backgrounds)
  card: "#111111", // Fallback solid background
  cardBorder: "rgba(255, 255, 255, 0.15)", // Very subtle light border for translucent cards

  // Accents & interactive
  primary,
  gold,
  goldLight,

  // Specific element colors
  tabIconDefault: "#6f6f6f",
  tabIconSelected: "#D4AF37",
  separator: "rgba(201, 168, 76, 0.3)", // Gold separator

  // App-specific
  iconColor: "#D4AF37", // Gold icons
  iconBackground: "rgba(201, 168, 76, 0.15)", // Translucent gold for icon backgrounds

  // Legacy base colors
  white: "#FFFFFF",
  black: "#000000",

  gradient,
  gradientAlt,
};
