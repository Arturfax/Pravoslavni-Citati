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

        // One entry per minute for the next 60 minutes
        for offset in 0..<60 {
            guard let entryDate = Calendar.current.date(byAdding: .minute, value: offset, to: currentDate) else { continue }
            let v = getVerse(for: entryDate)
            entries.append(BibleClockEntry(date: entryDate, verseText: v.text, verseRef: v.ref))
        }

        let refreshDate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate) ?? currentDate
        let timeline = Timeline(entries: entries, policy: .after(refreshDate))
        completion(timeline)
    }
}

// MARK: - Colors

private let navy = Color(red: 0.04, green: 0.05, blue: 0.09)
private let cream = Color(red: 0.94, green: 0.92, blue: 0.84)
private let gold = Color(red: 0.79, green: 0.66, blue: 0.30)
private let creamFaded = Color(red: 0.94, green: 0.92, blue: 0.84).opacity(0.75)

// MARK: - Time Formatter

private func timeString(from date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    return formatter.string(from: date)
}

// MARK: - Widget Views

struct AccessoryInlineView: View {
    let entry: BibleClockEntry
    var body: some View {
        Text("\(timeString(from: entry.date))  \(entry.verseRef)")
            .font(.system(size: 12, weight: .medium))
    }
}

struct AccessoryRectangularView: View {
    let entry: BibleClockEntry
    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack(spacing: 6) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 10, weight: .semibold))
                Text(timeString(from: entry.date))
                    .font(.system(size: 17, weight: .bold, design: .rounded))
            }
            Text(entry.verseText)
                .font(.system(size: 11))
                .lineLimit(2)
            Text(entry.verseRef)
                .font(.system(size: 10, weight: .semibold))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct AccessoryCircularView: View {
    let entry: BibleClockEntry
    var body: some View {
        VStack(spacing: 1) {
            Image(systemName: "cross.fill")
                .font(.system(size: 10, weight: .bold))
            Text(timeString(from: entry.date))
                .font(.system(size: 14, weight: .bold, design: .rounded))
        }
    }
}

struct SystemSmallView: View {
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
            }
            .padding(12)
        }
    }
}

struct SystemMediumView: View {
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
                    .fill(gold.opacity(0.25))
                    .frame(width: 1)
                    .padding(.vertical, 8)

                Text("„\(entry.verseText)"")
                    .font(.system(size: 12))
                    .italic()
                    .foregroundColor(creamFaded)
                    .lineLimit(6)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(14)
        }
    }
}

struct SystemLargeView: View {
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
                    .foregroundColor(creamFaded)
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

// MARK: - Entry View

struct BibleClockWidgetEntryView: View {
    var entry: BibleClockProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryInline:
            AccessoryInlineView(entry: entry)
        case .accessoryRectangular:
            AccessoryRectangularView(entry: entry)
        case .accessoryCircular:
            AccessoryCircularView(entry: entry)
        case .systemSmall:
            SystemSmallView(entry: entry)
        case .systemMedium:
            SystemMediumView(entry: entry)
        case .systemLarge:
            SystemLargeView(entry: entry)
        default:
            SystemSmallView(entry: entry)
        }
    }
}

// MARK: - Widget Configuration

@main
struct BibleClockWidget: Widget {
    let kind: String = "BibleClockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleClockProvider()) { entry in
            BibleClockWidgetEntryView(entry: entry)
                .containerBackground(navy, for: .widget)
        }
        .configurationDisplayName("Библијски сат")
        .description("Тренутно време и дневни православни стих.")
        .supportedFamilies([
            .systemSmall,
            .systemMedium,
            .systemLarge,
            .accessoryInline,
            .accessoryRectangular,
            .accessoryCircular
        ])
    }
}

// MARK: - Preview

#Preview(as: .systemMedium) {
    BibleClockWidget()
} timeline: {
    BibleClockEntry(
        date: .now,
        verseText: "Господ је светлост моја и спасење моје, кога ћу се бојати?",
        verseRef: "Псалм 27:1"
    )
}
