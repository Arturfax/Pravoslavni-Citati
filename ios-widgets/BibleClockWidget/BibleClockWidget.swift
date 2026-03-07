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

// MARK: - Timeline Provider

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
        var entries: [BibleClockEntry] = []
        let currentDate = Date()

        for offset in 0..<60 {
            guard let entryDate = Calendar.current.date(byAdding: .minute, value: offset, to: currentDate) else { continue }
            let v = getVerse(for: entryDate)
            entries.append(BibleClockEntry(date: entryDate, verseText: v.text, verseRef: v.ref))
        }

        let refreshDate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate) ?? currentDate
        completion(Timeline(entries: entries, policy: .after(refreshDate)))
    }
}

// MARK: - Shared helpers

private func timeString(from date: Date) -> String {
    let f = DateFormatter()
    f.dateFormat = "HH:mm"
    return f.string(from: date)
}

private let navy   = Color(red: 0.04, green: 0.05, blue: 0.09)
private let cream  = Color(red: 0.94, green: 0.92, blue: 0.84)
private let gold   = Color(red: 0.79, green: 0.66, blue: 0.30)
private let creamDim = Color(red: 0.94, green: 0.92, blue: 0.84).opacity(0.78)

// MARK: - Home Screen Widget Views

struct HomeSmallView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            navy
            VStack(spacing: 6) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(gold)
                Text(timeString(from: entry.date))
                    .font(.system(size: 44, weight: .bold, design: .rounded))
                    .foregroundColor(cream)
                    .minimumScaleFactor(0.7)
                Text(entry.verseRef)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(gold)
                    .multilineTextAlignment(.center)
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
            HStack(spacing: 14) {
                VStack(spacing: 6) {
                    Image(systemName: "cross.fill")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(gold)
                    Text(timeString(from: entry.date))
                        .font(.system(size: 40, weight: .bold, design: .rounded))
                        .foregroundColor(cream)
                    Text(entry.verseRef)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(gold)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: 110)

                Rectangle()
                    .fill(gold.opacity(0.3))
                    .frame(width: 1)
                    .padding(.vertical, 8)

                Text("„\(entry.verseText)"")
                    .font(.system(size: 12))
                    .italic()
                    .foregroundColor(creamDim)
                    .lineLimit(6)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(14)
        }
    }
}

struct HomeLargeView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            navy
            VStack(spacing: 0) {
                VStack(spacing: 4) {
                    Image(systemName: "cross.fill")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(gold)
                        .padding(.bottom, 4)
                    Text(timeString(from: entry.date))
                        .font(.system(size: 64, weight: .bold, design: .rounded))
                        .foregroundColor(cream)
                }
                .padding(.top, 18)

                Rectangle()
                    .fill(gold.opacity(0.25))
                    .frame(height: 1)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 16)

                Text("„\(entry.verseText)"")
                    .font(.system(size: 16))
                    .italic()
                    .foregroundColor(creamDim)
                    .multilineTextAlignment(.center)
                    .lineSpacing(5)
                    .padding(.horizontal, 20)

                Spacer()

                Text(entry.verseRef)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(gold)
                    .padding(.bottom, 18)
            }
        }
    }
}

// MARK: - Home Screen Widget Entry View

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

// MARK: - Lock Screen Widget Views

/// Inline: thin single line at the very top of the lock screen
struct LockInlineView: View {
    let entry: BibleClockEntry
    var body: some View {
        Text("\(timeString(from: entry.date))  \(entry.verseRef)")
            .font(.system(size: 12, weight: .medium))
    }
}

/// Rectangular: wide bar below the clock — best for showing the verse
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

/// Circular: small circle in the corners of the lock screen
struct LockCircularView: View {
    let entry: BibleClockEntry
    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            VStack(spacing: 1) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 9, weight: .bold))
                Text(timeString(from: entry.date))
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .minimumScaleFactor(0.8)
            }
        }
    }
}

// MARK: - Lock Screen Widget Entry View

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

/// Home screen widget (small / medium / large)
struct BibleClockHomeWidget: Widget {
    let kind: String = "BibleClockHomeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleClockProvider()) { entry in
            HomeWidgetEntryView(entry: entry)
                .containerBackground(navy, for: .widget)
        }
        .configurationDisplayName("Библијски сат")
        .description("Тренутно време и дневни православни стих.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

/// Lock screen widget (inline / rectangular / circular)
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

// MARK: - Bundle (combines both widgets)

@main
struct BibleClockWidgetBundle: WidgetBundle {
    var body: some Widget {
        BibleClockHomeWidget()
        BibleClockLockWidget()
    }
}
