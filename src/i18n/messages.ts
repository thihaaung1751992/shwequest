export const LOCALES = ["my", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_KEY = "shwequest-locale";

export type Messages = {
  account: string;
  language: string;
  currentLanguage: (name: string) => string;
  seeTeachers: string;
  daysShort: (days: number) => string;
  daysFull: (days: number) => string;
  nav: {
    home: string;
    teachers: string;
    leaderboard: string;
    main: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    kicker: string;
    title: string;
    deeper: string;
    start: string;
    body: (videos: number, games: number) => string;
    how: string;
    back: string;
  };
  about: {
    title: string;
    body: string;
    videos: string;
    games: string;
    teachers: string;
  };
  pricing: {
    title: string;
    intro: (price: string) => string;
    months: (count: number) => string;
    perMonth: string;
    totalDue: string;
    billedDays: string;
    extraDays: string;
    access: string;
    days: (count: number) => string;
    flip: (label: string) => string;
    puzzle: string;
    puzzleHint: string;
    restart: string;
  };
  calc: {
    title: string;
    ready: string;
    flipBack: string;
    backspace: string;
  };
  footer: {
    blurb: string;
    social: string;
    explore: string;
    onPath: string;
    videos: string;
    games: string;
    teachers: string;
    start: string;
    startBody: string;
  };
  ranks: {
    kicker: string;
    title: string;
    body: string;
    cta: string;
    board: string;
    topLearners: string;
    topThree: string;
    fullRanking: string;
  };
  teachers: {
    title: string;
    body: string;
    searchLabel: string;
    searchPlaceholder: string;
    clear: string;
    search: string;
    layout: string;
    card: string;
    tile: string;
    list: string;
    role: string;
    videos: (count: number) => string;
    games: (count: number) => string;
    openPath: string;
    emptyLead: string;
    emptyTail: string;
    matches: (count: number) => string;
  };
  path: {
    learning: string;
    now: (title: string) => string;
    lessonsCompleted: string;
    complete: (done: number, total: number) => string;
    roadmap: string;
    unit: (index: number, title: string) => string;
    pick: string;
    pickBody: string;
    lockedTip: string;
    close: string;
    videoUnit: (video: number, unit: number) => string;
    bossUnit: (unit: number) => string;
    xpReward: (xp: number) => string;
    started: string;
    startLesson: string;
    youAreHere: string;
    completed: string;
    current: string;
    locked: string;
    nodeName: (title: string, status: string, xp: number) => string;
  };
};

const en: Messages = {
  account: "Account",
  language: "Language",
  currentLanguage: (name) => `Language, ${name}`,
  seeTeachers: "See teachers",
  daysShort: (days) => {
    if (days === 0) return "Today";
    if (days === 1) return "1d left";
    return `${days}d left`;
  },
  daysFull: (days) => {
    if (days === 0) return "Ends today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  },
  nav: {
    home: "Home",
    teachers: "Teachers",
    leaderboard: "Leaderboard",
    main: "Main",
    menu: "Menu",
    openMenu: "Open main menu",
    closeMenu: "Close main menu",
  },
  hero: {
    kicker: "Learning path",
    title: "Smart learning",
    deeper: "Deeper with a teacher",
    start: "—Start here",
    body: (videos, games) =>
      `Choose a teacher and follow their path. ${videos} videos and ${games} games across the teachers.`,
    how: "How it works",
    back: "Back",
  },
  about: {
    title: "About Us",
    body: "Choose a teacher and follow one path. The quest is the videos and games already on that path.",
    videos: "videos across teachers",
    games: "games across teachers",
    teachers: "teachers to choose",
  },
  pricing: {
    title: "Plans",
    intro: (price) => `Every length is ${price} per month.`,
    months: (count) => (count === 1 ? "1 month" : `${count} months`),
    perMonth: "/ month",
    totalDue: "Total due",
    billedDays: "Billed days",
    extraDays: "Extra days",
    access: "Access covers",
    days: (count) => (count === 1 ? "1 day" : `${count} days`),
    flip: (label) => `Flip to calculator for ${label}`,
    puzzle: "Learn English fluently",
    puzzleHint: "Click matching letters on the floor to fill LEARN ENGLISH FLUENTLY.",
    restart: "Restart puzzle",
  },
  calc: {
    title: "Calculator",
    ready: "Ready",
    flipBack: "Flip card back",
    backspace: "Backspace",
  },
  footer: {
    blurb: "Choose a teacher and follow the learning path.",
    social: "Social",
    explore: "Explore",
    onPath: "On the path",
    videos: "videos",
    games: "games",
    teachers: "teachers",
    start: "Start",
    startBody: "Open the teacher list and follow the lessons already on the path.",
  },
  ranks: {
    kicker: "Ranks",
    title: "See who is climbing",
    body: "Check the board, compare XP, and keep pace with other learners on the path.",
    cta: "Open leaderboard",
    board: "Leaderboard",
    topLearners: "Top learners",
    topThree: "Top three",
    fullRanking: "Full ranking",
  },
  teachers: {
    title: "Choose a teacher",
    body: "Open one teacher to see the learning path.",
    searchLabel: "Search teachers",
    searchPlaceholder: "Search teachers",
    clear: "Clear search",
    search: "Search",
    layout: "Teacher layout",
    card: "Card",
    tile: "Tile",
    list: "List",
    role: "Teacher",
    videos: (count) => `${count} videos`,
    games: (count) => `${count} games`,
    openPath: "Open path",
    emptyLead: "No teachers match “",
    emptyTail: "”.",
    matches: (count) =>
      `${count} matching ${count === 1 ? "teacher" : "teachers"}`,
  },
  path: {
    learning: "Learning path",
    now: (title) => `Now: ${title}`,
    lessonsCompleted: "Lessons completed",
    complete: (done, total) => `${done}/${total} complete`,
    roadmap: "Learning roadmap",
    unit: (index, title) => `Unit ${index} · ${title}`,
    pick: "Pick a teacher",
    pickBody: "Each teacher has their own videos and games. Choose one to open that path.",
    lockedTip: "Complete previous lessons to unlock!",
    close: "Close",
    videoUnit: (video, unit) => `Video ${video} · Unit ${unit}`,
    bossUnit: (unit) => `Boss battle · Unit ${unit}`,
    xpReward: (xp) => `${xp} XP reward`,
    started: "Lesson started. Your place on the path is saved.",
    startLesson: "Start Lesson",
    youAreHere: "You are here!",
    completed: "Completed",
    current: "Current lesson",
    locked: "Locked",
    nodeName: (title, status, xp) => `${title}. ${status}. ${xp} XP.`,
  },
};

const my: Messages = {
  account: "အကောင့်",
  language: "ဘာသာစကား",
  currentLanguage: (name) => `ဘာသာစကား၊ ${name}`,
  seeTeachers: "ဆရာများကြည့်ရန်",
  daysShort: (days) => (days === 0 ? "ယနေ့" : `${days} ရက်`),
  daysFull: (days) => (days === 0 ? "ယနေ့ပြီး" : `${days} ရက်ကျန်`),
  nav: {
    home: "ပင်မ",
    teachers: "ဆရာများ",
    leaderboard: "ဦးဆောင်ဇယား",
    main: "ပင်မ",
    menu: "မီနူး",
    openMenu: "ပင်မမီနူးဖွင့်ရန်",
    closeMenu: "ပင်မမီနူးပိတ်ရန်",
  },
  hero: {
    kicker: "သင်ယူလမ်းကြောင်း",
    title: "စမတ်ကျကျ သင်ယူမယ်",
    deeper: "ဆရာနဲ့ ပိုနက်ရှိုင်းအောင်",
    start: "—ဒီကစမယ်",
    body: (videos, games) =>
      `ဆရာတစ်ယောက်ရွေးပြီး သူ့လမ်းကြောင်းအတိုင်းလိုက်ပါ။ ဆရာများတစ်လျှောက် ဗီဒီယို ${videos} ခု၊ ဂိမ်း ${games} ခု ရှိပါတယ်။`,
    how: "ဘယ်လိုလုပ်သလဲ",
    back: "နောက်သို့",
  },
  about: {
    title: "ကျွန်ုပ်တို့အကြောင်း",
    body: "ဆရာတစ်ယောက်ရွေးပြီး လမ်းကြောင်းတစ်ခုလိုက်ပါ။ ခရီးစဉ်က အဲ့ဒီလမ်းကြောင်းပေါ်က ဗီဒီယိုနဲ့ ဂိမ်းတွေပါ။",
    videos: "ဆရာများတစ်လျှောက် ဗီဒီယို",
    games: "ဆရာများတစ်လျှောက် ဂိမ်း",
    teachers: "ရွေးချယ်နိုင်တဲ့ ဆရာ",
  },
  pricing: {
    title: "အစီအစဉ်များ",
    intro: (price) => `ကာလတိုင်း တစ်လလျှင် ${price} ဖြစ်ပါတယ်။`,
    months: (count) => `${count} လ`,
    perMonth: "/ လ",
    totalDue: "စုစုပေါင်း",
    billedDays: "ငွေတောင်းခံရက်",
    extraDays: "အပိုရက်",
    access: "အသုံးပြုခွင့်",
    days: (count) => `${count} ရက်`,
    flip: (label) => `${label} အတွက် ဂဏန်းတွက်စက်`,
    puzzle: "အင်္ဂလိပ်စာ ကျွမ်းကျင်အောင်",
    puzzleHint:
      "LEARN ENGLISH FLUENTLY ပြည့်အောင် ကြမ်းပြင်က တူညီတဲ့ အက္ခရာတွေကို နှိပ်ပါ။",
    restart: "ပဟေဠိပြန်စရန်",
  },
  calc: {
    title: "ဂဏန်းတွက်စက်",
    ready: "အသင့်",
    flipBack: "ကတ်ပြန်လှန်ရန်",
    backspace: "နောက်ပြန်ဖျက်ရန်",
  },
  footer: {
    blurb: "ဆရာတစ်ယောက်ရွေးပြီး သင်ယူလမ်းကြောင်းလိုက်ပါ။",
    social: "လူမှုကွန်ရက်",
    explore: "ကြည့်ရှုရန်",
    onPath: "လမ်းကြောင်းပေါ်",
    videos: "ဗီဒီယို",
    games: "ဂိမ်း",
    teachers: "ဆရာ",
    start: "စတင်ရန်",
    startBody: "ဆရာစာရင်းဖွင့်ပြီး လမ်းကြောင်းပေါ်က သင်ခန်းစာတွေကို လိုက်ပါ။",
  },
  ranks: {
    kicker: "အဆင့်",
    title: "ဘယ်သူတွေ တက်နေလဲ",
    body: "ဇယားကိုကြည့်၊ XP နှိုင်းယှဉ်၊ လမ်းကြောင်းပေါ်က တခြားသင်ယူသူတွေနဲ့အတူ လိုက်ပါ။",
    cta: "ဇယားဖွင့်ရန်",
    board: "ဦးဆောင်ဇယား",
    topLearners: "ထိပ်တန်း သင်ယူသူများ",
    topThree: "ထိပ်တန်း သုံးယောက်",
    fullRanking: "အဆင့်စာရင်းအပြည့်",
  },
  teachers: {
    title: "ဆရာရွေးပါ",
    body: "ဆရာတစ်ယောက်ဖွင့်ပြီး သင်ယူလမ်းကြောင်းကြည့်ပါ။",
    searchLabel: "ဆရာရှာရန်",
    searchPlaceholder: "ဆရာရှာရန်",
    clear: "ရှာဖွေမှုဖျက်ရန်",
    search: "ရှာရန်",
    layout: "ဆရာပြသပုံ",
    card: "ကတ်",
    tile: "အကွက်",
    list: "စာရင်း",
    role: "ဆရာ",
    videos: (count) => `ဗီဒီယို ${count}`,
    games: (count) => `ဂိမ်း ${count}`,
    openPath: "လမ်းကြောင်းဖွင့်ရန်",
    emptyLead: "“",
    emptyTail: "” နဲ့ ကိုက်ညီတဲ့ ဆရာမရှိပါ။",
    matches: (count) => `ကိုက်ညီတဲ့ ဆရာ ${count} ယောက်`,
  },
  path: {
    learning: "သင်ယူလမ်းကြောင်း",
    now: (title) => `အခု — ${title}`,
    lessonsCompleted: "ပြီးသွားတဲ့ သင်ခန်းစာ",
    complete: (done, total) => `${done}/${total} ပြီး`,
    roadmap: "သင်ယူလမ်းကြောင်း",
    unit: (index, title) => `ယူနစ် ${index} · ${title}`,
    pick: "ဆရာရွေးပါ",
    pickBody:
      "ဆရာတစ်ယောက်ချင်းစီမှာ ကိုယ်ပိုင် ဗီဒီယိုနဲ့ ဂိမ်းတွေရှိပါတယ်။ လမ်းကြောင်းဖွင့်ဖို့ တစ်ယောက်ရွေးပါ။",
    lockedTip: "အရင်သင်ခန်းစာတွေ ပြီးမှ ဖွင့်လို့ရပါတယ်။",
    close: "ပိတ်ရန်",
    videoUnit: (video, unit) => `ဗီဒီယို ${video} · ယူနစ် ${unit}`,
    bossUnit: (unit) => `ဘော့စ်တိုက်ပွဲ · ယူနစ် ${unit}`,
    xpReward: (xp) => `XP ဆု ${xp}`,
    started: "သင်ခန်းစာစပါပြီ။ လမ်းကြောင်းပေါ်က နေရာကို သိမ်းထားပါတယ်။",
    startLesson: "သင်ခန်းစာစရန်",
    youAreHere: "သင်ဒီမှာပါ",
    completed: "ပြီးပြီ",
    current: "လက်ရှိသင်ခန်းစာ",
    locked: "သော့ခတ်ထားသည်",
    nodeName: (title, status, xp) => `${title}။ ${status}။ XP ${xp}။`,
  },
};

export const messages: Record<Locale, Messages> = { en, my };

/** Native name, so each language stays recognizable in either UI language. */
export function localeLabel(locale: Locale): string {
  return locale === "my" ? "မြန်မာ" : "English";
}
