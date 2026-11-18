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
