import WidgetKit
import SwiftUI

// MARK: - Verses

private let verses: [(text: String, ref: String)] = [
    // ─── OLD TESTAMENT ─────────────────────────────────────────────────
    ("Јер ја знам мисли које мислим за вас, говори Господ, мисли мирне а не зле, да вам дам будућност и наду.", "Јеремија 29:11"),
    ("Господ је пастир мој, ништа ми не недостаје. На зеленим пашњацима Он ме одмара, поред тихих вода Он ме води.", "Псалм 23:1-2"),
    ("Уздај се у Господа свим срцем својим и немој се ослањати на разум свој.", "Пословице 3:5-6"),
    ("Будите храбри и јаки, не бојте се, јер Господ Бог твој иде с тобом.", "Пон. закон 31:6"),
    ("Господ је светлост моја и спасење моје, кога ћу се бојати?", "Псалм 27:1"),
    ("Иако прођем долином сенке смртне, не бојим се зла, јер си Ти са мном.", "Псалм 23:4"),
    ("Хвалите Господа јер је добар, јер је вечна милост Његова.", "Псалм 107:1"),
    ("Ово је дан који учини Господ, радујмо се и веселимо се у Њему.", "Псалм 118:24"),
    ("Реч Твоја је светиљка нози мојој и светлост стази мојој.", "Псалм 119:105"),
    ("Не бој се, јер сам Ја с тобом; не плаши се, јер Ја сам Бог твој.", "Исаија 41:10"),
    ("А они који чекају на Господа добиваће нову снагу, расти ће крилима као орлови.", "Исаија 40:31"),
    ("Господ благословио тебе и сачувао те; Господ осветлио лице Своје на тебе.", "Бројеви 6:24-25"),
    ("Господ Бог твој је с тобом, силни Спаситељ.", "Софонија 3:17"),
    ("У почетку створи Бог небо и земљу.", "Постање 1:1"),
    ("И створи Бог човека по обличју Своме, по обличју Божјем створи га.", "Постање 1:27"),
    ("Тражите Господа док се може наћи, зовите Га док је близу.", "Исаија 55:6"),
    ("Јер мисли моје нису ваше мисли, нити су ваши путеви моји путеви, говори Господ.", "Исаија 55:8"),
    ("Чувај срце своје изнад свега чега чуваш, јер из њега излази живот.", "Пословице 4:23"),
    ("Почетак мудрости је страх Господњи, и познавање Светога је разум.", "Пословице 9:10"),
    ("Праведник пада седам пута и устаје, а безбожници падају у зло.", "Пословице 24:16"),
    ("Благо народу коме је Господ Бог, племену које је Он изабрао себи за наследство.", "Псалм 33:12"),
    ("Окусите и видите како је добар Господ; благо човеку који се узда у Њега.", "Псалм 34:8"),
    ("Као што кошута жуди за водом текућом, тако душа моја жуди за Тобом, Боже.", "Псалм 42:1"),
    ("Станите и познајте да сам Ја Бог.", "Псалм 46:10"),
    ("Срце чисто створи у мени, Боже, и дух прав обнови у мени.", "Псалм 51:10"),
    ("Бацај на Господа бригу своју и Он ће те прехранити.", "Псалм 55:22"),
    ("Боже, Ти си Бог мој, Тебе тражим од ране зоре; жедна је Тебе душа моја.", "Псалм 63:1"),
    ("Који си Ти што прашташ безакоње и пролазиш преко преступа.", "Михеј 7:18"),
    ("Ко ће нас раставити од љубави Христове?", "Римљанима 8:35"),
    ("Господе, Ти ми испитујеш и знаш. Ти знаш кад седам и кад устанем.", "Псалм 139:1-2"),
    ("Зар се може заборавити жена одојчета свога? А да би оне и заборавиле, Ја тебе нећу заборавити.", "Исаија 49:15"),
    ("Знај данас да је Господ Бог, горе на небу и доле на земљи, и нема другога.", "Пон. закон 4:39"),
    ("Господу Богу своме клањај се и Њему јединоме служи.", "Пон. закон 6:13"),
    ("Добро је да се надаш и мирно чекаш спасење Господње.", "Плач Јер. 3:26"),
    ("И вратићу вам године које поједоше скакавци.", "Јоило 2:25"),
    ("Не стој далеко, врати се к мени, говори Господ.", "Јеремија 3:12"),
    ("Небеса казују славу Божију и дело руку Његових гласи свод небески.", "Псалм 19:1"),
    ("Господе, утврди кораке моје у речи Твојој.", "Псалм 119:133"),
    ("Велики је Господ наш и велика је сила Његова, и разуму Његовом нема мере.", "Псалм 147:5"),
    ("Помозите сиротоме, браните удовицу; правда је ваша потреба.", "Исаија 1:17"),

    // ─── NEW TESTAMENT ─────────────────────────────────────────────────
    ("Јер тако Бог возљуби свет да је Сина Свога јединородног дао.", "Јован 3:16"),
    ("Дођите к мени сви уморни и натоварени и ја ћу вас одморити.", "Матеј 11:28"),
    ("Не брините ни за шта, него у свему молитвом износите жеље своје пред Бога.", "Филипљанима 4:6"),
    ("Сву бригу своју баците на Њега, јер Он брине за вас.", "1. Петрова 5:7"),
    ("Увек се радујте, непрестано се молите, у свему захваљујте.", "1. Солуњ. 5:16-18"),
    ("Јер сте благодаћу спасени, кроз веру — дар је Божји.", "Ефесцима 2:8"),
    ("Тражите прво царство Божје и правду Његову, и све ово ће вам се додати.", "Матеј 6:33"),
    ("А сада остаје вера, нада, љубав — највећа је љубав.", "1. Коринћ. 13:13"),
    ("Мир Божји, који превазилази сваки ум, чуваће срца ваша у Христу Исусу.", "Филипљанима 4:7"),
    ("Блажени чисти срцем, јер ће они Бога видети.", "Матеј 5:8"),
    ("Ако Бог с нама, ко је против нас?", "Римљанима 8:31"),
    ("Будите добри и милосрдни међу собом, праштајте један другоме.", "Ефесцима 4:32"),
    ("Ја сам пут и истина и живот; нико не долази к Оцу осим кроз Мене.", "Јован 14:6"),
    ("Ја сам светлост света; ко иде за Мном неће ходити у тами.", "Јован 8:12"),
    ("Ја сам лоза а ви прутови. Ко остаје у Мени и Ја у њему, он доноси много рода.", "Јован 15:5"),
    ("Мир вам остављам, мир Свој вам дајем; не дајем вам га као што свет даје.", "Јован 14:27"),
    ("Ово вам рекох да у Мени мир имате. У свету ћете имати невоље; али не бојте се, Ја сам победио свет.", "Јован 16:33"),
    ("Нова заповест вам дајем: да љубите један другога.", "Јован 13:34"),
    ("Тако да светли ваша светлост пред људима, да виде ваша добра дела.", "Матеј 5:16"),
    ("Ишћите и даће вам се; тражите и наћи ћете; куцајте и отвориће вам се.", "Матеј 7:7"),
    ("Блажени миротворци, јер ће се синови Божји назвати.", "Матеј 5:9"),
    ("Блажени гладни и жедни правде, јер ће се наситити.", "Матеј 5:6"),
    ("Блажени милостиви, јер ће бити помиловани.", "Матеј 5:7"),
    ("Не судите да вам се не суди. Јер каквим судом судите, таквим ће вам се судити.", "Матеј 7:1-2"),
    ("Све што желите да вама чине људи, чините и ви њима.", "Матеј 7:12"),
    ("Марта, Марта, бринеш се и узнемируј за много, а само је једно потребно.", "Лука 10:41-42"),
    ("Јер Син Човечји дође да потражи и спасе изгубљено.", "Лука 19:10"),
    ("Не бој се, мало стадо, јер вашем Оцу би по вољи да вам да Царство.", "Лука 12:32"),
    ("Бива радост пред анђелима Божјим за једнога грешника који се покаје.", "Лука 15:10"),
    ("Јер где је благо ваше, ту ће бити и срце ваше.", "Лука 12:34"),
    ("Љубите непријатеље своје, чините добро онима који вас мрзе.", "Матеј 5:44"),
    ("Живим, али не ја, него живи у мени Христос.", "Галатима 2:20"),
    ("А плод Духа је: љубав, радост, мир, трпљење, благост, доброта, вера, кротост, уздржање.", "Галатима 5:22-23"),
    ("Све могу у Христу Исусу који ме јача.", "Филипљанима 4:13"),
    ("Имајте међу собом исте мисли које и у Христу Исусу.", "Филипљанима 2:5"),
    ("Вера је потврда онога чему се надамо, доказ ствари које не видимо.", "Јеврејима 11:1"),
    ("Бог је љубав, и ко остаје у љубави, у Богу остаје и Бог у њему остаје.", "1. Јованова 4:16"),
    ("У љубави нема страха, него савршена љубав изгони страх.", "1. Јованова 4:18"),
    ("Плата за грех је смрт, а дар Божји је живот вечни у Христу Исусу.", "Римљанима 6:23"),
    ("А знамо да онима који љубе Бога све иде на добро.", "Римљанима 8:28"),
    ("Ни смрт, ни живот, ни анђели не могу нас раставити од љубави Божје.", "Римљанима 8:38-39"),
    ("Не побеђуј се злом, него побеђуј зло добром.", "Римљанима 12:21"),
    ("Радујте се с радоснима и плачите с плачнима.", "Римљанима 12:15"),
    ("Ако признајеш устима Господа Исуса и верујеш у срцу да Га Бог подиже из мртвих, бићеш спасен.", "Римљанима 10:9"),
    ("Јер свако ко призове име Господње спасће се.", "Римљанима 10:13"),
    ("Сада видимо као кроз стакло, у загонетки, а онда ћемо лицем к лицу.", "1. Коринћ. 13:12"),
    ("Љубав дуго трпи, благотвори, љубав не завиди, не велича се, не надима се.", "1. Коринћ. 13:4"),
    ("Бдите, стојте у вери, мужајте се, будите јаки. Све да вам буде с љубављу.", "1. Коринћ. 16:13-14"),
    ("Ако је ко у Христу, нова је твар; старо прође, гле, све ново постаде.", "2. Коринћ. 5:17"),
    ("Довољна ти је Моја благодат, јер се сила Моја у слабости показује савршеном.", "2. Коринћ. 12:9"),
    ("Облачите се у свега оружја Божјега.", "Ефесцима 6:11"),
    ("Ево, стојим на вратима и куцам; ако ко чује глас Мој и отвори врата, ући ћу к њему.", "Откривење 3:20"),
    ("И обрисаће Бог сваку сузу из очију њихових, и смрти неће више бити.", "Откривење 21:4"),
    ("Ја сам Алфа и Омега, почетак и свршетак, говори Господ Бог.", "Откривење 1:8"),
    ("У кући Оца Мога има много станова. Идем да вам приправим место.", "Јован 14:2"),
    ("Ускрснуо је! Није овде. Ево места где су Га положили.", "Марко 16:6"),
    ("Ако зрно пшенично не падне у земљу и не умре, остаје само; ако ли умре, рађа много рода.", "Јован 12:24"),
    ("Ви сте со земље. Ви сте светлост света.", "Матеј 5:13-14"),
    ("Не можете Богу служити и мамону.", "Матеј 6:24"),
    ("Покајте се, јер се приближило Царство Небеско.", "Матеј 4:17"),
    ("Научите од Мене, јер сам кротак и смиран срцем, и наћи ћете покој душама вашим.", "Матеј 11:29"),
    ("Ко хоће да спасе душу своју, изгубиће је; а ко изгуби душу своју Мене ради, наћи ће је.", "Матеј 16:25"),
    ("Где су два или три сабрана у име Моје, ту сам и Ја међу њима.", "Матеј 18:20"),
    ("Ако имате вере колико зрно горушичино, ништа вам неће бити немогуће.", "Матеј 17:20"),
    ("Данас ћеш бити са Мном у рају.", "Лука 23:43"),
    ("Оче, опрости им, јер не знају шта чине.", "Лука 23:34"),

    // ─── СВЕТИ ОЦИ И ПОДВИЖНИЦИ ────────────────────────────────────────
    ("Свете књиге читај целим срцем јер ћеш научити задобијање врлина.", "Св. Ефрем Сирин"),
    ("Границе између православља и јереси су исписане крвљу.", "Старац Јероним Светогорац"),
    ("Вера је једини благословени темељ живота личног и живота друштвеног.", "Св. Николај Жички"),
    ("Слобода која искључује сваку могућност да погазимо добро – јесте савршена и Божанска.", "Св. Филарет Московски"),
    ("Ни један пријатељ злата никад није постао пријатељ Христа или људи.", "Св. Јован Златоусти"),
    ("Исправна вера не користи ништа ако је живот искварен.", "Св. Јован Златоусти"),
    ("Када је труд на нашој страни одсутан тада и Божија помоћ престаје.", "Св. Јован Златоусти"),
    ("Не напуштај вољу Божију да би испунио вољу људи.", "Преп. Антоније Велики"),
    ("Мала знања добијају се учењем, велика знања добијају се вером и поштењем.", "Св. Николај Жички"),
    ("Када би било корисно знати будућност, Бог то не би сакрио од нас.", "Св. Јован Златоусти"),
    ("Направи твој дом Црквом, јер ћеш одговарати за душе твоје деце.", "Св. Јован Златоусти"),
    ("Никада не ради ништа нечасно, макар се то многима допада.", "Св. Григорије Богослов"),
    ("Молитва је дисање душе. Као што тело не може живети без дисања, тако ни душа без молитве.", "Св. Григорије Палама"),
    ("Стекни мирнодушност и хиљаде око тебе ће се спасти.", "Преп. Серафим Саровски"),
    ("Праву радост можеш осетити само онда кад живиш у складу са Богом.", "Преп. Серафим Саровски"),
    ("Бог не тражи од нас велика дела, него велику љубав у малим делима.", "Преп. Серафим Саровски"),
    ("Циљ хришћанског живота је стицање Духа Светога.", "Преп. Серафим Саровски"),
    ("Вера без дела је мртва, али и дела без вере су мртва.", "Св. Василије Велики"),
    ("Бог нас не присиљава на добро; Он хоће да добровољно приступимо врлини.", "Св. Василије Велики"),
    ("Не одлажи покајање за сутра, јер не знаш да ли ће ти сутрашњи дан бити дат.", "Св. Василије Велики"),
    ("Ако затвориш уста, Бог ће ти отворити ум.", "Св. Василије Велики"),
    ("Молитва је оружје велико, благо неисцрпно, богатство које никада не пропада.", "Св. Јован Златоусти"),
    ("Ако хоћеш да извршиш освету над непријатељем, молчи.", "Преп. Амвросије Оптински"),
    ("Туга и бол уче човека да мисли.", "Преп. Амвросије Оптински"),
    ("Не тражи савршенство у земаљским учитељима. Следи само Христа.", "Преп. Јустин Поповић"),
    ("Човек без Бога је лудак, макар био геније.", "Преп. Јустин Поповић"),
    ("Сав живот на земљи је школа вечности.", "Преп. Јустин Поповић"),
    ("Живети за Христа значи умрети за овај свет. Умрети за Христа значи живети за вечност.", "Преп. Јустин Поповић"),
    ("Вера се не доказује, вера се живи.", "Преп. Јустин Поповић"),
    ("Господе, помилуј мене грешнога.", "Молитва Исусова"),
    ("Ко се моли само кад се моли, тај се никада не моли.", "Св. Августин"),
    ("Бог шапуће у нашим радостима, говори у нашој савести, али виче у нашим боловима.", "Св. Августин"),
    ("Немирно је срце наше док се не смири у Теби, Господе.", "Св. Августин"),
    ("Понизност је мајка свих врлина.", "Св. Јован Лествичник"),
    ("Мирнодушност је врата Небеска.", "Старац Тадеј Витовнички"),
    ("Какве су нам мисли, такав нам је и живот.", "Старац Тадеј Витовнички"),
    ("Мир у души не зависи од околности, него од нашег односа према Богу.", "Старац Тадеј Витовнички"),
    ("Наше мисли управљају нашим животом. Зато треба мислити добро.", "Старац Тадеј Витовнички"),
    ("Кад неко не води рачуна о својим мислима, он не може водити рачуна ни о свом животу.", "Старац Тадеј Витовнички"),
    ("Трпљење је највиша врлина. Без трпљења нема спасења.", "Старац Тадеј Витовнички"),
    ("Немој се плашити, дете моје. Бог те воли. Само Му веруј.", "Старац Пајсије Светогорац"),
    ("Бог дозвољава искушења да нас очисти, а не да нас уништи.", "Старац Пајсије Светогорац"),
    ("Где је понизност, ту је и благодат Божија.", "Старац Пајсије Светогорац"),
    ("Кад се човек смири, тада Бог почиње да ради у његовом срцу.", "Старац Пајсије Светогорац"),
    ("Не тражи од Бога да промени околности, него да ти промени срце.", "Старац Пајсије Светогорац"),
    ("Смирење је темељ духовног живота. Без смирења, свака врлина је лажна.", "Преп. Исак Сирин"),
    ("Ћутање је тајна будућег века, а речи су оруђе овога света.", "Преп. Исак Сирин"),
    ("Истински мудар човек је онај ко је Христом обогаћен.", "Св. Григорије Богослов"),
    ("Зови ме, Оче, и ја ћу Те звати, Боже мој.", "Св. Николај Жички"),
    ("Молитва је мост између човека и Бога.", "Св. Николај Жички"),
    ("Ко много говори, тај мало зна; ко мало говори а много ради, тај зна много.", "Св. Николај Жички"),
    ("Душа без молитве је као риба без воде.", "Св. Николај Жички"),
    ("Човече, ти си путник на земљи. Не заборави свој прави дом — Небеско Царство.", "Св. Николај Жички"),
    ("Бог нам шаље тешкоће не да нас сломи, него да нас учврсти.", "Св. Николај Жички"),
    ("Срби су народ Божји, народ за Христа и уз Христа.", "Св. Николај Жички"),
    ("Горко је сваког зла семе, али је слатко покајање.", "Авва Мојсије"),
    ("Седи у ћелији својој и она ће те научити свему.", "Авва Мојсије"),
    ("Ако видиш да ти брат греши, немој га осуђивати, него се моли за њега.", "Авва Пимен"),
    ("Не учи друге оном што сам ниси научио.", "Авва Пимен"),
    ("Не бој се, Бог те никад неће оставити. Он те је створио и Он те воли.", "Авва Доротеј"),
    ("Све чини са мером и у мери ћеш наћи мир.", "Авва Пимен"),
    ("Побеђуј зло добротом, мржњу љубављу, лаж истином.", "Преп. Антоније Велики"),
    ("Ко познаје себе, познаје Бога.", "Преп. Антоније Велики"),
    ("Мудар човек је онај који се ослобађа грехова и усрдно се моли Богу.", "Преп. Антоније Велики"),
    ("Не привлачи те свет, него твоја везаност за свет.", "Преп. Максим Исповедник"),
    ("Прави пост није само уздржавање од хране, него уздржавање од зла.", "Св. Јован Златоусти"),
    ("Ничега се не плаши осим греха.", "Св. Јован Златоусти"),
    ("Смирење је непобедиво оружје хришћанина.", "Преп. Теофан Затворник"),
    ("Духовни живот тражи непрестану борбу са самим собом.", "Преп. Теофан Затворник"),
    ("Свет је књига Божија; читај је срцем.", "Преп. Теофан Затворник"),
    ("Све препусти Богу и нека Он води. Ти само иди за Њим.", "Преп. Теофан Затворник"),
    ("Крст није казна. Крст је пут спасења.", "Св. Игнатије Брјанчанинов"),
    ("Трпи, прашта и моли се. То је цео закон хришћанског живота.", "Св. Игнатије Брјанчанинов"),
    ("Господ боравиште има у тихим и смиреним срцима.", "Св. Јефрем Сирин"),
    ("Чувај се од греха и не брини се за сутрашњи дан.", "Св. Јефрем Сирин"),

    // ─── СВЕТИ САВА И СРПСКИ СВЕТИТЕЉИ ─────────────────────────────────
    ("Крстом се бранимо, крстом се поносимо, крст нам је путоказ и заштита.", "Св. Сава Српски"),
    ("Ко год верује у Христа, тај нека зна да Христос верује у њега.", "Св. Сава Српски"),
    ("Православље је вера отаца наших; чувајмо је и живимо је.", "Св. Сава Српски"),
    ("Нека се потруде синови отечества свога да очувају оно што им је Господ даровао.", "Св. Сава Српски"),
    ("У крсту је спасење, у крсту је живот, у крсту је заштита од непријатеља.", "Св. Сава Српски"),
    ("Јер шта вреди човеку ако сав свет добије а душу своју изгуби?", "Матеј 16:26"),
    ("Узан је пут који води у живот, и мало их је који га налазе.", "Матеј 7:14"),
    ("Ако те ко удари по десном образу, окрени му и други.", "Матеј 5:39"),
    ("Будите савршени, као што је савршен Отац ваш небески.", "Матеј 5:48"),
    ("Отац ваш зна шта вам треба пре него Га замолите.", "Матеј 6:7-8"),
    ("Погледајте на птице небеске, не сеју, не жању, а Отац ваш небески их храни.", "Матеј 6:26"),
    ("Не бринте се за сутрашњи дан. Доста је сваком дану зло његово.", "Матеј 6:34"),
    ("Ко год се понизи као ово дете, тај је највећи у Царству Небеском.", "Матеј 18:4"),
    ("Јер многи су позвани, а мало избраних.", "Матеј 22:14"),
    ("Небо и земља ће проћи, али речи Моје неће проћи.", "Матеј 24:35"),
    ("И ево, Ја сам с вама у све дане до свршетка века.", "Матеј 28:20"),
    ("Верни у малом и у многом су верни.", "Лука 16:10"),
    ("Ја сам васкрсење и живот; ко верује у Мене ако и умре живеће.", "Јован 11:25"),
    ("Ја сам хлеб живота; ко долази к Мени неће огладнети.", "Јован 6:35"),
    ("Истина ће вас ослободити.", "Јован 8:32"),
    ("Нико нема веће љубави од ове: да ко положи живот свој за пријатеље своје.", "Јован 15:13"),
]

