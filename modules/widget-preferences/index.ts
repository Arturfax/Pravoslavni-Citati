import { requireNativeModule } from "expo-modules-core";

type WidgetPreferencesModule = {
  setPinnedVerseIndex(index: number): void;
  clearPinnedVerse(): void;
  getPinnedVerseIndex(): Promise<number | null>;
};

let WidgetPreferences: WidgetPreferencesModule;

try {
  WidgetPreferences = requireNativeModule<WidgetPreferencesModule>(
    "WidgetPreferences"
  );
} catch {
  // Fallback for web / Android / Expo Go
  WidgetPreferences = {
    setPinnedVerseIndex: () => {},
    clearPinnedVerse: () => {},
    getPinnedVerseIndex: async () => null,
  };
}

export default WidgetPreferences;
