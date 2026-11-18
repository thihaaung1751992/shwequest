/** Levelled reading for free-1 section "Any" (A1/A2 + B1/B2 + C1/C2 tabs). */

export type FreeLessonReadingLevelId = "a1-a2" | "b1-b2" | "c1-c2";

export type FreeLessonReadingVocab = {
  term: string;
  meaning: string;
};

export type FreeLessonReadingExample = {
  en: string;
  my?: string;
};

export type FreeLessonReadingExampleGroup = {
  title: string;
  titleMy: string;
  items: FreeLessonReadingExample[];
};

export type FreeLessonReadingAnyFocus = {
  heading: string;
  headingMy?: string;
  /** Short intro under the Focus on Any heading (often MY). */
  introMy?: string;
  questions?: FreeLessonReadingExampleGroup;
  negatives?: FreeLessonReadingExampleGroup;
  affirmative?: FreeLessonReadingExampleGroup;
  /** Extra / advanced pattern groups (e.g. C1/C2 numbered Any uses). */
  groups?: FreeLessonReadingExampleGroup[];
};

export type FreeLessonReadingLevel = {
  id: FreeLessonReadingLevelId;
  label: string;
  /** Orange band above the story title, e.g. "A1 / A2 Level Reading". */
  bandLabel?: string;
  /** When true, tab shows a Coming soon empty state. */
  empty?: boolean;
  title?: string;
  titleMy?: string;
  paragraphs?: string[];
  /** Optional label before vocab / comprehension / Any focus. */
  practiceHeading?: string;
  vocabulary?: {
    heading: string;
    headingMy?: string;
    items: FreeLessonReadingVocab[];
  };
  /** Reading comprehension questions (not Any-grammar examples). */
  comprehension?: {
    heading: string;
    headingMy?: string;
    items: string[];
  };
  anyFocus?: FreeLessonReadingAnyFocus;
};

export type FreeLessonReading = {
  kicker: string;
  levels: FreeLessonReadingLevel[];
};