private let appGroupId = "group.com.pravoslavnicitati.app"
private let pinnedIndexKey = "selectedVerseIndex"
private let pinnedTextKey = "selectedVerseText"
private let pinnedRefKey = "selectedVerseRef"

private func normalizedVerseIndex(_ index: Int) -> Int {
    ((index % verses.count) + verses.count) % verses.count
}

private func getPinnedVerse(from defaults: UserDefaults?) -> (text: String, ref: String)? {
    guard let defaults else {
        return nil
    }

    if let text = defaults.string(forKey: pinnedTextKey),
       let ref = defaults.string(forKey: pinnedRefKey),
       !text.isEmpty,
       !ref.isEmpty {
        return (text, ref)
    }

    guard defaults.object(forKey: pinnedIndexKey) != nil else {
        return nil
    }

    let index = defaults.integer(forKey: pinnedIndexKey)
    return verses[normalizedVerseIndex(index)]
}

private func getVerse(for date: Date) -> (text: String, ref: String) {
    let defaults = UserDefaults(suiteName: appGroupId)
    if let pinnedVerse = getPinnedVerse(from: defaults) {
        return pinnedVerse
    }
    let calendar = Calendar.current
    let dayOfYear = calendar.ordinality(of: .day, in: .year, for: date) ?? 1
    return verses[(dayOfYear - 1) % verses.count]
}

