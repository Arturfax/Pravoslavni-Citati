import WidgetKit
import SwiftUI

// MARK: - Data

struct BibleVerse {
    let text: String
    let ref: String
}

private let verses: [BibleVerse] = [
    BibleVerse(text: "Јер ја знам мисли које мислим за вас, говори Господ, мисли мирне а не зле, да вам дам будућност и наду.", ref: "Јеремија 29:11"),
    BibleVerse(text: "Господ је пастир мој, ништа ми не недостаје. На зеленим пашњацима Он ме одмара, поред тихих вода Он ме води.", ref: "Псалм 23:1-2"),
    BibleVerse(text: "Уздај се у Господа свим срцем својим и немој се ослањати на разум свој; у свим путевима својим познавај Га, и Он ће управљати стазама твојим.", ref: "Пословице 3:5-6"),
    BibleVerse(text: "Будите храбри и јаки, не бојте се и не плашите их се, јер Господ Бог твој иде с тобом, неће те оставити нити ће те напустити.", ref: "Поновљени закон 31:6"),
    BibleVerse(text: "Јер тако Бог возљуби свет да је Сина Свога јединородног дао, да сваки ко Га вјерује не погине него да има живот вјечни.", ref: "Јован 3:16"),
    BibleVerse(text: "Господ је светлост моја и спасење моје, кога ћу се бојати? Господ је јачина живота мојега, кога ћу се уплашити?", ref: "Псалм 27:1"),
    BibleVerse(text: "Дођите к мени сви уморни и натоварени и ја ћу вас одморити.", ref: "Матеј 11:28"),
    BibleVerse(text: "Не брините ни за шта, него у свему молитвом и мољењем са захваљивањем износите жеље своје пред Бога.", ref: "Филипљанима 4:6"),
    BibleVerse(text: "А они који чекају на Господа добиваће нову снагу, расти ће крилима као орлови, трчати ће и неће се уморити, ходити ће и неће клонути.", ref: "Исаија 40:31"),
    BibleVerse(text: "Хвалите Господа јер је добар, јер је вечна милост Његова.", ref: "Псалм 107:1"),
    BibleVerse(text: "Сву бригу своју баците на Њега, јер Он брине за вас.", ref: "Прва Петрова 5:7"),
    BibleVerse(text: "Господ Бог твој је с тобом, силни Спаситељ. Он ће се радовати теби са радошћу, обновити ће те у љубави Својој, клицаће над тобом с радошћу.", ref: "Софонија 3:17"),
    BibleVerse(text: "Увек се радујте, непрестано се молите, у свему захваљујте: јер је то воља Божја у Христу Исусу за вас.", ref: "Прва Солуњанима 5:16-18"),
    BibleVerse(text: "Иако прођем долином сенке смртне, не бојим се зла, јер си Ти са мном; штап Твој и палица Твоја утешавају ме.", ref: "Псалм 23:4"),
    BibleVerse(text: "Јер сте благодаћу спасени, кроз веру; и то није из вас, дар је Божји.", ref: "Ефесцима 2:8"),
    BibleVerse(text: "Тражите прво царство Божје и правду Његову, и све ово ће вам се додати.", ref: "Матеј 6:33"),
    BibleVerse(text: "А сада остаје вера, нада, љубав, ово троје; а највећа од тих је љубав.", ref: "Прва Коринћанима 13:13"),
    BibleVerse(text: "Ово је дан који учини Господ, радујмо се и веселимо се у Њему.", ref: "Псалм 118:24"),
    BibleVerse(text: "Реч Твоја је светиљка нози мојој и светлост стази мојој.", ref: "Псалм 119:105"),
    BibleVerse(text: "Мир Божји, који превазилази сваки ум, чуваће срца ваша и мисли ваше у Христу Исусу.", ref: "Филипљанима 4:7"),
    BibleVerse(text: "Блажени чисти срцем, јер ће они Бога видети.", ref: "Матеј 5:8"),
    BibleVerse(text: "Ако Бог с нама, ко је против нас?", ref: "Римљанима 8:31"),
    BibleVerse(text: "Будите добри и милосрдни међу собом, праштајте један другоме, као што је и Бог у Христу опростио вама.", ref: "Ефесцима 4:32"),
    BibleVerse(text: "Господ благословио тебе и сачувао те; Господ осветлио лице Своје на тебе и помиловао те.", ref: "Бројеви 6:24-25"),
    BibleVerse(text: "Не бој се, јер сам Ја с тобом; не плаши се, јер Ја сам Бог твој; ојачао сам те и помогао ти.", ref: "Исаија 41:10"),
]

private func dailyVerse() -> BibleVerse {
    let day = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
    return verses[(day - 1) % verses.count]
}

// MARK: - Timeline

struct VerseEntry: TimelineEntry {
    let date: Date
    let verse: BibleVerse
}

struct VerseProvider: TimelineProvider {
    func placeholder(in context: Context) -> VerseEntry {
        VerseEntry(date: .now, verse: verses[0])
    }

    func getSnapshot(in context: Context, completion: @escaping (VerseEntry) -> Void) {
        completion(VerseEntry(date: .now, verse: dailyVerse()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VerseEntry>) -> Void) {
        let entry = VerseEntry(date: .now, verse: dailyVerse())
        let nextMidnight = Calendar.current.date(
            byAdding: .day, value: 1,
            to: Calendar.current.startOfDay(for: .now)
        )!
        completion(Timeline(entries: [entry], policy: .after(nextMidnight)))
    }
}

// MARK: - Colors

private let darkBg  = Color(red: 4/255,   green: 7/255,   blue: 16/255)
private let gold    = Color(red: 201/255, green: 168/255, blue: 76/255)

// MARK: - Views

struct VerseWidgetView: View {
    let entry: VerseEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack(alignment: .center, spacing: family == .systemSmall ? 6 : 10) {
            Text("\u{201E}\(entry.verse.text)\u{201C}")
                .font(.system(size: verseSize, design: .serif))
                .italic()
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.55)
                .lineLimit(family == .systemSmall ? 7 : 15)
                .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)

            Text(entry.verse.ref)
                .font(.system(size: refSize, weight: .semibold))
                .foregroundStyle(gold)
                .multilineTextAlignment(.center)
                .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
        }
        .padding(padding)
    }

    private var verseSize: CGFloat {
        switch family {
        case .systemSmall:  return 11
        case .systemMedium: return 13
        default:            return 16
        }
    }

    private var refSize: CGFloat {
        switch family {
        case .systemSmall: return 9
        default:           return 12
        }
    }

    private var padding: CGFloat {
        switch family {
        case .systemSmall: return 10
        default:           return 16
        }
    }
}

// MARK: - Widget

@main
struct BibleWidget: Widget {
    let kind = "BibleDailyVerse"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VerseProvider()) { entry in
            if #available(iOS 26.0, *) {
                VerseWidgetView(entry: entry)
                    .containerBackground(.clear, for: .widget)
                    .glassEffect(in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            } else if #available(iOS 17.0, *) {
                VerseWidgetView(entry: entry)
                    .containerBackground(.clear, for: .widget)
            } else {
                ZStack {
                    darkBg
                    VerseWidgetView(entry: entry)
                }
            }
        }
        .configurationDisplayName("Стих Дана")
        .description("Дневни православни библијски стих.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
