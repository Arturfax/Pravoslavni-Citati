import WidgetKit
import SwiftUI

// MARK: - Verses

private let verses: [(text: String, ref: String)] = [
    ("Јер ја знам мисли које мислим за вас, говори Господ, мисли мирне а не зле, да вам дам будућност и наду.", "Јеремија 29:11"),
    ("Господ је пастир мој, ништа ми не недостаје.", "Псалм 23:1"),
    ("Уздај се у Господа свим срцем својим и немој се ослањати на разум свој.", "Пословице 3:5"),
    ("Будите храбри и јаки, не бојте се, јер Господ Бог твој иде с тобом.", "Пон. закон 31:6"),
    ("Јер тако Бог возљуби свет да је Сина Свога јединородног дао.", "Јован 3:16"),
    ("Господ је светлост моја и спасење моје, кога ћу се бојати?", "Псалм 27:1"),
    ("Дођите к мени сви уморни и натоварени и ја ћу вас одморити.", "Матеј 11:28"),
    ("Не брините ни за шта, него у свему молитвом износите жеље своје пред Бога.", "Филипљанима 4:6"),
    ("А они који чекају на Господа добиваће нову снагу, расти ће крилима као орлови.", "Исаија 40:31"),
    ("Хвалите Господа јер је добар, јер је вечна милост Његова.", "Псалм 107:1"),
    ("Сву бригу своју баците на Њега, јер Он брине за вас.", "1. Петрова 5:7"),
    ("Мир Божји, који превазилази сваки ум, чуваће срца ваша у Христу Исусу.", "Филипљанима 4:7"),
    ("Блажени чисти срцем, јер ће они Бога видети.", "Матеј 5:8"),
    ("Ако Бог с нама, ко је против нас?", "Римљанима 8:31"),
    ("Реч Твоја је светиљка нози мојој и светлост стази мојој.", "Псалм 119:105"),
    ("Ово је дан који учини Господ, радујмо се и веселимо се у Њему.", "Псалм 118:24"),
    ("Тражите прво царство Божје и правду Његову, и све ово ће вам се додати.", "Матеј 6:33"),
    ("А сада остаје вера, нада, љубав — највећа је љубав.", "1. Коринћ. 13:13"),
    ("Не бој се, јер сам Ја с тобом; не плаши се, јер Ја сам Бог твој.", "Исаија 41:10"),
    ("Господ благословио тебе и сачувао те; Господ осветлио лице Своје на тебе.", "Бројеви 6:24-25"),
    ("Увек се радујте, непрестано се молите, у свему захваљујте.", "1. Солуњ. 5:16-18"),
    ("Јер сте благодаћу спасени, кроз веру — дар је Божји.", "Ефесцима 2:8"),
    ("Иако прођем долином сенке смртне, не бојим се зла, јер си Ти са мном.", "Псалм 23:4"),
    ("Будите добри и милосрдни међу собом, праштајте један другоме.", "Ефесцима 4:32"),
    ("Господ Бог твој је с тобом, силни Спаситељ.", "Софонија 3:17"),
]

private func getVerse(for date: Date) -> (text: String, ref: String) {
    let calendar = Calendar.current
    let dayOfYear = calendar.ordinality(of: .day, in: .year, for: date) ?? 1
    return verses[(dayOfYear - 1) % verses.count]
}

// MARK: - Timeline Entry

struct BibleClockEntry: TimelineEntry {
    let date: Date
    let verseText: String
    let verseRef: String
}

// MARK: - Timeline Provider (updates daily at midnight)

struct BibleClockProvider: TimelineProvider {
    func placeholder(in context: Context) -> BibleClockEntry {
        let v = getVerse(for: Date())
        return BibleClockEntry(date: Date(), verseText: v.text, verseRef: v.ref)
    }

    func getSnapshot(in context: Context, completion: @escaping (BibleClockEntry) -> Void) {
        let v = getVerse(for: Date())
        completion(BibleClockEntry(date: Date(), verseText: v.text, verseRef: v.ref))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<BibleClockEntry>) -> Void) {
        let now = Date()
        let v = getVerse(for: now)
        let entry = BibleClockEntry(date: now, verseText: v.text, verseRef: v.ref)

        // Refresh at next midnight so verse changes each day
        var components = Calendar.current.dateComponents([.year, .month, .day], from: now)
        components.day! += 1
        components.hour = 0
        components.minute = 0
        components.second = 0
        let nextMidnight = Calendar.current.date(from: components) ?? now

        let timeline = Timeline(entries: [entry], policy: .after(nextMidnight))
        completion(timeline)
    }
}

