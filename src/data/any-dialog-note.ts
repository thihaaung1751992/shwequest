/** Dialog-tied lesson note for free-1 section "Any" (under the speaking dialog). */

export type FreeLessonDialogNoteItem = {
  title: string;
  titleEn: string;
  body: string;
};

export type FreeLessonDialogNote = {
  title: string;
  items: FreeLessonDialogNoteItem[];
};

export const FREE_1_ANY_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "Any")',
  items: [
    {
      title: "မေးခွန်းများ",
      titleEn: "Questions",
      body: 'Do we need any snacks? လိုမျိုး မေးခွန်းတွေမှာ တစ်ခုခု/အချို့ ရှိသလား၊ လိုသလားလို့ မေးတဲ့အခါ သုံးပါတယ်။',
    },
    {
      title: "အငြင်းဝါကျများ",
      titleEn: "Negative Sentences",
      body: 'don\'t have any chips, didn\'t invite anyone စတဲ့ အငြင်းဝါကျ (not ပါတဲ့ ဝါကျ) တွေမှာ "ဘာမှမရှိဘူး၊ ဘယ်သူမှမရှိဘူး" ဆိုတဲ့ အဓိပ္ပာယ်နဲ့ သုံးပါတယ်။',
    },
    {
      title: "မည်သည့်အရာမဆို",
      titleEn: "It doesn't matter",
      body: 'Any kind, Any time, anywhere တွေမှာတော့ အငြင်း/မေးခွန်း မဟုတ်ဘဲ "ဘယ်အမျိုးအစားဖြစ်ဖြစ်၊ ဘယ်အချိန်ဖြစ်ဖြစ်၊ ဘယ်နေရာဖြစ်ဖြစ် အဆင်ပြေတယ်/ရတယ်" ဆိုတဲ့ အဓိပ္ပာယ်နဲ့ သုံးသွားတာ ဖြစ်ပါတယ်။',
    },
  ],
};

/** Dialog-tied lesson note for free-1 section "Anytime." */
export const FREE_1_ANYTIME_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "Anytime")',
  items: [
    {
      title: "ကျေးဇူးတင်စကားကို ပြန်လည်တုံ့ပြန်ရာတွင် သုံးခြင်း",
      titleEn: 'Reply to "Thank you"',
      body: 'Sarah: Anytime, Mike! တစ်ယောက်ယောက်က ကိုယ့်ကို ကျေးဇူးတင်ပါတယ် (Thank you) လို့ ပြောလာတဲ့အခါ "You\'re welcome" (ရပါတယ်) လို့ ပြန်ပြောမယ့်အစား "Anytime" လို့ သုံးလေ့ရှိပါတယ်။ "(နောက်လည်း) ဘယ်အချိန်ဖြစ်ဖြစ် ကူညီဖို့အသင့်ပါပဲ / အချိန်မရွေးပါပဲ" ဆိုတဲ့ ဖော်ရွေတဲ့ အဓိပ္ပာယ်မျိုး သက်ရောက်ပါတယ်။',
    },
    {
      title: '"မည်သည့်အချိန်မဆို / ဘယ်အချိန်ဖြစ်ဖြစ်" ဟု အဓိပ္ပာယ်ရသော နေရာတွင် သုံးခြင်း',
      titleEn: 'Meaning "Whenever"',
      body: 'You can drop by my house anytime… (ဘယ်အချိန်ဖြစ်ဖြစ် လာခဲ့လို့ရတယ်) · I will come anytime after lunch. (နေ့လယ်စာစားပြီး ကြိုက်တဲ့အချိန် လာခဲ့မယ်) · Call me anytime… (ဘယ်အချိန်ဖြစ်ဖြစ် ဖုန်းဆက်လိုက်ပါ) — ဒီနေရာတွေမှာ "Anytime" ဟာ "Whenever" (ဘယ်အချိန်မဆို) ဆိုတဲ့ အချိန်ပြ ပုဒ် (Adverb) အနေနဲ့ အလုပ်လုပ်ပါတယ်။ ကန့်သတ်ထားတဲ့ အချိန်မရှိဘဲ လွတ်လွတ်လပ်လပ် ရွေးချယ်ခွင့်ပေးတဲ့အခါ သုံးပါတယ်။',
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "Basic usage of 'I'm'". */
export const FREE_16_IM_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m")',
  items: [
    {
      title: "အဓိပ္ပာယ်နှင့် အသုံးပြုပုံ",
      titleEn: "Meaning",
      body: "'I'm' ဆိုတာ 'I AM' ရဲ့ အတိုကောက်စကားလုံး ဖြစ်ပါတယ်။ ကိုယ့်အကြောင်းကို သူတစ်ပါးအား ပြောပြတဲ့အခါ ဒါမှမဟုတ် ကိုယ်လက်ရှိ ဘာလုပ်နေတယ်ဆိုတာကို ရှင်းပြတဲ့အခါ တခြားစကားလုံးတွေနဲ့ ပေါင်းစပ်ပြီး အသုံးပြုပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm + descriptive words". */
export const FREE_16_IM_DESCRIPTIVE_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m")',
  items: [
    {
      title: "အထူးပြုစကားလုံးများနှင့် တွဲသုံးခြင်း",
      titleEn: "Descriptive words",
      body: "'I'm' နဲ့အတူ extremely, very, terribly, super စတဲ့ အထူးပြုစကားလုံး (descriptive words) တွေကို ထည့်သွင်း အသုံးပြုနိုင်ပါတယ်။ ခံစားချက်ကို ပိုပြင်းထန်အောင် ပြောချင်တဲ့အခါ သုံးပါတယ်။ (ဥပမာ — I'm extremely tired. / I'm very happy.)",
    },
  ],
};

/** Dialog-tied lesson notes for free-16 "Variations of 'I'm in/at/on'". */
export const FREE_16_IM_IN_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m in/at/on")',
  items: [
    {
      title: '"in" သုံးခြင်း',
      titleEn: 'Using "in"',
      body: "အများအားဖြင့် 'in' ဆိုတဲ့ စကားလုံးကို အခန်း သို့မဟုတ် အဆောက်အအုံလိုမျိုး ရုပ်ပိုင်းဆိုင်ရာ နေရာတစ်ခုခု (အတွင်း) ကို ဝင်ရောက်နေချိန်မှာ သုံးလေ့ရှိပါတယ်။",
    },
  ],
};

export const FREE_16_IM_AT_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m in/at/on")',
  items: [
    {
      title: '"at" သုံးခြင်း',
      titleEn: 'Using "at"',
      body: "'at' ကို အသုံးပြုခြင်းကတော့ သင်လက်ရှိ ဘယ်နေရာမှာ ရောက်နေလဲဆိုတာကို တစ်ယောက်ယောက်အား ပြောပြဖို့ ကူညီပေးပါတယ်။ 'at' နဲ့ 'in' ရဲ့ ကွာခြားချက်ကတော့ 'at' ဟာ (တိကျတဲ့ အဆောက်အဦးတစ်ခုတည်းမဟုတ်ဘဲ) ယေဘုယျကျတဲ့ နေရာ (General location) ကို ရည်ညွှန်းတာပဲ ဖြစ်ပါတယ်။",
    },
  ],
};

export const FREE_16_IM_AT_IN_SWAP_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m in/at/on")',
  items: [
    {
      title: '"at" နှင့် "in" အလဲအလှယ်',
      titleEn: "Interchangeable",
      body: "ဒါပေမယ့် တချို့အခြေအနေတွေမှာတော့ 'at' နဲ့ 'in' ကို တစ်ခုကိုယ်စားတစ်ခု အလဲအလှယ်လုပ်ပြီး သုံးလို့ရပါတယ်။",
    },
  ],
};