// MARK: - Timeline Entry

struct BibleVerseEntry: TimelineEntry {
    let date: Date
    let verseText: String
    let verseRef: String
}

// MARK: - Timeline Provider

struct BibleVerseProvider: TimelineProvider {
    func placeholder(in context: Context) -> BibleVerseEntry {
        let v = getVerse(for: Date())
        return BibleVerseEntry(date: Date(), verseText: v.text, verseRef: v.ref)
    }

    func getSnapshot(in context: Context, completion: @escaping (BibleVerseEntry) -> Void) {
        let v = getVerse(for: Date())
        completion(BibleVerseEntry(date: Date(), verseText: v.text, verseRef: v.ref))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<BibleVerseEntry>) -> Void) {
        let now = Date()
        let v = getVerse(for: now)
        let entry = BibleVerseEntry(date: now, verseText: v.text, verseRef: v.ref)

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

// MARK: - Widget Theme

private let midnightInk = Color(red: 0.035, green: 0.045, blue: 0.075)
private let cathedralBlue = Color(red: 0.065, green: 0.095, blue: 0.155)
private let candleBurgundy = Color(red: 0.16, green: 0.08, blue: 0.105)
private let cream = Color(red: 0.94, green: 0.91, blue: 0.82)
private let parchment = Color(red: 0.96, green: 0.93, blue: 0.84)
private let parchmentDeep = Color(red: 0.84, green: 0.77, blue: 0.62)
private let gold = Color(red: 0.84, green: 0.68, blue: 0.29)
private let brightGold = Color(red: 0.96, green: 0.84, blue: 0.43)
private let antiqueGold = Color(red: 0.54, green: 0.38, blue: 0.10)
private let warmInk = Color(red: 0.18, green: 0.13, blue: 0.08)

private struct HomeWidgetTheme {
    let background: Color
    let gradientTop: Color
    let gradientMiddle: Color
    let gradientBottom: Color
    let quoteColor: Color
    let titleColor: Color
    let secondaryTextColor: Color
    let accentColor: Color
    let accentHighlight: Color
    let borderColor: Color
    let hairlineColor: Color
    let separatorColor: Color
    let illustrationColor: Color
    let shadowColor: Color
    let lockTextColor: Color
    let lockSecondaryColor: Color

    static let dark = HomeWidgetTheme(
        background: midnightInk,
        gradientTop: cathedralBlue,
        gradientMiddle: candleBurgundy,
        gradientBottom: midnightInk,
        quoteColor: cream,
        titleColor: brightGold,
        secondaryTextColor: cream.opacity(0.76),
        accentColor: gold,
        accentHighlight: brightGold,
        borderColor: gold.opacity(0.72),
        hairlineColor: cream.opacity(0.18),
        separatorColor: gold.opacity(0.36),
        illustrationColor: gold.opacity(0.58),
        shadowColor: .black,
        lockTextColor: cream,
        lockSecondaryColor: brightGold
    )

    static let light = HomeWidgetTheme(
        background: parchment,
        gradientTop: Color(red: 0.995, green: 0.975, blue: 0.91),
        gradientMiddle: parchment,
        gradientBottom: parchmentDeep,
        quoteColor: warmInk,
        titleColor: antiqueGold,
        secondaryTextColor: warmInk.opacity(0.68),
        accentColor: antiqueGold,
        accentHighlight: Color(red: 0.78, green: 0.56, blue: 0.16),
        borderColor: antiqueGold.opacity(0.46),
        hairlineColor: .white.opacity(0.62),
        separatorColor: antiqueGold.opacity(0.30),
        illustrationColor: antiqueGold.opacity(0.38),
        shadowColor: Color(red: 0.34, green: 0.25, blue: 0.12),
        lockTextColor: warmInk,
        lockSecondaryColor: antiqueGold
    )
}

private struct HomeWidgetBackgroundView: View {
    let theme: HomeWidgetTheme
    let family: WidgetFamily

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [theme.gradientTop, theme.gradientMiddle, theme.gradientBottom],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            GeometryReader { proxy in
                let width = proxy.size.width
                let height = proxy.size.height
                let gap: CGFloat = family == .systemSmall ? 22 : 32

                Path { path in
                    for offset in stride(from: -height, through: width, by: gap) {
                        path.move(to: CGPoint(x: offset, y: height))
                        path.addLine(to: CGPoint(x: offset + height, y: 0))
                    }
                }
                .stroke(theme.hairlineColor.opacity(0.34), lineWidth: 0.7)
            }
            .opacity(family == .systemSmall ? 0.32 : 0.42)

            LinearGradient(
                colors: [
                    .clear,
                    theme.background.opacity(0.18),
                    theme.shadowColor.opacity(0.20)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        }
    }
}

private func quoteText(
    _ text: String,
    size: CGFloat,
    color: Color = cream,
    alignment: TextAlignment = .center,
    lineSpacing: CGFloat = 0
) -> some View {
    Text("\u{201E}\(text)\u{201C}")
        .font(.system(size: size))
        .italic()
        .foregroundColor(color)
        .multilineTextAlignment(alignment)
        .lineSpacing(lineSpacing)
        .allowsTightening(true)
        .fixedSize(horizontal: false, vertical: true)
}

private func homeQuoteText(
    _ text: String,
    size: CGFloat,
    color: Color,
    alignment: TextAlignment,
    lineSpacing: CGFloat,
    lineLimit: Int
) -> some View {
    Text("\u{201E}\(text)\u{201C}")
        .font(.system(size: size, weight: .semibold, design: .rounded))
        .foregroundColor(color)
        .multilineTextAlignment(alignment)
        .lineSpacing(lineSpacing)
        .lineLimit(lineLimit)
        .allowsTightening(true)
        .minimumScaleFactor(0.74)
        .fixedSize(horizontal: false, vertical: true)
}

private func addArch(to path: inout Path, x: CGFloat, width: CGFloat, top: CGFloat, bottom: CGFloat) {
    let radius = width / 2
    path.move(to: CGPoint(x: x, y: bottom))
    path.addLine(to: CGPoint(x: x, y: top + radius))
    path.addArc(
        center: CGPoint(x: x + radius, y: top + radius),
        radius: radius,
        startAngle: .degrees(180),
        endAngle: .degrees(0),
        clockwise: false
    )
    path.addLine(to: CGPoint(x: x + width, y: bottom))
}

private func addLineCross(to path: inout Path, centerX: CGFloat, baseY: CGFloat, size: CGFloat) {
    path.move(to: CGPoint(x: centerX, y: baseY))
    path.addLine(to: CGPoint(x: centerX, y: baseY - size))
    path.move(to: CGPoint(x: centerX - size * 0.3, y: baseY - size * 0.62))
    path.addLine(to: CGPoint(x: centerX + size * 0.3, y: baseY - size * 0.62))
}

private func addArchedWindow(to path: inout Path, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
    let radius = width / 2
    let arcTop = y + radius
    path.move(to: CGPoint(x: x, y: y + height))
    path.addLine(to: CGPoint(x: x, y: arcTop))
    path.addArc(
        center: CGPoint(x: x + radius, y: arcTop),
        radius: radius,
        startAngle: .degrees(180),
        endAngle: .degrees(0),
        clockwise: false
    )
    path.addLine(to: CGPoint(x: x + width, y: y + height))
}

private func addRosette(to path: inout Path, centerX: CGFloat, centerY: CGFloat, radius: CGFloat) {
    path.addEllipse(
        in: CGRect(
            x: centerX - radius,
            y: centerY - radius,
            width: radius * 2,
            height: radius * 2
        )
    )
}

private func addDomeOutline(
    to path: inout Path,
    leftX: CGFloat,
    rightX: CGFloat,
    baseY: CGFloat,
    apexY: CGFloat
) {
    let centerX = (leftX + rightX) / 2
    let controlInset = (rightX - leftX) * 0.16

    path.move(to: CGPoint(x: leftX, y: baseY))
    path.addQuadCurve(
        to: CGPoint(x: centerX, y: apexY),
        control: CGPoint(x: leftX + controlInset, y: apexY + (baseY - apexY) * 0.14)
    )
    path.addQuadCurve(
        to: CGPoint(x: rightX, y: baseY),
        control: CGPoint(x: rightX - controlInset, y: apexY + (baseY - apexY) * 0.14)
    )
}

private struct OrthodoxCrossIcon: View {
    let topColor: Color
    let bottomColor: Color

    var body: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let height = proxy.size.height
            let minSide = min(width, height)
            let stemWidth = minSide * 0.18
            let armHeight = minSide * 0.18
            let armY = height * 0.37
            let endSize = minSide * 0.21
            let lobeSize = minSide * 0.16
            let fill = LinearGradient(
                colors: [topColor, bottomColor],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            ZStack {
                Capsule(style: .continuous)
                    .fill(fill)
                    .frame(width: stemWidth, height: height * 0.76)
                    .position(x: width * 0.5, y: height * 0.56)

                Capsule(style: .continuous)
                    .fill(fill)
                    .frame(width: width * 0.72, height: armHeight)
                    .position(x: width * 0.5, y: armY)

                Group {
                    Circle()
                        .fill(fill)
                        .frame(width: endSize, height: endSize)
                        .position(x: width * 0.5, y: height * 0.10)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.44, y: height * 0.16)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.56, y: height * 0.16)

                    Circle()
                        .fill(fill)
                        .frame(width: endSize, height: endSize)
                        .position(x: width * 0.10, y: armY)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.16, y: armY - height * 0.06)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.16, y: armY + height * 0.06)

                    Circle()
                        .fill(fill)
                        .frame(width: endSize, height: endSize)
                        .position(x: width * 0.90, y: armY)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.84, y: armY - height * 0.06)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.84, y: armY + height * 0.06)

                    Circle()
                        .fill(fill)
                        .frame(width: endSize, height: endSize)
                        .position(x: width * 0.5, y: height * 0.90)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.44, y: height * 0.84)
                    Circle()
                        .fill(fill)
                        .frame(width: lobeSize, height: lobeSize)
                        .position(x: width * 0.56, y: height * 0.84)
                }
            }
            .shadow(color: bottomColor.opacity(0.18), radius: minSide * 0.05, y: minSide * 0.015)
        }
        .aspectRatio(0.82, contentMode: .fit)
    }
}

