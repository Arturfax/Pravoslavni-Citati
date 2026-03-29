import { ExtensionStorage } from "@bacons/apple-targets";

type PinnedVerse = {
  text: string;
  ref: string;
};

type WidgetPreferencesModule = {
  setPinnedVerse(index: number, verse: PinnedVerse): void;
  clearPinnedVerse(): void;
  getPinnedVerseIndex(): Promise<number | null>;
};

const APP_GROUP_ID = "group.com.pravoslavnicitati.app";
const PINNED_INDEX_KEY = "selectedVerseIndex";
const PINNED_TEXT_KEY = "selectedVerseText";
const PINNED_REF_KEY = "selectedVerseRef";
const storage = new ExtensionStorage(APP_GROUP_ID);
const WIDGET_KINDS = ["BibleHomeWidget", "BibleLockWidget"] as const;

function reloadWidgets() {
  WIDGET_KINDS.forEach((kind) => {
    ExtensionStorage.reloadWidget(kind);
  });
}

const WidgetPreferences: WidgetPreferencesModule = {
  setPinnedVerse(index, verse) {
    storage.set(PINNED_INDEX_KEY, index);
    storage.set(PINNED_TEXT_KEY, verse.text);
    storage.set(PINNED_REF_KEY, verse.ref);
    reloadWidgets();
  },

  clearPinnedVerse() {
    storage.remove(PINNED_INDEX_KEY);
    storage.remove(PINNED_TEXT_KEY);
    storage.remove(PINNED_REF_KEY);
    reloadWidgets();
  },

  async getPinnedVerseIndex() {
    const rawValue = storage.get(PINNED_INDEX_KEY);
    if (rawValue == null) {
      return null;
    }

    const parsed = Number.parseInt(rawValue, 10);
    return Number.isNaN(parsed) ? null : parsed;
  },
};

export default WidgetPreferences;
