/** Grammar notes for free-1 section "Any" (MY explanations + EN examples). */

export type FreeLessonGrammarExample = {
  en: string;
  my?: string;
};

export type FreeLessonGrammarCompound = {
  word: string;
  meaning: string;
  examples: FreeLessonGrammarExample[];
};

export type FreeLessonGrammarRule = {
  n: number;
  title: string;
  titleEn: string;
  body: string;
  pattern?: string;
  examples?: FreeLessonGrammarExample[];
  note?: string;
  compounds?: FreeLessonGrammarCompound[];
};

export type FreeLessonGrammar = {
  kicker: string;
  /** Phrase chip next to the Grammar kicker (e.g. Any / Anytime). */
  badge?: string;
  title: string;
  intro: string;
  rules: FreeLessonGrammarRule[];
};

export const FREE_1_ANY_GRAMMAR: FreeLessonGrammar = {
  kicker: "Grammar",
  badge: "Any",
  title: "“Any” နှင့် ပတ်သက်သော အခြေခံ Grammar စည်းမျဉ်းများ",
  intro:
    "“Any” ကို အဓိကအားဖြင့် အခြေအနေ (၃) မျိုးမှာ အများဆုံး သုံးလေ့ရှိပြီး၊ ရေတွက်လို့ရသော နာမ်အများကိန်း (Plural Countable Nouns) များနှင့် ရေတွက်လို့မရသော နာမ်များ (Uncountable Nouns) နှစ်မျိုးလုံးနှင့် တွဲသုံးနိုင်ပါတယ်။",
  rules: [
    {
      n: 1,
      title: "မေးခွန်းများတွင် သုံးခြင်း",
      titleEn: "Questions",
      body: "မေးခွန်းတွေမှာ တစ်ခုခု သို့မဟုတ် အနည်းငယ် ရှိသလားလို့ မေးချင်တဲ့အခါ သုံးပါတယ်။",
      pattern: "Is there / Are there / Do you have + any + Noun?",
      examples: [
        {
          en: "Do you have any brothers or sisters?",
          my: "မင်းမှာ ညီအစ်ကိုမောင်နှမတွေ ရှိလား။",
        },
        {
          en: "Is there any milk in the fridge?",
          my: "ရေခဲသေတ္တာထဲမှာ နွားနို့ ရှိသေးလား။",
        },
      ],
    },
    {
      n: 2,
      title: "အငြင်းဝါကျများတွင် သုံးခြင်း",
      titleEn: "Negative Sentences",
      body: "Not ပါတဲ့ အငြင်းဝါကျတွေမှာ “ဘာမှ / ဘယ်သူမှ” ဆိုတဲ့ အဓိပ္ပာယ်နဲ့ သုံးပါတယ်။ (Not … any)",
      pattern: "Subject + auxiliary verb (not) + any + Noun.",
      examples: [
        {
          en: "I don’t have any money.",
          my: "ငါ့မှာ ပိုက်ဆံ ဘာမှမရှိဘူး။",
        },
        {
          en: "She didn't make any mistakes.",
          my: "သူမ ဘာအမှားမှ မလုပ်ခဲ့ဘူး။",
        },
      ],
      note: '"not any" သည် "no" နှင့် အဓိပ္ပာယ်တူပါတယ်။ (ဥပမာ — I have no money.)',
    },
    {
      n: 3,
      title: "ရိုးရိုးဝါကျများတွင် သုံးခြင်း",
      titleEn: 'Affirmative — "It doesn\'t matter"',
      body: "ရိုးရိုးဝါကျ (အငြင်း/မေးခွန်း မဟုတ်သောဝါကျ) တွေမှာ “Any” ကို သုံးရင် “မည်သည့်အရာမဆို / ဘယ်ဟာဖြစ်ဖြစ်” ဆိုတဲ့ အဓိပ္ပာယ် သက်ရောက်သွားပါတယ်။ ရွေးချယ်စရာမလိုဘဲ အားလုံးရတယ်လို့ ဆိုလိုတာပါ။",
      examples: [
        {
          en: "You can take any bus. They all go to the city center.",
          my: "ဘယ်ကားဖြစ်ဖြစ် စီးသွားလို့ရတယ်။ ကားတိုင်း မြို့ထဲကို သွားတယ်။",
        },
        {
          en: "Come over any time you want.",
          my: "မင်းလာချင်တဲ့ ဘယ်အချိန်ဖြစ်ဖြစ် လာခဲ့လို့ရတယ်။",
        },
      ],
    },
    {
      n: 4,
      title: "ခြွင်းချက် — If Clause",
      titleEn: "If clauses",
      body: '"အကယ်၍" လို့ အဓိပ္ပာယ်ရတဲ့ If နဲ့ စတဲ့ ဝါကျတွေမှာလည်း some အစား any ကို သုံးလေ့ရှိပါတယ်။',
      examples: [
        {
          en: "If you have any problems, please let me know.",
          my: "အခက်အခဲ တစ်ခုခုရှိရင် ကျေးဇူးပြုပြီး ငါ့ကို အသိပေးပါ။",
        },
      ],
    },
    {
      n: 5,
      title: "Any နှင့် တွဲဖက်သုံးလေ့ရှိသော စကားလုံးများ",
      titleEn: "Compounds with Any",
      body: "ဒီစကားလုံးတွေရဲ့ Grammar အသုံးအနှုန်းကလည်း Any ရဲ့ စည်းမျဉ်းတွေအတိုင်းပါပဲ။",
      compounds: [
        {
          word: "Anyone / Anybody",
          meaning: "ဘယ်သူမဆို / (မေးခွန်း·အငြင်း) တစ်စုံတစ်ယောက်၊ ဘယ်သူမှ",
          examples: [
            {
              en: "Did anyone call me?",
              my: "ငါ့ကို ဖုန်းဆက်တဲ့သူ ရှိလား။",
            },
          ],
        },
        {
          word: "Anything",
          meaning: "မည်သည့်အရာမဆို / (မေးခွန်း·အငြင်း) တစ်ခုခု၊ ဘာမှ",
          examples: [
            {
              en: "I didn't eat anything.",
              my: "ငါ ဘာမှ မစားခဲ့ရဘူး။",
            },
          ],
        },
        {
          word: "Anywhere",
          meaning: "မည်သည့်နေရာမဆို / (မေးခွန်း·အငြင်း) တစ်နေရာရာ၊ ဘယ်နေရာမှ",
          examples: [
            {
              en: "We can sit anywhere.",
              my: "ငါတို့ ဘယ်နေရာဖြစ်ဖြစ် ထိုင်လို့ရတယ်။",
            },
          ],
        },
      ],
    },
  ],
};