export const FREE_1_ANY_READING: FreeLessonReading = {
  kicker: "Reading",
  levels: [
    {
      id: "a1-a2",
      label: "A1/A2",
      bandLabel: "A1 / A2 Level Reading",
      title: "Shopping for a Party",
      titleMy: "ပါတီအတွက် ဈေးဝယ်ခြင်း",
      paragraphs: [
        "Tom and Lucy are at the supermarket. They want to make a small party tonight, but they don't have any food at home.",
        '"Do we have any drinks?" Tom asks.',
        '"No, we don\'t have any drinks," Lucy says. "We need to buy some."',
        'They walk to the drinks section. "You can choose any drink you like," Tom says. "I like orange juice."',
        "Next, Lucy looks for a chocolate cake, but she can't find it anywhere.",
        '"Does anyone work here?" she asks. She looks around, but she doesn\'t see anyone.',
        'Finally, a shop worker comes. "Can I help you?" he asks.',
        '"Yes," Tom says. "We can\'t find any chocolate cakes. Do you have any?"',
        '"I am sorry," the worker says. "We don\'t have anything left. All the chocolate cakes are sold out. But we have strawberry cakes."',
        'Lucy smiles. "That\'s okay! We are very hungry, so any cake is fine for us."',
        "They buy the strawberry cake and go home happily.",
      ],
      vocabulary: {
        heading: "Vocabulary Check",
        headingMy: "ဝေါဟာရ",
        items: [
          {
            term: "Supermarket",
            meaning: "ကုန်တိုက် / စူပါမားကတ်",
          },
          {
            term: "Section",
            meaning:
              "အပိုင်း (ကုန်ပစ္စည်း အမျိုးအစားအလိုက် ထားရှိသောနေရာ)",
          },
          {
            term: "Sold out",
            meaning: "ရောင်းကုန်သွားသော",
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on "Any"',
        headingMy: "ဒီစာပိုဒ်ထဲက Any အသုံးအနှုန်းများ",
        questions: {
          title: "Questions",
          titleMy: "မေးခွန်းများ",
          items: [
            {
              en: "Do we have any drinks?",
              my: "သောက်စရာ တစ်ခုခု ရှိလား။",
            },
            {
              en: "Does anyone work here?",
              my: "ဒီမှာ အလုပ်လုပ်တဲ့သူ တစ်ယောက်ယောက် ရှိလား။",
            },
          ],
        },
        negatives: {
          title: "Negative Sentences",
          titleMy: "အငြင်းဝါကျများ — ဘာမှ / ဘယ်သူမှ / ဘယ်နေရာမှ",
          items: [
            {
              en: "She can't find it anywhere.",
              my: "ဘယ်နေရာမှာမှ ရှာမတွေ့ဘူး။",
            },
            {
              en: "She doesn't see anyone.",
              my: "ဘယ်သူ့ကိုမှ မတွေ့ဘူး။",
            },
            {
              en: "We don't have anything left.",
              my: "ဘာမှ မကျန်တော့ဘူး။",
            },
          ],
        },
        affirmative: {
          title: "Affirmative",
          titleMy: "ရိုးရိုးဝါကျများ — ဘယ်ဟာဖြစ်ဖြစ်",
          items: [
            {
              en: "You can choose any drink you like.",
              my: "ကြိုက်တဲ့ ဘယ်အအေးဖြစ်ဖြစ် ရွေးလို့ရတယ်။",
            },
            {
              en: "Any cake is fine.",
              my: "ဘယ်ကိတ်မုန့်ဖြစ်ဖြစ် အဆင်ပြေပါတယ်။",
            },
          ],
        },
      },
    },
    {
      id: "b1-b2",
      label: "B1/B2",
      bandLabel: "B1 / B2 Level Reading Passage",
      title: "The Mystery of the Missing Key",
      paragraphs: [
        "It was a cold, rainy evening. Detective Miller sat in his office, staring at a small, silver key on his desk. He had found it at the crime scene, but it didn't seem to fit any of the doors in the house.",
        "Earlier that day, a valuable painting had been stolen from the local museum. The security guards hadn't seen anyone enter the building, and the alarm hadn't made any sound. It was as if the thief had vanished into thin air.",
        'Miller picked up the key and examined it closely. There weren\'t any numbers or letters on it. It was completely plain. "This key must open something," he thought to himself. "A thief wouldn\'t just leave any random object behind. There must be a reason."',
        "He decided to visit the museum again. He walked through the empty halls, looking for anything unusual. He checked every door, every cabinet, and every drawer, but he didn't find anything. He was about to give up when he noticed a small, hidden door behind a large statue.",
        "He tried the silver key. It fit perfectly! The door opened to reveal a secret room. Inside, there wasn't any sign of the painting, but there were several empty frames.",
        'Suddenly, Miller heard a noise behind him. He spun around, but he didn\'t see anyone. He knew he wasn\'t alone. "Who\'s there?" he called out, but there wasn\'t any answer.',
        "He realized that the thief could be anywhere. The museum was huge, and there were many places to hide. He needed to be careful. He took out his flashlight and started to search the room, hoping to find any clue that would lead him to the stolen painting.",
      ],
      practiceHeading: "Vocabulary & Grammar Practice",
      vocabulary: {
        heading: "Vocabulary Check",
        headingMy: "ဝေါဟာရ",
        items: [
          {
            term: "Vanished into thin air",
            meaning: "ရုတ်တရက် ပျောက်ကွယ်သွားသည်",
          },
          {
            term: "Plain",
            meaning: "ရိုးရိုးရှင်းရှင်း (အဆင်တန်ဆာ/အမှတ်အသား မပါသော)",
          },
          {
            term: "Clue",
            meaning: "သဲလွန်စ",
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on "Any"',
        headingMy: "လေ့လာရန်",
        introMy:
          'ဒီစာပိုဒ်လေးမှာ "any" နဲ့ ပတ်သက်တဲ့ စကားလုံးတွေကို ဘယ်လိုသုံးသွားလဲဆိုတာ ပြန်ကြည့်ရအောင်။',
        negatives: {
          title: "Negative Sentences",
          titleMy: "အငြင်းဝါကျများ - ဘာမှ/ဘယ်သူမှ",
          items: [
            {
              en: "It didn't seem to fit any of the doors.",
              my: "ဘယ်တံခါးနဲ့မှ မကိုက်ညီဘူး",
            },
            {
              en: "The security guards hadn't seen anyone.",
              my: "ဘယ်သူ့ကိုမှ မမြင်ခဲ့ဘူး",
            },
            {
              en: "The alarm hadn't made any sound.",
              my: "အသံ ဘာမှ မမြည်ခဲ့ဘူး",
            },
            {
              en: "He didn't find anything.",
              my: "ဘာမှ မတွေ့ခဲ့ဘူး",
            },
          ],
        },
        affirmative: {
          title: "Affirmative Sentences",
          titleMy: "ရိုးရိုးဝါကျများ - မည်သည့်အရာမဆို/ဘယ်ဟာဖြစ်ဖြစ်",
          items: [
            {
              en: "A thief wouldn't just leave any random object behind.",
              my: "ဘယ်ပစ္စည်းကိုမဆို ဒီတိုင်း ထားခဲ့မှာ မဟုတ်ဘူး",
            },
            {
              en: "The thief could be anywhere.",
              my: "သူခိုးက ဘယ်နေရာမှာမဆို ရှိနေနိုင်တယ်",
            },
          ],
        },
      },
    },
    {
      id: "c1-c2",
      label: "C1/C2",
      bandLabel: "C1 / C2 Level Reading",
      title: "The High-Stakes Merger",
      paragraphs: [
        "Arthur Pendelton was a corporate lawyer who tolerated hardly any margin for error. When reviewing the preliminary documents for the tech acquisition, he rigorously scrutinized any and all clauses that might expose his client to potential liabilities.",
        '"Are we any closer to finding the loophole?" Arthur snapped, his piercing gaze sweeping across the boardroom. His weary legal team shifted uncomfortably. They knew perfectly well that this wasn\'t just any merger; it was the most lucrative deal of the decade.',
        '"We\'ve combed through the financial statements," replied Sarah, the lead auditor, "but there is scarcely anyone who can decipher these offshore accounts. The trail is completely opaque."',
        'Arthur sighed, his voice devoid of any discernible warmth. "If any of the rival firms get wind of this discrepancy, the entire deal will inevitably collapse. We cannot proceed any further without the unredacted ledgers."',
        'Sarah adjusted her glasses. "The CEO is hesitant to release them. He claims there isn\'t anything incriminating in them."',
        '"In any case," Arthur stated with absolute finality, "we are not making any concessions. Tell him that if he refuses to cooperate, we will walk away without any hesitation whatsoever."',
      ],
      vocabulary: {
        heading: "Advanced Vocabulary Check",
        headingMy: "ဝေါဟာရ",
        items: [
          {
            term: "Margin for error",
            meaning: "အမှားခံနိုင်သည့် အတိုင်းအတာ",
          },
          {
            term: "Scrutinize",
            meaning: "စေ့စေ့စပ်စပ် စစ်ဆေးသည်",
          },
          {
            term: "Liability",
            meaning: "တာဝန်ယူရမည့် ကိစ္စ (သို့) အကြွေး",
          },
          {
            term: "Loophole",
            meaning: "ဥပဒေ/စာချုပ်ပါ ဟာကွက်",
          },
          {
            term: "Lucrative",
            meaning: "အကျိုးအမြတ်များသော",
          },
          {
            term: "Decipher",
            meaning:
              "(နားလည်ရခက်သော အရာကို) ဖော်ထုတ်/အဓိပ္ပာယ်ဖော်သည်",
          },
          {
            term: "Concession",
            meaning: "အလျှော့ပေးခြင်း",
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on Advanced "Any"',
        headingMy: "C1/C2 အဆင့် Any အသုံးအနှုန်းများ",
        introMy:
          "ဒီစာပိုဒ်ထဲမှာ ပါတဲ့ Any တွေက အခြေခံအဆင့်နဲ့ မတူတော့ဘဲ ပိုပြီး အဆင့်မြင့်သွားပါတယ်။",
        groups: [
          {
            title: "Hardly any / Scarcely any",
            titleMy: "မရှိသလောက် / လုံးဝနီးပါးမရှိသော",
            items: [
              {
                en: "He tolerated hardly any margin for error.",
                my: "အမှားခံနိုင်တဲ့ အနေအထား လုံးဝနီးပါးကို မရှိတာ / အမှား လုံးဝအဖြစ်မခံဘူး။",
              },
              {
                en: "There is scarcely anyone who can decipher these offshore accounts.",
                my: "ဖော်ထုတ်နိုင်တဲ့သူ မရှိသလောက်ပဲ/ခပ်ရှားရှားပဲ။",
              },
            ],
          },
          {
            title: "Any and all",
            titleMy: "ရှိသမျှ အရာအားလုံး / အလေးပေးခြင်း",
            items: [
              {
                en: "He rigorously scrutinized any and all clauses.",
                my: "ရှိသမျှ စည်းမျဉ်းစည်းကမ်း အားလုံးကို လုံးဝမကျန်စေဘဲ အလေးပေးစစ်ဆေးသည်။",
              },
            ],
          },
          {
            title: "Any as an Adverb",
            titleMy:
              "အတိုင်းအတာ/ပမာဏကို ပြခြင်း — ပိုပြီး / နည်းနည်းလေးမှ",
            items: [
              {
                en: "Are we any closer to finding the loophole?",
                my: "ငါတို့ ဟာကွက်ကို ရှာတွေ့ဖို့ နည်းနည်းလေးများ ပိုနီးစပ်လာပြီလား။",
              },
              {
                en: "We cannot proceed any further.",
                my: "ငါတို့ ရှေ့ကို နည်းနည်းလေးမှ ထပ်ဆက်တိုးလို့ မရတော့ဘူး။",
              },
            ],
          },
          {
            title: "Not just any",
            titleMy: "ရိုးရိုးသာမန် မဟုတ်ဘူး",
            items: [
              {
                en: "This wasn't just any merger.",
                my: "ဒါဟာ ရိုးရိုးသာမန် ကုမ္ပဏီပေါင်းစည်းခြင်းမျိုး မဟုတ်ဘူး။ — အရမ်းအရေးကြီးတယ်ဆိုတဲ့ အဓိပ္ပာယ်ပါ။",
              },
            ],
          },
          {
            title: "If any",
            titleMy: "အကယ်၍များ ရှိခဲ့ရင်တောင်မှ",
            items: [
              {
                en: "If any of the rival firms get wind of this discrepancy, the entire deal will inevitably collapse.",
                my: "အကယ်၍များ ပြိုင်ဘက်ကုမ္ပဏီတွေထဲက တစ်ခုခုများ ဒါကို သတင်းရသွားခဲ့ရင်။",
              },
            ],
          },
          {
            title: "Idiomatic Phrases",
            titleMy: "အီဒီယံ အသုံးအနှုန်း",
            items: [
              {
                en: "In any case, we are not making any concessions.",
                my: "ဘယ်လိုပဲဖြစ်ဖြစ် / ဘာပဲဖြစ်နေဖြစ်နေ လို့ ပြောချင်တဲ့အခါ သုံးပါတယ်။",
              },
            ],
          },
        ],
      },
    },
  ],
};
