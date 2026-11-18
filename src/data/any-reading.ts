/** Levelled reading for free-1 sections "Any" and "Anytime" (A1/A2 + optional higher tabs). */

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

/** Levelled reading for free-1 section "Anytime." (A1/A2 + B1/B2 + C1/C2). */
export const FREE_1_ANYTIME_READING: FreeLessonReading = {
  kicker: "Reading",
  levels: [
    {
      id: "a1-a2",
      label: "A1/A2",
      bandLabel: "A1 / A2 Level Reading",
      title: "Going to the Library",
      titleMy: "စာကြည့်တိုက်သို့ သွားခြင်း",
      paragraphs: [
        "Anna and Ben are good friends. Today, Anna wants to read a book.",
        '"I am going to the new library," Anna says. "Do you want to come with me?"',
        '"I am sorry," Ben answers. "I am very busy today. I don\'t have any time."',
        'Anna smiles. "That\'s okay, Ben. The library is open every day. We can go anytime this week."',
        '"Great!" Ben says. "Can we go on Friday? I am free on Friday."',
        '"Yes," Anna says. "You can call me anytime on Friday morning. I will wait for you."',
        '"Thank you, Anna!" Ben says.',
        '"Anytime!" Anna replies.',
      ],
      vocabulary: {
        heading: "Vocabulary Check",
        headingMy: "ဝေါဟာရ",
        items: [
          {
            term: "Busy",
            meaning: "အလုပ်များသော",
          },
          {
            term: "Free",
            meaning: "အားလပ်သော (အလုပ်မရှိသော)",
          },
          {
            term: "Wait",
            meaning: "စောင့်ဆိုင်းသည်",
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on "Anytime"',
        headingMy: "ဒီစာပိုဒ်ထဲက Anytime အသုံးအနှုန်းများ",
        introMy:
          "ဒီစာပိုဒ်လေးထဲမှာ စောစောက သင်ခဲ့တဲ့ Grammar စည်းမျဉ်း (၃) မျိုးလုံးကို သုံးပြထားပါတယ်။ အသံထွက်ဖတ်ကြည့်ပြီး any time (အချိန်မရှိဘူး) နဲ့ anytime (ဘယ်အချိန်ဖြစ်ဖြစ်) ရဲ့ အဓိပ္ပာယ် ကွာခြားသွားပုံကို လေ့ကျင့်ကြည့်နိုင်ပါတယ်။",
        groups: [
          {
            title: "Any time (two words)",
            titleMy: "Any time (ခွဲရေးခြင်း - အချိန်ပမာဏ)",
            items: [
              {
                en: "I don't have any time.",
                my: "ငါ့မှာ အချိန် ဘာမှမရှိဘူး / လုံးဝ မအားဘူး။ — ဒီနေရာမှာ time က နာမ် (Noun) ဖြစ်ပြီး၊ any က အချိန်မရှိဘူးဆိုတဲ့ ပမာဏကို ပြပါတယ်။",
              },
            ],
          },
          {
            title: "Anytime (one word)",
            titleMy: "Anytime (တစ်ဆက်တည်းရေးခြင်း - ဘယ်အချိန်ဖြစ်ဖြစ်)",
            items: [
              {
                en: "We can go anytime this week.",
                my: "ဒီအပတ်ထဲ ဘယ်အချိန်ဖြစ်ဖြစ် ငါတို့ သွားလို့ရတယ်။",
              },
              {
                en: "You can call me anytime on Friday morning.",
                my: "ဘယ်အချိန်ဖြစ်ဖြစ် ဖုန်းဆက်လို့ရတယ်။",
              },
            ],
          },
          {
            title: "Anytime! (conversation)",
            titleMy: "Anytime! (စကားပြောအသုံးအနှုန်း - ရပါတယ်)",
            items: [
              {
                en: "Anytime!",
                my: "ရပါတယ်၊ အချိန်မရွေး ကူညီဖို့ အသင့်ပါပဲ — Ben က Thank you လို့ ပြောတဲ့အခါ Anna က You're welcome အစား သုံးသွားတာ ဖြစ်ပါတယ်။",
              },
            ],
          },
        ],
      },
    },
    {
      id: "b1-b2",
      label: "B1/B2",
      bandLabel: "B1 / B2 Level Reading",
      title: "A Flexible Workplace",
      titleMy: "ပြောင်းလွယ်ပြင်လွယ်ရှိသော လုပ်ငန်းခွင်",
      paragraphs: [
        "Elena was feeling very stressed about the upcoming marketing presentation. Her manager, David, noticed she was staying late in the office.",
        '"If you need help with the slides, you can come to my office anytime," David offered. "My door is always open."',
        '"Thanks, David," Elena sighed, "but I really don\'t have any time to take a break today. The deadline is tomorrow, and I still have a lot of data to analyze."',
        '"I understand," David replied. "Just remember that our new company policy allows you to work from home at any time if you need a quieter environment. You don\'t have to stay here until midnight."',
        'Elena smiled slightly. "That\'s good to know. I might work from home tomorrow morning so I can focus better."',
        '"Perfect," David said. "Even if you are working remotely, feel free to send me a message anytime. I\'ll keep my phone nearby."',
        '"Thanks for being so supportive, David. I really appreciate it," Elena said.',
        '"Anytime, Elena! We are a team," David smiled and walked back to his desk.',
      ],
      vocabulary: {
        heading: "Vocabulary Check",
        headingMy: "B1/B2 ဝေါဟာရများ",
        items: [
          {
            term: "Upcoming",
            meaning: "မကြာမီ ရောက်လာတော့မည့်",
          },
          {
            term: "Deadline",
            meaning: "နောက်ဆုံးထား လုပ်ဆောင်ရမည့်အချိန် (သတ်မှတ်ရက်)",
          },
          {
            term: "Analyze",
            meaning: "ခွဲခြမ်းစိတ်ဖြာသည်",
          },
          {
            term: "Policy",
            meaning: "မူဝါဒ",
          },
          {
            term: "Environment",
            meaning: "ပတ်ဝန်းကျင်",
          },
          {
            term: "Remotely",
            meaning:
              "အဝေးမှ (ဥပမာ - ရုံးမှမဟုတ်ဘဲ အိမ်မှ အလုပ်လုပ်ခြင်း)",
          },
          {
            term: "Supportive",
            meaning: "ကူညီအားပေးသော",
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on "Anytime"',
        headingMy: "ဒီစာပိုဒ်ထဲက Anytime အသုံးအနှုန်းများကို လေ့လာရန်",
        introMy:
          "ဒီစာပိုဒ်ထဲမှာ စောစောက Grammar သင်ခန်းစာမှာ ပြောခဲ့တဲ့ ပုံစံ (၄) မျိုးလုံးကို နေရာတကျ သုံးပြထားပါတယ်။",
        groups: [
          {
            title: "Anytime (Adverb)",
            titleMy: "Anytime (Adverb - ဘယ်အချိန်ဖြစ်ဖြစ်)",
            items: [
              {
                en: "You can come to my office anytime.",
                my: "ငါ့ရုံးခန်းကို ဘယ်အချိန်ဖြစ်ဖြစ် လာခဲ့လို့ရတယ်။",
              },
              {
                en: "Send me a message anytime.",
                my: "ဘယ်အချိန်ဖြစ်ဖြစ် မက်ဆေ့ချ်ပို့လိုက်ပါ။",
              },
            ],
          },
          {
            title: "Any time (Noun Phrase)",
            titleMy: "Any time (Noun Phrase - အချိန်ပမာဏ)",
            items: [
              {
                en: "I really don't have any time to take a break.",
                my: "ငါ့မှာ အနားယူဖို့ အချိန် ဘာမှ/နည်းနည်းမှ မရှိဘူး။ — ဒီနေရာမှာ အချိန်ဘယ်လောက်ရှိလဲဆိုတဲ့ ပမာဏကို ရည်ညွှန်းတာပါ။",
              },
            ],
          },
          {
            title: "At any time",
            titleMy: "At any time (Preposition ပါသော အသုံးအနှုန်း)",
            items: [
              {
                en: "Allows you to work from home at any time.",
                my: "သင့်ကို အချိန်မရွေး အိမ်ကနေ အလုပ်လုပ်ခွင့် ပေးထားတယ်။ — ရှေ့မှာ 'at' ပါလာတဲ့အတွက် 'at anytime' လို့ တစ်ဆက်တည်း ရေးလို့မရတော့ဘဲ 'at any time' လို့ ခွဲရေးရပါတယ်။",
              },
            ],
          },
          {
            title: "Anytime! (Reply)",
            titleMy: "Anytime! (Reply - ရပါတယ် / အချိန်မရွေးပါပဲ)",
            items: [
              {
                en: "Anytime, Elena!",
                my: "ကျေးဇူးတင်စရာ မလိုပါဘူး၊ အချိန်မရွေး ကူညီဖို့ အသင့်ပါပဲ — Elena က Thanks လို့ ပြောတဲ့အခါ David က ပြန်ဖြေတာ။",
              },
            ],
          },
        ],
      },
    },
    {
      id: "c1-c2",
      label: "C1/C2",
      bandLabel: "C1 / C2 Level Reading",
      title: "The Paradox of Hyper-Connectivity",
      paragraphs: [
        "The modern era of ubiquitous connectivity has ostensibly granted us the freedom to work from anywhere and at any time. Yet, this dissolution of traditional boundaries has birthed a paradoxical predicament: because we can be reached anytime, society increasingly expects us to be perpetually available.",
        'Dr. Aris Thorne, a prominent sociologist, argues that professionals today rarely have any time to truly disconnect from their occupational obligations. "In previous decades, stepping out of the office meant you were physically and digitally unreachable," Thorne explains. "Now, a corporate crisis can unfold at any time, and the implicit expectation is immediate mitigation, regardless of the hour."',
        "During a recent symposium on occupational burnout, Thorne engaged in a rigorous debate with a tech executive who championed their firm's flexible policies.",
        '"Our employees are not tethered to a desk. They have the autonomy to complete their tasks anytime they prefer," the executive stated proudly.',
        '"But do they have any time for psychological detachment?" Thorne countered sharply. "If a junior analyst receives an urgent directive at midnight, the theoretical freedom to work anytime rapidly morphs into an unspoken obligation to be on call at any time."',
        'Following the session, the executive approached Thorne. "I appreciate your candid critique, Doctor. It has given our board much to reconsider regarding our communication protocols."',
        '"Anytime," Thorne replied with a polite nod, utilizing the colloquial pleasantry, yet keenly aware of the profound irony embedded in that single word.',
      ],
      vocabulary: {
        heading: "Advanced Vocabulary Check",
        headingMy: "C1/C2 ဝေါဟာရများ",
        items: [
          {
            term: "Ubiquitous",
            meaning:
              "နေရာတိုင်းမှာ ရှိနေသော (အထူးသဖြင့် အင်တာနက်/နည်းပညာ)",
          },
          {
            term: "Ostensibly",
            meaning: "အပေါ်ယံကြည့်လျှင် (သို့) ထင်ရသည်မှာ",
          },
          {
            term: "Dissolution",
            meaning:
              "ပျက်ပြယ်ခြင်း / ရောယှက်ပျောက်ကွယ်သွားခြင်း (Boundaries - နယ်နိမိတ်များ ပျောက်ကွယ်သွားခြင်း)",
          },
          {
            term: "Paradoxical predicament",
            meaning: "ဆန့်ကျင်ဘက်ဖြစ်နေသော အကျပ်အတည်း",
          },
          {
            term: "Perpetually",
            meaning: "အမြဲတမ်း / အဆက်မပြတ်",
          },
          {
            term: "Mitigation",
            meaning: "သက်သာလျော့ပါးအောင် ဖြေရှင်းခြင်း",
          },
          {
            term: "Symposium",
            meaning: "ပညာရပ်ဆိုင်ရာ ဆွေးနွေးပွဲ",
          },
          {
            term: "Psychological detachment",
            meaning:
              "စိတ်ပိုင်းဆိုင်ရာ အနားပေးခြင်း / အလုပ်မှ စိတ်ကို ခွဲထုတ်ထားခြင်း",
          },
          {
            term: "Morphs into",
            meaning: "(အခြားတစ်ခုအဖြစ်သို့) ပြောင်းလဲသွားသည်",
          },
          {
            term: "Colloquial pleasantry",
            meaning:
              'နေ့စဉ်သုံး ယဉ်ကျေးဖွယ်ရာ စကား (ဒီနေရာမှာ Anytime ကို ဆိုလိုသည်)',
          },
        ],
      },
      anyFocus: {
        heading: 'Focus on Advanced "Anytime"',
        headingMy: "C1/C2 အဆင့် Anytime အသုံးအနှုန်းများ",
        introMy:
          "ဒီအဆင့်မှာတော့ Grammar သက်သက်သာမကဘဲ၊ စာရေးသူက စကားလုံးတွေရဲ့ အဓိပ္ပာယ်ကို ဘယ်လို ကစားသွားလဲ (Wordplay) ဆိုတာကိုပါ တွေ့ရမှာပါ။",
        groups: [
          {
            title: "At any time (Prepositional Phrase)",
            titleMy: "At any time (Prepositional Phrase - အချိန်မရွေး)",
            items: [
              {
                en: "Work from anywhere and at any time.",
                my: "ဘယ်နေရာကမဆို၊ ဘယ်အချိန်မှာမဆို အလုပ်လုပ်နိုင်ခွင့် — Formal စာပေတွေမှာ anytime (တစ်ဆက်တည်း) ထက် at any time (ခွဲရေးပြီး at ထည့်ခြင်း) ကို ပိုပြီး အလေးထား သုံးလေ့ရှိပါတယ်။",
              },
              {
                en: "A corporate crisis can unfold at any time.",
                my: "ပြဿနာက အချိန်မရွေး ပေါ်လာနိုင်တယ်။",
              },
              {
                en: "An unspoken obligation to be on call at any time.",
                my: "အချိန်မရွေး အသင့်ရှိနေရမယ့် တာဝန်။",
              },
            ],
          },
          {
            title: "Anytime (Adverb)",
            titleMy: "Anytime (Adverb - ဘယ်အချိန်ဖြစ်ဖြစ်)",
            items: [
              {
                en: "Because we can be reached anytime.",
                my: "ငါတို့ကို ဘယ်အချိန်ဖြစ်ဖြစ် ဆက်သွယ်လို့ရနေတဲ့အတွက်။",
              },
              {
                en: "They have the autonomy to complete their tasks anytime they prefer.",
                my: "သူတို့သဘောကျတဲ့ ဘယ်အချိန်ဖြစ်ဖြစ် အလုပ်ပြီးအောင်လုပ်နိုင်တယ်။",
              },
            ],
          },
          {
            title: "Any time (Noun Phrase)",
            titleMy: "Any time (Noun Phrase - အချိန်ပမာဏ)",
            items: [
              {
                en: "Professionals today rarely have any time to truly disconnect.",
                my: "တကယ်တမ်း အဆက်အသွယ်ဖြတ် အနားယူဖို့ အချိန် မရှိသလောက်ပါပဲ။",
              },
              {
                en: "But do they have any time for psychological detachment?",
                my: "ဒါပေမယ့် စိတ်အနားပေးဖို့ရော သူတို့မှာ အချိန် နည်းနည်းပါးပါး ရှိရဲ့လား။",
              },
            ],
          },
          {
            title: "Anytime (Idiomatic Response & Irony)",
            titleMy: "Anytime (Idiomatic Response & Irony)",
            items: [
              {
                en: "Anytime,",
                my: 'Thank you ကို ပြန်ဖြေသေးတဲ့အနေနဲ့ Anytime လို့ ဆရာဝန်က ပြန်ပြောလိုက်ပါတယ်။ တစ်ခန်းလုံး Hyper-connectivity ကို ဆွေးနွေးနေပြီးမှ၊ နောက်ဆုံး နှုတ်ဆက်တဲ့အခါ "Anytime (အချိန်မရွေးပါပဲ)" ကို ပြန်သုံးလိုက်လို့ irony (ရွဲ့တဲ့သဘော) ဖြစ်နေပါတယ်။',
              },
            ],
          },
        ],
      },
    },
  ],
};
