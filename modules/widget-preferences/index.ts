import { ExtensionStorage } from "@bacons/apple-targets";

type WidgetPreferencesModule = {
  setPinnedVerseIndex(index: number): void;
  clearPinnedVerse(): void;
  getPinnedVerseIndex(): Promise<number | null>;
};

const APP_GROUP_ID = "group.com.pravoslavnicitati.app";
const PINNED_INDEX_KEY = "selectedVerseIndex";
const HAS_PINNED_KEY = "hasPinnedVerse";
const storage = new ExtensionStorage(APP_GROUP_ID);

const WidgetPreferences: WidgetPreferencesModule = {
  setPinnedVerseIndex(index) {
    storage.set(PINNED_INDEX_KEY, index);
    storage.set(HAS_PINNED_KEY, 1);
    ExtensionStorage.reloadWidget();
  },

  clearPinnedVerse() {
    storage.remove(PINNED_INDEX_KEY);
    storage.remove(HAS_PINNED_KEY);
    ExtensionStorage.reloadWidget();
  },

  async getPinnedVerseIndex() {
    const hasPinnedValue = storage.get(HAS_PINNED_KEY);
    const hasPinned =
      hasPinnedValue === "1" ||
      hasPinnedValue === "true" ||
      hasPinnedValue === "YES";

    if (!hasPinned) {
      return null;
    }

    const rawValue = storage.get(PINNED_INDEX_KEY);
    if (rawValue == null) {
      return null;
    }

    const parsed = Number.parseInt(rawValue, 10);
    return Number.isNaN(parsed) ? null : parsed;
  },
};

export default WidgetPreferences;