private struct CrossSeal: View {
    let theme: HomeWidgetTheme

    var body: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [
                            theme.hairlineColor.opacity(0.52),
                            theme.background.opacity(0.18)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Circle()
                .stroke(theme.borderColor.opacity(0.74), lineWidth: 0.9)

            Circle()
                .stroke(theme.hairlineColor.opacity(0.54), lineWidth: 0.6)
                .padding(4)

            OrthodoxCrossIcon(topColor: theme.accentHighlight, bottomColor: theme.accentColor)
                .padding(7)
        }
        .shadow(color: theme.shadowColor.opacity(0.18), radius: 7, x: 0, y: 3)
    }
}

private struct OrnamentalDivider: View {
    let theme: HomeWidgetTheme
    let compact: Bool

    var body: some View {
        HStack(spacing: compact ? 5 : 7) {
            Capsule(style: .continuous)
                .fill(theme.separatorColor)
            Circle()
                .fill(theme.accentColor.opacity(0.78))
                .frame(width: compact ? 3 : 4, height: compact ? 3 : 4)
            Capsule(style: .continuous)
                .fill(theme.separatorColor)
        }
        .frame(height: compact ? 3 : 4)
    }
}

private struct ChurchLineArt: View {
    let color: Color

    var body: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let height = proxy.size.height
            let outline = StrokeStyle(
                lineWidth: max(width * 0.008, 1),
                lineCap: .round,
                lineJoin: .round
            )
            let detail = StrokeStyle(
                lineWidth: max(width * 0.0048, 0.7),
                lineCap: .round,
                lineJoin: .round
            )
            let fine = StrokeStyle(
                lineWidth: max(width * 0.0028, 0.45),
                lineCap: .round,
                lineJoin: .round
            )

