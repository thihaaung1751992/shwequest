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
  title: string;
  intro: string;
  rules: FreeLessonGrammarRule[];
};

export const FREE_1_ANY_GRAMMAR: FreeLessonGrammar = {
  kicker: "Grammar",
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