// MARK: - Colors

private let navy    = Color(red: 0.04, green: 0.05, blue: 0.09)
private let cream   = Color(red: 0.94, green: 0.92, blue: 0.84)
private let gold    = Color(red: 0.79, green: 0.66, blue: 0.30)
private let creamDim = Color(red: 0.94, green: 0.92, blue: 0.84).opacity(0.80)

// MARK: - Home Screen Views (only verse, no time)

struct HomeSmallView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            navy
            VStack(spacing: 10) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(gold)
                Text("„\(entry.verseText)"")
                    .font(.system(size: 11))
                    .italic()
                    .foregroundColor(cream)
                    .multilineTextAlignment(.center)
                    .lineLimit(5)
                Text(entry.verseRef)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(gold)
            }
            .padding(12)
        }
    }
}

struct HomeMediumView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            navy
            VStack(spacing: 10) {
                HStack(spacing: 6) {
                    Image(systemName: "cross.fill")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(gold)
                    Text("СТИХ ДАНА")
                        .font(.system(size: 10, weight: .semibold))
                        .kerning(1.4)
                        .foregroundColor(gold)
                }
                Text("„\(entry.verseText)"")
                    .font(.system(size: 13))
                    .italic()
                    .foregroundColor(cream)
                    .multilineTextAlignment(.center)
                    .lineLimit(4)
                Text(entry.verseRef)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(gold)
            }
            .padding(16)
        }
    }
}

struct HomeLargeView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            navy
            VStack(spacing: 0) {
                Spacer()
                Image(systemName: "cross.fill")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(gold)
                    .padding(.bottom, 16)

                Text("„\(entry.verseText)"")
                    .font(.system(size: 17))
                    .italic()
                    .foregroundColor(cream)
                    .multilineTextAlignment(.center)
                    .lineSpacing(6)
                    .padding(.horizontal, 20)

                Rectangle()
                    .fill(gold.opacity(0.3))
                    .frame(height: 1)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 18)

                Text(entry.verseRef)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(gold)
                Spacer()
            }
        }
    }
}

// MARK: - Lock Screen Views (only verse, no time)

struct LockInlineView: View {
    let entry: BibleClockEntry
    var body: some View {
        Text("✝ \(entry.verseRef)")
            .font(.system(size: 12, weight: .medium))
    }
}

struct LockRectangularView: View {
    let entry: BibleClockEntry
    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack(spacing: 5) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 9, weight: .bold))
                Text(entry.verseRef)
                    .font(.system(size: 11, weight: .bold))
            }
            Text(entry.verseText)
                .font(.system(size: 11))
                .lineLimit(2)
                .truncationMode(.tail)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct LockCircularView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            VStack(spacing: 2) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 11, weight: .bold))
                Text(entry.verseRef)
                    .font(.system(size: 8, weight: .semibold))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .minimumScaleFactor(0.7)
            }
            .padding(4)
        }
    }
}

// MARK: - Entry Views

struct HomeWidgetEntryView: View {
    var entry: BibleClockEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:  HomeSmallView(entry: entry)
        case .systemMedium: HomeMediumView(entry: entry)
        case .systemLarge:  HomeLargeView(entry: entry)
        default:            HomeSmallView(entry: entry)
        }
    }
}

struct LockWidgetEntryView: View {
    var entry: BibleClockEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryInline:      LockInlineView(entry: entry)
        case .accessoryRectangular: LockRectangularView(entry: entry)
        case .accessoryCircular:    LockCircularView(entry: entry)
        default:                    LockRectangularView(entry: entry)
        }
    }
}

// MARK: - Widget Configurations

struct BibleClockHomeWidget: Widget {
    let kind: String = "BibleClockHomeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleClockProvider()) { entry in
            HomeWidgetEntryView(entry: entry)
                .containerBackground(navy, for: .widget)
        }
        .configurationDisplayName("Стих дана")
        .description("Дневни православни стих.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct BibleClockLockWidget: Widget {
    let kind: String = "BibleClockLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleClockProvider()) { entry in
            LockWidgetEntryView(entry: entry)
                .containerBackground(.widgetBackground, for: .widget)
        }
        .configurationDisplayName("Стих дана — закључани екран")
        .description("Дневни православни стих на закључаном екрану.")
        .supportedFamilies([
            .accessoryInline,
            .accessoryRectangular,
            .accessoryCircular
        ])
    }
}

// MARK: - Bundle

@main
struct BibleClockWidgetBundle: WidgetBundle {
    var body: some Widget {
        BibleClockHomeWidget()
        BibleClockLockWidget()
    }
}