            ZStack {
                Path { path in
                    for (inset, y) in [(0.01, 0.98), (0.05, 0.92), (0.09, 0.87), (0.13, 0.82), (0.17, 0.77)] {
                        path.move(to: CGPoint(x: width * inset, y: height * y))
                        path.addLine(to: CGPoint(x: width * (1 - inset), y: height * y))
                    }

                    path.addRoundedRect(
                        in: CGRect(x: width * 0.08, y: height * 0.38, width: width * 0.16, height: height * 0.39),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.24, y: height * 0.41, width: width * 0.52, height: height * 0.36),
                        cornerSize: CGSize(width: width * 0.012, height: width * 0.012)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.76, y: height * 0.38, width: width * 0.16, height: height * 0.39),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )

                    path.move(to: CGPoint(x: width * 0.06, y: height * 0.41))
                    path.addLine(to: CGPoint(x: width * 0.94, y: height * 0.41))
                    path.move(to: CGPoint(x: width * 0.17, y: height * 0.45))
                    path.addLine(to: CGPoint(x: width * 0.83, y: height * 0.45))
                    path.move(to: CGPoint(x: width * 0.22, y: height * 0.48))
                    path.addLine(to: CGPoint(x: width * 0.78, y: height * 0.48))

                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.30,
                        rightX: width * 0.70,
                        baseY: height * 0.40,
                        apexY: height * 0.07
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.11,
                        rightX: width * 0.29,
                        baseY: height * 0.33,
                        apexY: height * 0.16
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.71,
                        rightX: width * 0.89,
                        baseY: height * 0.33,
                        apexY: height * 0.16
                    )

                    path.addRoundedRect(
                        in: CGRect(x: width * 0.37, y: height * 0.23, width: width * 0.26, height: height * 0.17),
                        cornerSize: CGSize(width: width * 0.014, height: width * 0.014)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.15, y: height * 0.26, width: width * 0.10, height: height * 0.07),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.75, y: height * 0.26, width: width * 0.10, height: height * 0.07),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )

                    path.addRoundedRect(
                        in: CGRect(x: width * 0.48, y: height * 0.12, width: width * 0.04, height: height * 0.08),
                        cornerSize: CGSize(width: width * 0.008, height: width * 0.008)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.185, y: height * 0.20, width: width * 0.03, height: height * 0.06),
                        cornerSize: CGSize(width: width * 0.006, height: width * 0.006)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.785, y: height * 0.20, width: width * 0.03, height: height * 0.06),
                        cornerSize: CGSize(width: width * 0.006, height: width * 0.006)
                    )

                    addArch(to: &path, x: width * 0.16, width: width * 0.12, top: height * 0.60, bottom: height * 0.77)
                    addArch(to: &path, x: width * 0.39, width: width * 0.22, top: height * 0.50, bottom: height * 0.77)
                    addArch(to: &path, x: width * 0.72, width: width * 0.12, top: height * 0.60, bottom: height * 0.77)
                    addArch(to: &path, x: width * 0.085, width: width * 0.055, top: height * 0.64, bottom: height * 0.77)
                    addArch(to: &path, x: width * 0.86, width: width * 0.055, top: height * 0.64, bottom: height * 0.77)
                }
                .stroke(color.opacity(0.78), style: outline)

                Path { path in
                    for y in [0.54, 0.63] {
                        path.move(to: CGPoint(x: width * 0.08, y: height * y))
                        path.addLine(to: CGPoint(x: width * 0.92, y: height * y))
                    }

                    for x in [0.24, 0.33, 0.42, 0.50, 0.58, 0.67, 0.76] {
                        path.move(to: CGPoint(x: width * x, y: height * 0.41))
                        path.addLine(to: CGPoint(x: width * x, y: height * 0.77))
                    }

                    for x in [0.12, 0.17, 0.22, 0.78, 0.83, 0.88] {
                        path.move(to: CGPoint(x: width * x, y: height * 0.38))
                        path.addLine(to: CGPoint(x: width * x, y: height * 0.77))
                    }

                    for x in stride(from: CGFloat(0.40), through: CGFloat(0.60), by: CGFloat(0.04)) {
                        path.move(to: CGPoint(x: width * x, y: height * 0.40))
                        path.addLine(to: CGPoint(x: width * 0.50, y: height * 0.09))
                    }
                    for x in [0.16, 0.20, 0.24, 0.76, 0.80, 0.84] {
                        path.move(to: CGPoint(x: width * x, y: height * 0.33))
                        path.addLine(to: CGPoint(x: width * (x < 0.5 ? 0.20 : 0.80), y: height * 0.18))
                    }

                    for x in stride(from: CGFloat(0.33), through: CGFloat(0.63), by: CGFloat(0.05)) {
                        addArchedWindow(
                            to: &path,
                            x: width * x,
                            y: height * 0.28,
                            width: width * 0.04,
                            height: height * 0.12
                        )
                    }
                    for y in [0.43, 0.56] {
                        for x in [0.10, 0.15, 0.19, 0.81, 0.85] {
                            addArchedWindow(
                                to: &path,
                                x: width * x,
                                y: height * y,
                                width: width * 0.045,
                                height: height * 0.13
                            )
                        }
                    }

                    addRosette(to: &path, centerX: width * 0.50, centerY: height * 0.57, radius: width * 0.055)
                    addRosette(to: &path, centerX: width * 0.30, centerY: height * 0.62, radius: width * 0.026)
                    addRosette(to: &path, centerX: width * 0.70, centerY: height * 0.62, radius: width * 0.026)

                    path.move(to: CGPoint(x: width * 0.26, y: height * 0.49))
                    path.addLine(to: CGPoint(x: width * 0.74, y: height * 0.49))
                    path.move(to: CGPoint(x: width * 0.31, y: height * 0.46))
                    path.addLine(to: CGPoint(x: width * 0.69, y: height * 0.46))
                    path.move(to: CGPoint(x: width * 0.20, y: height * 0.69))
                    path.addLine(to: CGPoint(x: width * 0.80, y: height * 0.69))

                    path.move(to: CGPoint(x: width * 0.39, y: height * 0.64))
                    path.addLine(to: CGPoint(x: width * 0.61, y: height * 0.64))
                    path.move(to: CGPoint(x: width * 0.39, y: height * 0.58))
                    path.addLine(to: CGPoint(x: width * 0.61, y: height * 0.58))

                    path.move(to: CGPoint(x: width * 0.47, y: height * 0.48))
                    path.addLine(to: CGPoint(x: width * 0.47, y: height * 0.77))
                    path.move(to: CGPoint(x: width * 0.53, y: height * 0.48))
                    path.addLine(to: CGPoint(x: width * 0.53, y: height * 0.77))

                    addLineCross(to: &path, centerX: width * 0.50, baseY: height * 0.12, size: height * 0.09)
                    addLineCross(to: &path, centerX: width * 0.20, baseY: height * 0.20, size: height * 0.07)
                    addLineCross(to: &path, centerX: width * 0.80, baseY: height * 0.20, size: height * 0.07)
                }
                .stroke(color.opacity(0.32), style: detail)

                Path { path in
                    for spoke in stride(from: CGFloat.zero, to: CGFloat.pi * 2, by: CGFloat.pi / 8) {
                        let center = CGPoint(x: width * 0.50, y: height * 0.57)
                        let inner = CGPoint(
                            x: center.x + cos(spoke) * width * 0.018,
                            y: center.y + sin(spoke) * width * 0.018
                        )
                        let outer = CGPoint(
                            x: center.x + cos(spoke) * width * 0.055,
                            y: center.y + sin(spoke) * width * 0.055
                        )
                        path.move(to: inner)
                        path.addLine(to: outer)
                    }

                    for x in [0.12, 0.17, 0.22, 0.78, 0.83, 0.88] {
                        path.move(to: CGPoint(x: width * x, y: height * 0.51))
                        path.addLine(to: CGPoint(x: width * x + width * 0.045, y: height * 0.51))
                    }

                    for x in stride(from: CGFloat(0.35), through: CGFloat(0.65), by: CGFloat(0.06)) {
                        path.move(to: CGPoint(x: width * x, y: height * 0.24))
                        path.addLine(to: CGPoint(x: width * x, y: height * 0.40))
                    }

                    path.move(to: CGPoint(x: width * 0.37, y: height * 0.36))
                    path.addLine(to: CGPoint(x: width * 0.63, y: height * 0.36))
                    path.move(to: CGPoint(x: width * 0.14, y: height * 0.31))
                    path.addLine(to: CGPoint(x: width * 0.26, y: height * 0.31))
                    path.move(to: CGPoint(x: width * 0.74, y: height * 0.31))
                    path.addLine(to: CGPoint(x: width * 0.86, y: height * 0.31))

                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.35,
                        rightX: width * 0.65,
                        baseY: height * 0.40,
                        apexY: height * 0.12
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.14,
                        rightX: width * 0.26,
                        baseY: height * 0.33,
                        apexY: height * 0.21
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.74,
                        rightX: width * 0.86,
                        baseY: height * 0.33,
                        apexY: height * 0.21
                    )
                }
                .stroke(color.opacity(0.14), style: fine)
            }
        }
    }
}