export const FREE_16_IM_ON_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m in/at/on")',
  items: [
    {
      title: '"on" သုံးခြင်း',
      titleEn: 'Using "on"',
      body: "'on' ကို အသုံးပြုခြင်းကတော့ ကိုယ်ထိလက်ရောက်ရှိနေတဲ့ နေရာမျိုးမဟုတ်ဘဲ၊ သင့်ရဲ့အချိန်တွေကို တခြားအရာတစ်ခုခုမှာ အသုံးပြုနေတယ် (ဥပမာ - ဖုန်းပြောနေတယ်၊ ကွန်ပျူတာသုံးနေတယ်) ဆိုတဲ့ အဓိပ္ပာယ်မျိုးကို ရည်ညွှန်းပါတယ်။ (မှတ်ချက် - bus ကားစတဲ့ အများသုံး ယာဉ်တွေပေါ်မှာ ရှိနေတယ်ဆိုရင်လည်း on ကို သုံးပါတယ်။)",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm good at". */
export const FREE_16_IM_GOOD_AT_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m good at")',
  items: [
    {
      title: '"good at" သုံးခြင်း',
      titleEn: 'Using "good at"',
      body: "ဒီနေရာမှာလည်း 'I'm' ကို 'I am' အဖြစ် အသုံးပြုထားတာ ဖြစ်ပါတယ်။ 'Good at' ဆိုတာကတော့ သင်ဘယ်အရာမှာ ထူးချွန်လဲ၊ ဘယ်အရာကို လုပ်ရတာ ကျွမ်းကျင်ပိုင်နိုင်မှုရှိလဲ ဆိုတာကို တစ်ယောက်ယောက်အား ပြောပြတဲ့အခါ သုံးပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm + (verb)". */
export const FREE_16_IM_VERB_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m + (verb)")',
  items: [
    {
      title: "ကြိယာနှင့် တွဲသုံးခြင်း",
      titleEn: "I'm + verb",
      body: "'I'm' ဆိုတာ 'I am' ဆိုတဲ့ စကားလုံးတွေရဲ့ အတိုကောက်ဖြစ်ပါတယ်။ 'I'm' ရဲ့နောက်မှာ ကြိယာ (verb) တစ်ခုခုကို ပေါင်းထည့်လိုက်ခြင်းအားဖြင့် သင်လက်ရှိလုပ်နေတဲ့ လုပ်ဆောင်ချက်တစ်ခုခု ဒါမှမဟုတ် ဖြစ်ပျက်နေတဲ့ အခြေအနေတစ်ခုခုကို ဖော်ပြနိုင်ပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm getting". */
export const FREE_16_IM_GETTING_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m getting")',
  items: [
    {
      title: '"getting" သုံးခြင်း',
      titleEn: 'Using "getting"',
      body: "'I am' နဲ့ 'getting' ဆိုတဲ့ စကားလုံးတွေကို ပေါင်းစပ်လိုက်တဲ့အခါ သင်ဟာ အရာတစ်ခုခုကို ပိုင်ဆိုင်ရရှိတော့မယ်၊ တစ်ခုခုရဲ့ သက်ရောက်မှုကို စတင်ခံစားနေရပြီ (ဥပမာ - နေမကောင်းဖြစ်ချင်သလို ခံစားရတာမျိုး)၊ ဒါမှမဟုတ် တစ်စုံတစ်ခုကို ရှာဖွေရယူဖို့ အစီအစဉ်ရှိနေတယ်ဆိုတာကို တစ်ယောက်ယောက်အား ပြောပြနေတာ ဖြစ်ပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm trying + (verb)" — effort. */
export const FREE_16_IM_TRYING_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m trying")',
  items: [
    {
      title: '"I\'m trying" သုံးခြင်း',
      titleEn: 'Using "I\'m trying"',
      body: "'I am trying' ဆိုတာကတော့ သင်ဟာ ကိုယ်စွမ်း၊ ဉာဏ်စွမ်း ဒါမှမဟုတ် စိတ်ဓာတ်ခွန်အားတွေကို အသုံးပြုပြီး အရာတစ်ခုခုကို ကြိုးစားလုပ်ဆောင်နေတယ်ဆိုတာကို တစ်ယောက်ယောက်အား ပြောပြတာပဲ ဖြစ်ပါတယ်။ 'I'm trying' ရဲ့နောက်မှာ ကြိယာ (verb) တစ်ခုခု ပေါင်းထည့်လိုက်ခြင်းအားဖြင့် သင်ဘာကို ကြိုးစားလုပ်ဆောင်နေတာလဲဆိုတာကို တိတိကျကျ ထောက်ပြနိုင်ပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 "trying" as hardship / stress. */
export const FREE_16_IM_TRYING_HARDSHIP_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "trying")',
  items: [
    {
      title: "ခံစားချက် ဖော်ပြခြင်း",
      titleEn: "Expressing hardship",
      body: "တစ်စုံတစ်ယောက်ရဲ့ ခံစားချက်ကို ဖော်ပြတဲ့နေရာမှာလည်း 'trying' ဆိုတဲ့ စကားလုံးကို သုံးတာမျိုး ကြားဖူးပါလိမ့်မယ်။ အဲဒီလို အသုံးပြုတဲ့အခါမှာတော့ ပင်ပန်းနွမ်းနယ်မှု ဒါမှမဟုတ် စိတ်ဖိစီးမှု ရှိနေတာကို ဖော်ပြတာ ဖြစ်ပါတယ်။",
    },
  ],
};

/** Dialog-tied lesson note for free-16 section "I'm gonna + (verb)". */
export const FREE_16_IM_GONNA_DIALOG_NOTE: FreeLessonDialogNote = {
  title: 'သင်ခန်းစာအတွက် မှတ်စု (Usage of "I\'m gonna")',
  items: [
    {
      title: '"gonna" သုံးခြင်း',
      titleEn: 'Using "gonna"',
      body: "'gonna' ဆိုတဲ့ စကားလုံးဟာ သဒ္ဒါနည်းလမ်း (grammar) အရတော့ မှန်ကန်မှုမရှိပါဘူး။ သဒ္ဒါနည်းကျ မှန်ကန်တဲ့ စကားလုံးအစစ်ကတော့ 'going to' ဖြစ်ပါတယ်။ 'gonna' ဆိုတဲ့ စကားလုံးကို အသုံးပြုတဲ့အခါ သင်ဟာ အခုလက်ရှိအချိန်မှာ ဒါမှမဟုတ် မကြာခင် အနာဂတ်ကာလမှာ ဘာလုပ်ဖို့ အစီအစဉ်ရှိလဲဆိုတာကို တစ်ယောက်ယောက်အား ပြောပြနေတာ ဖြစ်ပါတယ်။",
    },
  ],
};