/** Grammar notes for free-1 section "Anytime." (MY explanations + EN examples). */
export const FREE_1_ANYTIME_GRAMMAR: FreeLessonGrammar = {
  kicker: "Grammar",
  badge: "Anytime",
  title: "“Anytime” နှင့် ပတ်သက်သော အရေးကြီးသည့် Grammar စည်းမျဉ်းများ",
  intro:
    '"Anytime" ကို အဓိကအားဖြင့် အချိန်ပြပုဒ် (Adverb) အဖြစ် သုံးပါတယ်။ Grammar အရ အရေးအကြီးဆုံး မှတ်ထားရမယ့် အချက်ကတော့ “Anytime” (တစ်လုံးတည်းရေးခြင်း) နဲ့ “Any time” (နှစ်လုံးခွဲရေးခြင်း) တို့ရဲ့ ကွာခြားချက်ပဲ ဖြစ်ပါတယ်။',
  rules: [
    {
      n: 1,
      title: "Anytime (တစ်လုံးတည်းရေးခြင်း)",
      titleEn: "Adverb",
      body: '"Anytime" (တစ်ဆက်တည်း) ကို "မည်သည့်အချိန်မဆို / အချိန်မရွေး / ဘယ်အချိန်ဖြစ်ဖြစ်" (whenever) ဆိုတဲ့ အဓိပ္ပာယ်နဲ့ သုံးပါတယ်။ သူက ဝါကျထဲမှာ အချိန်ကိုပြတဲ့ Adverb အနေနဲ့ အလုပ်လုပ်ပါတယ်။',
      examples: [
        {
          en: "You can call me anytime.",
          my: "ငါ့ကို ဘယ်အချိန်ဖြစ်ဖြစ် ဖုန်းဆက်လို့ရတယ်။",
        },
        {
          en: "Our online store is open anytime.",
          my: "ကျွန်တော်တို့ရဲ့ အွန်လိုင်းစတိုးကို အချိန်မရွေး ဖွင့်ထားပါတယ်။",
        },
      ],
    },
    {
      n: 2,
      title: "Any time (နှစ်လုံးခွဲရေးခြင်း)",
      titleEn: "Adjective + Noun",
      body: '"Any time" (ခွဲရေးခြင်း) ကျတော့ Adjective "any" နဲ့ Noun "time" ကို ပေါင်းထားတာပါ။ သူ့ကို "အချိန်(အနည်းငယ်) / အချိန်(တစ်ခုခု)" ဆိုတဲ့ ပမာဏကို ရည်ညွှန်းတဲ့အခါ သုံးပါတယ်။ (ဥပမာ- ငါ့ကို ကူညီဖို့ မင်းမှာ အချိန်ရှိလား လို့မေးတဲ့အခါမျိုးပါ။)',
      examples: [
        {
          en: "Do you have any time to help me today?",
          my: "ဒီနေ့ ငါ့ကိုကူညီဖို့ မင်းမှာ အချိန် နည်းနည်းပါးပါး ရှိလား။",
        },
        {
          en: "I don't have any time for a holiday.",
          my: "ငါ့မှာ အားလပ်ရက်ထွက်ဖို့ အချိန် ဘာမှမရှိဘူး။",
        },
      ],
      note: 'ဒီနေရာမှာ Do you have anytime လို့ သုံးလို့ မရပါ။',
    },
    {
      n: 3,
      title: "Preposition များနှင့် တွဲသုံးသည့်အခါ",
      titleEn: "The Preposition Rule",
      body: '"Anytime" ကို at ကဲ့သို့သော Preposition နဲ့ တွဲသုံးလို့ လုံးဝ မရပါဘူး။ အကယ်၍ "at" ထည့်သုံးချင်ရင် "any time" လို့ နှစ်လုံးခွဲပြီး ရေးရ/ပြောရပါမယ်။',
      examples: [
        {
          en: "You can leave at any time.",
          my: "မင်း ဘယ်အချိန်ဖြစ်ဖြစ် ထွက်သွားလို့ရတယ်။",
        },
        {
          en: "You can leave anytime.",
          my: "at မပါရင် တစ်လုံးတည်း သုံးလို့ရပါတယ်။",
        },
      ],
      note: "အမှား — You can leave at anytime. (at + anytime မရပါ)",
    },
    {
      n: 4,
      title: "ကျေးဇူးတင်စကားကို တုံ့ပြန်ခြင်း",
      titleEn: "Conversation",
      body: 'Grammar စည်းမျဉ်းမဟုတ်ပေမယ့် စကားပြောရာမှာ "You\'re welcome" (ရပါတယ်) လို့ ပြောမယ့်အစား "Anytime" (အချိန်မရွေး ကူညီဖို့ အသင့်ပါပဲ) လို့ Idiom တစ်ခုလို သုံးလေ့ရှိပါတယ်။',
      examples: [
        {
          en: "A: Thanks for the ride!",
          my: "ကားကြုံတင်ခေါ်ပေးလို့ ကျေးဇူးပဲ။",
        },
        {
          en: "B: Anytime!",
          my: "ရပါတယ် / အချိန်မရွေးပါပဲ။",
        },
      ],
    },
    {
      n: 5,
      title: "အချုပ်မှတ်ရန်",
      titleEn: "Quick Summary",
      body: '"ဘယ်အချိန်ဖြစ်ဖြစ်" ဆိုရင် → anytime · "အချိန် (နည်းနည်းပါးပါး)" ဆိုရင် → any time · ရှေ့မှာ "at" ပါလာရင် → at any time လို့ပဲ သုံးရပါမယ်။',
    },
  ],
};