private struct SimpleChurchLineArt: View {
    let color: Color

    var body: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let height = proxy.size.height
            let outline = StrokeStyle(
                lineWidth: max(width * 0.009, 1),
                lineCap: .round,
                lineJoin: .round
            )
            let detail = StrokeStyle(
                lineWidth: max(width * 0.0048, 0.7),
                lineCap: .round,
                lineJoin: .round
            )

            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: width * 0.08, y: height * 0.78))
                    path.addLine(to: CGPoint(x: width * 0.92, y: height * 0.78))
                    path.move(to: CGPoint(x: width * 0.12, y: height * 0.68))
                    path.addLine(to: CGPoint(x: width * 0.88, y: height * 0.68))

                    path.addRoundedRect(
                        in: CGRect(x: width * 0.25, y: height * 0.43, width: width * 0.50, height: height * 0.35),
                        cornerSize: CGSize(width: width * 0.012, height: width * 0.012)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.11, y: height * 0.50, width: width * 0.16, height: height * 0.28),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )
                    path.addRoundedRect(
                        in: CGRect(x: width * 0.73, y: height * 0.50, width: width * 0.16, height: height * 0.28),
                        cornerSize: CGSize(width: width * 0.01, height: width * 0.01)
                    )

                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.30,
                        rightX: width * 0.70,
                        baseY: height * 0.43,
                        apexY: height * 0.14
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.13,
                        rightX: width * 0.27,
                        baseY: height * 0.50,
                        apexY: height * 0.31
                    )
                    addDomeOutline(
                        to: &path,
                        leftX: width * 0.73,
                        rightX: width * 0.87,
                        baseY: height * 0.50,
                        apexY: height * 0.31
                    )

                    addArch(to: &path, x: width * 0.41, width: width * 0.18, top: height * 0.58, bottom: height * 0.78)
                    addArch(to: &path, x: width * 0.17, width: width * 0.06, top: height * 0.63, bottom: height * 0.78)
                    addArch(to: &path, x: width * 0.77, width: width * 0.06, top: height * 0.63, bottom: height * 0.78)
                }
                .stroke(color.opacity(0.58), style: outline)

                Path { path in
                    path.move(to: CGPoint(x: width * 0.33, y: height * 0.52))
                    path.addLine(to: CGPoint(x: width * 0.67, y: height * 0.52))
                    path.move(to: CGPoint(x: width * 0.36, y: height * 0.47))
                    path.addLine(to: CGPoint(x: width * 0.64, y: height * 0.47))
                    path.move(to: CGPoint(x: width * 0.31, y: height * 0.68))
                    path.addLine(to: CGPoint(x: width * 0.69, y: height * 0.68))
                    path.move(to: CGPoint(x: width * 0.14, y: height * 0.61))
                    path.addLine(to: CGPoint(x: width * 0.26, y: height * 0.61))
                    path.move(to: CGPoint(x: width * 0.74, y: height * 0.61))
                    path.addLine(to: CGPoint(x: width * 0.86, y: height * 0.61))

                    for x in [0.38, 0.62] {
                        addArchedWindow(
                            to: &path,
                            x: width * x,
                            y: height * 0.55,
                            width: width * 0.055,
                            height: height * 0.13
                        )
                    }

                    path.move(to: CGPoint(x: width * 0.50, y: height * 0.43))
                    path.addLine(to: CGPoint(x: width * 0.50, y: height * 0.17))
                    path.move(to: CGPoint(x: width * 0.39, y: height * 0.43))
                    path.addQuadCurve(
                        to: CGPoint(x: width * 0.50, y: height * 0.17),
                        control: CGPoint(x: width * 0.42, y: height * 0.27)
                    )
                    path.move(to: CGPoint(x: width * 0.61, y: height * 0.43))
                    path.addQuadCurve(
                        to: CGPoint(x: width * 0.50, y: height * 0.17),
                        control: CGPoint(x: width * 0.58, y: height * 0.27)
                    )

                    addRosette(to: &path, centerX: width * 0.50, centerY: height * 0.60, radius: width * 0.028)

                    addLineCross(to: &path, centerX: width * 0.50, baseY: height * 0.16, size: height * 0.07)
                    addLineCross(to: &path, centerX: width * 0.20, baseY: height * 0.31, size: height * 0.045)
                    addLineCross(to: &path, centerX: width * 0.80, baseY: height * 0.31, size: height * 0.045)
                }
                .stroke(color.opacity(0.30), style: detail)
            }
        }
    }
}

