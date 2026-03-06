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
    text: "Јер ја знам мисли које мислим за вас, говори Господ, мисли мирне а не зле, да вам дам будућност и наду.",
    ref: "Јеремија 29:11",
  },
  {
    text: "Господ је пастир мој, ништа ми не недостаје. На зеленим пашњацима Он ме одмара, поред тихих вода Он ме води.",
    ref: "Псалм 23:1-2",
  },
  {
    text: "Уздај се у Господа свим срцем својим и немој се ослањати на разум свој; у свим путевима својим познавај Га, и Он ће управљати стазама твојим.",
    ref: "Пословице 3:5-6",
  },
  {
    text: "Будите храбри и јаки, не бојте се и не плашите их се, јер Господ Бог твој иде с тобом, неће те оставити нити ће те напустити.",
    ref: "Поновљени закон 31:6",
  },
  {
    text: "Јер тако Бог возљуби свет да је Сина Свога јединородног дао, да сваки ко Га вјерује не погине него да има живот вјечни.",
    ref: "Јован 3:16",
  },
  {
    text: "Господ је светлост моја и спасење моје, кога ћу се бојати? Господ је јачина живота мојега, кога ћу се уплашити?",
    ref: "Псалм 27:1",
  },
  {
    text: "Дођите к мени сви уморни и натоварени и ја ћу вас одморити.",
    ref: "Матеј 11:28",
  },
  {
    text: "Не брините ни за шта, него у свему молитвом и мољењем са захваљивањем износите жеље своје пред Бога.",
    ref: "Филипљанима 4:6",
  },
  {
    text: "А они који чекају на Господа добиваће нову снагу, расти ће крилима као орлови, трчати ће и неће се уморити, ходити ће и неће клонути.",
    ref: "Исаија 40:31",
  },
  {
    text: "Хвалите Господа јер је добар, јер је вечна милост Његова.",
    ref: "Псалм 107:1",
  },
  {
    text: "Сву бригу своју баците на Њега, јер Он брине за вас.",
    ref: "Прва Петрова 5:7",
  },
  {
    text: "Господ Бог твој је с тобом, силни Спаситељ. Он ће се радовати теби са радошћу, обновити ће те у љубави Својој, клицаће над тобом с радошћу.",
    ref: "Софонија 3:17",
  },
  {
    text: "Увек се радујте, непрестано се молите, у свему захваљујте: јер је то воља Божја у Христу Исусу за вас.",
    ref: "Прва Солуњанима 5:16-18",
  },
  {
    text: "Иако прођем долином сенке смртне, не бојим се зла, јер си Ти са мном; штап Твој и палица Твоја утешавају ме.",
    ref: "Псалм 23:4",
  },
  {
    text: "Јер сте благодаћу спасени, кроз веру; и то није из вас, дар је Божји.",
    ref: "Ефесцима 2:8",
  },
  {
    text: "Тражите прво царство Божје и правду Његову, и све ово ће вам се додати.",
    ref: "Матеј 6:33",
  },
  {
    text: "А сада остаје вера, нада, љубав, ово троје; а највећа од тих је љубав.",
    ref: "Прва Коринћанима 13:13",
  },
  {
    text: "Ово је дан који учини Господ, радујмо се и веселимо се у Њему.",
    ref: "Псалм 118:24",
  },
  {
    text: "Реч Твоја је светиљка нози мојој и светлост стази мојој.",
    ref: "Псалм 119:105",
  },
  {
    text: "Мир Божји, који превазилази сваки ум, чуваће срца ваша и мисли ваше у Христу Исусу.",
    ref: "Филипљанима 4:7",
  },
  {
    text: "Блажени чисти срцем, јер ће они Бога видети.",
    ref: "Матеј 5:8",
  },
  {
    text: "Ако Бог с нама, ко је против нас?",
    ref: "Римљанима 8:31",
  },
  {
    text: "Будите добри и милосрдни међу собом, праштајте један другоме, као што је и Бог у Христу опростио вама.",
    ref: "Ефесцима 4:32",
  },
  {
    text: "Господ благословио тебе и сачувао те; Господ осветлио лице Своје на тебе и помиловао те.",
    ref: "Бројеви 6:24-25",
  },
  {
    text: "Не бој се, јер сам Ја с тобом; не плаши се, јер Ја сам Бог твој; ојачао сам те и помогао ти.",
    ref: "Исаија 41:10",
  },
  {
    text: "Свете књиге читај целим својим срцем јер ћеш из њих научити задобијање врлина и твоја душа ће бити испуњена радошћу и весељем.",
    ref: "Св. Ефрем Синајски",
  },
  {
    text: "Границе између православља и јереси су исписане крвљу.",
    ref: "Старац Јероним Светогорац",
  },
  {
    text: "Вера је једини благословени темељ живота личног и живота друштвеног и уређења државног.",
    ref: "Св. Николај Жички",
  },
  {
    text: "Слобода која искључује сваку могућност да погазимо добро – јесте савршена и Божанска.",
    ref: "Св. Филарет Московски",
  },
  {
    text: "Ни један пријатељ злата никад није постао пријатељ Христа или људи.",
    ref: "Св. Јован Златоусти",
  },
  {
    text: "Исправна вера не користи ништа ако је живот искварен.",
    ref: "Св. Јован Златоусти",
  },
  {
    text: "Када је труд на нашој страни одсутан тада и Божија помоћ престаје.",
    ref: "Св. Јован Златоусти",
  },
  {
    text: "Не напуштај вољу Божију да би испунио вољу људи.",
    ref: "Преп. Антоније Велики",
  },
  {
    text: "Мала знања добијају се учењем, велика знања добијају се вером и поштењем.",
    ref: "Св. Николај Жички",
  },
  {
    text: "Када би било корисно знати будућност, онда то Бог не би сакрио од нас.",
    ref: "Св. Јован Златоусти",
  },
  {
    text: "Направи твој дом Црквом, јер ти ћеш одговарати за душе твоје деце и свих оних који обитавају у њему.",
    ref: "Св. Јован Златоусти",
  },
  {
    text: "Никада не ради ништа нечасно, макар се то многима допада, и не напуштај добро дело, макар да је оно мрско блуднима.",
    ref: "Св. Григорије Богослов",
  },
];

function getDailyVerseIndex(): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
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
    "Недеља",
    "Понедељак",
    "Уторак",
    "Среда",
    "Четвртак",
    "Петак",
    "Субота",
  ];
  const months = [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
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
            paddingTop: topPadding + 8,
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

        <View style={styles.verseWrapper}>
          <Animated.View style={[styles.verseCard, { opacity: fadeAnim }]}>
            <View style={styles.verseLabelRow}>
              <FontAwesome5
                name="bible"
                size={13}
                color={Colors.gold}
                style={{ marginRight: 7 }}
              />
              <Text style={styles.verseLabelText}>СТИХ ДАНА</Text>
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
              {"\u201E"}
              {verse.text}
              {"\u201C"}
            </Text>
            <Text style={styles.refText}>{verse.ref}</Text>
          </Animated.View>
        </View>
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
    marginBottom: 0,
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
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
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
    marginBottom: 0,
  },
  verseWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  verseCard: {
    backgroundColor: "rgba(15, 22, 38, 0.85)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.18)",
    padding: 24,
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
});