// MARK: - Home Screen Views

struct HomeSmallView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        VStack(spacing: 0) {
            CrossSeal(theme: theme)
                .frame(width: 24, height: 24)

            Text("СТИХ ДАНА")
                .font(.system(size: 8.8, weight: .semibold, design: .rounded))
                .kerning(1.7)
                .foregroundColor(theme.titleColor)
                .padding(.top, 5)

            OrnamentalDivider(theme: theme, compact: true)
                .frame(width: 58)
                .padding(.top, 5)

            Spacer(minLength: 6)

            ViewThatFits(in: .vertical) {
                homeQuoteText(entry.verseText, size: 14, color: theme.quoteColor, alignment: .center, lineSpacing: 3, lineLimit: 5)
                homeQuoteText(entry.verseText, size: 13, color: theme.quoteColor, alignment: .center, lineSpacing: 3, lineLimit: 5)
                homeQuoteText(entry.verseText, size: 12, color: theme.quoteColor, alignment: .center, lineSpacing: 2, lineLimit: 5)
                homeQuoteText(entry.verseText, size: 11, color: theme.quoteColor, alignment: .center, lineSpacing: 2, lineLimit: 6)
                homeQuoteText(entry.verseText, size: 10, color: theme.quoteColor, alignment: .center, lineSpacing: 1, lineLimit: 6)
                homeQuoteText(entry.verseText, size: 9, color: theme.quoteColor, alignment: .center, lineSpacing: 1, lineLimit: 7)
            }
            .shadow(color: theme.shadowColor.opacity(0.18), radius: 4, x: 0, y: 1)
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            Spacer(minLength: 6)

            Text(entry.verseRef)
                .font(.system(size: 9.2, weight: .semibold, design: .rounded))
                .foregroundColor(theme.secondaryTextColor)
                .lineLimit(1)
                .minimumScaleFactor(0.74)
                .padding(.bottom, 1)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.horizontal, 17)
        .padding(.vertical, 15)
    }
}

struct HomeMediumView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            SimpleChurchLineArt(color: theme.illustrationColor)
                .frame(width: 176, height: 132)
                .offset(x: 44, y: 28)

            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .center, spacing: 10) {
                    CrossSeal(theme: theme)
                        .frame(width: 31, height: 31)

                    VStack(alignment: .leading, spacing: 5) {
                        Text("СТИХ ДАНА")
                            .font(.system(size: 10.4, weight: .semibold, design: .rounded))
                            .kerning(2.2)
                            .foregroundColor(theme.titleColor)

                        OrnamentalDivider(theme: theme, compact: true)
                            .frame(width: 84)
                    }

                    Spacer(minLength: 12)
                }

                Spacer(minLength: 10)

                ViewThatFits(in: .vertical) {
                    homeQuoteText(entry.verseText, size: 18.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 6, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 17.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 5, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 16.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 5, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 15.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 4, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 14.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 4, lineLimit: 5)
                    homeQuoteText(entry.verseText, size: 13.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 3, lineLimit: 5)
                    homeQuoteText(entry.verseText, size: 12.5, color: theme.quoteColor, alignment: .leading, lineSpacing: 3, lineLimit: 6)
                }
                .shadow(color: theme.shadowColor.opacity(0.16), radius: 5, x: 0, y: 2)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                .padding(.trailing, 106)

                Spacer(minLength: 10)

                Text(entry.verseRef)
                    .font(.system(size: 10.6, weight: .semibold, design: .rounded))
                    .foregroundColor(theme.secondaryTextColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.82)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }
}

struct HomeLargeView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        ZStack(alignment: .bottom) {
            SimpleChurchLineArt(color: theme.illustrationColor)
                .frame(width: 304, height: 244)
                .offset(y: 58)

            VStack(spacing: 0) {
                CrossSeal(theme: theme)
                    .frame(width: 48, height: 48)
                    .padding(.top, 8)

                Text("СТИХ ДАНА")
                    .font(.system(size: 13.2, weight: .semibold, design: .rounded))
                    .kerning(4)
                    .foregroundColor(theme.titleColor)
                    .padding(.top, 10)

                OrnamentalDivider(theme: theme, compact: false)
                    .frame(width: 150)
                    .padding(.top, 10)

                Spacer(minLength: 18)

                ViewThatFits(in: .vertical) {
                    homeQuoteText(entry.verseText, size: 25, color: theme.quoteColor, alignment: .center, lineSpacing: 8, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 23, color: theme.quoteColor, alignment: .center, lineSpacing: 7, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 21, color: theme.quoteColor, alignment: .center, lineSpacing: 6, lineLimit: 4)
                    homeQuoteText(entry.verseText, size: 19, color: theme.quoteColor, alignment: .center, lineSpacing: 5, lineLimit: 5)
                    homeQuoteText(entry.verseText, size: 17.5, color: theme.quoteColor, alignment: .center, lineSpacing: 4, lineLimit: 5)
                    homeQuoteText(entry.verseText, size: 16, color: theme.quoteColor, alignment: .center, lineSpacing: 4, lineLimit: 6)
                    homeQuoteText(entry.verseText, size: 14.5, color: theme.quoteColor, alignment: .center, lineSpacing: 3, lineLimit: 6)
                }
                .shadow(color: theme.shadowColor.opacity(0.18), radius: 7, x: 0, y: 2)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.horizontal, 28)

                Spacer(minLength: 24)

                HStack(spacing: 10) {
                    Capsule(style: .continuous)
                        .fill(theme.separatorColor)
                        .frame(minWidth: 18, maxWidth: .infinity)
                        .frame(height: 1)
                        .layoutPriority(0)

                    Text(entry.verseRef)
                        .font(.system(size: 11.4, weight: .semibold, design: .rounded))
                        .foregroundColor(theme.secondaryTextColor)
                        .lineLimit(1)
                        .minimumScaleFactor(0.62)
                        .allowsTightening(true)
                        .layoutPriority(2)

                    Capsule(style: .continuous)
                        .fill(theme.separatorColor)
                        .frame(minWidth: 18, maxWidth: .infinity)
                        .frame(height: 1)
                        .layoutPriority(0)
                }
                .frame(maxWidth: .infinity)
                .padding(.horizontal, 18)
                .padding(.bottom, 6)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
    }
}

// MARK: - Lock Screen Views

struct LockInlineView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        Text("✝ \(entry.verseRef)")
            .font(.system(size: 12, weight: .semibold, design: .rounded))
            .foregroundColor(theme.lockTextColor)
    }
}

struct LockRectangularView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(theme.lockSecondaryColor)

                Text(entry.verseRef)
                    .font(.system(size: 8.6, weight: .semibold, design: .rounded))
                    .foregroundColor(theme.lockSecondaryColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }

            ViewThatFits(in: .vertical) {
                quoteText(entry.verseText, size: 12.5, color: theme.lockTextColor, alignment: .leading, lineSpacing: 1)
                quoteText(entry.verseText, size: 11.5, color: theme.lockTextColor, alignment: .leading, lineSpacing: 1)
                quoteText(entry.verseText, size: 10.5, color: theme.lockTextColor, alignment: .leading, lineSpacing: 1)
                quoteText(entry.verseText, size: 9.5, color: theme.lockTextColor, alignment: .leading, lineSpacing: 0)
                quoteText(entry.verseText, size: 8.5, color: theme.lockTextColor, alignment: .leading, lineSpacing: 0)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(.vertical, 2)
    }
}

struct LockCircularView: View {
    let entry: BibleVerseEntry
    fileprivate let theme: HomeWidgetTheme

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            Circle()
                .stroke(theme.lockSecondaryColor.opacity(0.48), lineWidth: 1)
                .padding(3)

            VStack(spacing: 3) {
                Image(systemName: "cross.fill")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(theme.lockSecondaryColor)

                Text(entry.verseRef)
                    .font(.system(size: 7.8, weight: .semibold, design: .rounded))
                    .foregroundColor(theme.lockTextColor)
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
    var entry: BibleVerseEntry
    @Environment(\.widgetFamily) var family
    @Environment(\.colorScheme) var colorScheme

    private var theme: HomeWidgetTheme {
        colorScheme == .light ? .light : .dark
    }

    var body: some View {
        Group {
            switch family {
            case .systemSmall:  HomeSmallView(entry: entry, theme: theme)
            case .systemMedium: HomeMediumView(entry: entry, theme: theme)
            case .systemLarge:  HomeLargeView(entry: entry, theme: theme)
            default:            HomeSmallView(entry: entry, theme: theme)
            }
        }
        .containerBackground(for: .widget) {
            HomeWidgetBackgroundView(theme: theme, family: family)
        }
    }
}

struct LockWidgetEntryView: View {
    var entry: BibleVerseEntry
    @Environment(\.widgetFamily) var family
    @Environment(\.colorScheme) var colorScheme

    private var theme: HomeWidgetTheme {
        colorScheme == .light ? .light : .dark
    }

    var body: some View {
        switch family {
        case .accessoryInline:      LockInlineView(entry: entry, theme: theme)
        case .accessoryRectangular: LockRectangularView(entry: entry, theme: theme)
        case .accessoryCircular:    LockCircularView(entry: entry, theme: theme)
        default:                    LockRectangularView(entry: entry, theme: theme)
        }
    }
}

// MARK: - Widget Configurations

struct BibleHomeWidget: Widget {
    let kind: String = "BibleHomeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleVerseProvider()) { entry in
            HomeWidgetEntryView(entry: entry)
        }
        .contentMarginsDisabled()
        .configurationDisplayName("Стих дана")
        .description("Дневни православни стих.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct BibleLockWidget: Widget {
    let kind: String = "BibleLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BibleVerseProvider()) { entry in
            LockWidgetEntryView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .contentMarginsDisabled()
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
struct BibleWidgetBundle: WidgetBundle {
    var body: some Widget {
        BibleHomeWidget()
        BibleLockWidget()
    }
}
