export const LOCALES = ["my", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_KEY = "shwequest-locale";

export type Messages = {
  account: string;
  language: string;
  currentLanguage: (name: string) => string;
  theme: string;
  toggleTheme: (next: "light" | "dark" | "system") => string;
  seeTeachers: string;
  daysShort: (days: number) => string;
  daysFull: (days: number) => string;
  nav: {
    home: string;
    teachers: string;
    team: string;
    leaderboard: string;
    selfStudy: string;
    selfStudyLessons: string;
    selfStudyVideos: string;
    selfStudyMenu: string;
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
    videoTab: string;
    guideTab: string;
    guideTitle: string;
    guideSteps: readonly string[];
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
    bestValue: string;
    flip: (label: string) => string;
    puzzle: string;
    puzzleHint: string;
    restart: string;
    jostle: string;
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
    ctaTitle: string;
    backToTop: string;
  };
  ranks: {
    kicker: string;
    title: string;
    body: string;
    cta: string;
    board: string;
    topLearners: string;
    topThree: string;
    restRanking: string;
    boardTitle: string;
    boardBody: string;
    learners: (count: number) => string;
    topXp: (xp: string) => string;
    yourRank: (rank: number) => string;
    you: string;
    xpToNext: (xp: string, rank: number) => string;
    behind: (xp: string, rank: number) => string;
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
    comingSoon: string;
    emptyLead: string;
    emptyTail: string;
    matches: (count: number) => string;
    kicker: string;
    teacherCount: (count: number) => string;
    progress: string;
    notStarted: string;
    lessonsDone: (done: number, total: number) => string;
  };
  team: {
    title: string;
    body: string;
    builders: string;
    buildersBody: string;
    teachers: string;
    teachersBody: string;
    builderRole: string;
    teacherRole: string;
    open: string;
    comingSoon: string;
    back: string;
    seeLessons: string;
    kicker: string;
    memberCount: (count: number) => string;
    builderTagline: string;
    viewPhoto: (name: string) => string;
    closePhoto: string;
    resume: {
      email: string;
      github: string;
      years: string;
      roles: string;
      projects: string;
      about: string;
      skills: string;
      experience: string;
      now: string;
      education: string;
      languages: string;
      work: string;
      opensNewTab: string;
    };
  };
  selfStudy: {
    kicker: string;
    title: string;
    body: string;
    priceLabel: string;
    free: string;
    priceHint: string;
    searchLabel: string;
    searchPlaceholder: string;
    clear: string;
    search: string;
    layout: string;
    card: string;
    list: string;
    openLesson: string;
    comingSoon: string;
    emptyLead: string;
    emptyTail: string;
    matches: (count: number) => string;
    pagination: string;
    prev: string;
    next: string;
    page: (n: number) => string;
    pageOf: (page: number, total: number) => string;
    back: string;
    sections: string;
    content: string;
    playDialog: string;
    stopDialog: string;
    playTurn: string;
    stopTurn: string;
    playReading: string;
    stopReading: string;
    playParagraph: string;
    stopParagraph: string;
    playVocab: string;
    stopVocab: string;
    showTranslation: string;
    hideTranslation: string;
    showMoreSections: string;
    sectionSearchLabel: string;
    sectionSearchPlaceholder: string;
    sectionEmptyLead: string;
    sectionEmptyTail: string;
    sectionMatches: (count: number) => string;
    day: (n: number) => string;
    dayPlan: (days: number) => string;
    dayToggle: (day: number, from: number, to: number) => string;
    videosKicker: string;
    videosTitle: string;
    videosBody: string;
    videosPlaylistCount: (count: number) => string;
    videosChannelCount: (count: number) => string;
    videosSearchLabel: string;
    videosSearchPlaceholder: string;
    videosChannelLabel: string;
    videosChannelAll: string;
    videosTopicLabel: string;
    videosTopicAll: string;
    videosTopicGrammar: string;
    videosTopicSpeaking: string;
    videosTopicVocabulary: string;
    videosEmptyLead: string;
    videosEmptyTail: string;
    videosEmptyChannel: (channel: string) => string;
    videosEmptyTopic: (topic: string) => string;
    videosResetFilters: string;
    videosMatches: (count: number) => string;
    videosPlaylistAria: (title: string) => string;
    videosOpenOnYouTube: string;
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
  profile: {
    title: string;
    edit: string;
    save: string;
    cancel: string;
    saved: string;
    changePhoto: string;
    photoTypeError: string;
    photoSizeError: string;
    name: string;
    bio: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    social: string;
    telegram: string;
    tiktok: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    handleHint: string;
    opensNewTab: string;
    courses: string;
    coursesBody: string;
    courseCount: (count: number) => string;
    coursesEmpty: string;
    courseXp: (xp: string) => string;
    moreTeachers: string;
    planEnded: string;
    openProfile: string;
    statXp: string;
    statRank: string;
    statLessons: string;
    statPlan: string;
    xpToPass: (xp: string, name: string) => string;
    topOfBoard: string;
  };
};

const en: Messages = {
  account: "Account",
  language: "Language",
  currentLanguage: (name) => `Language, ${name}`,
  theme: "Color theme",
  toggleTheme: (next) =>
    next === "dark"
      ? "Dark mode"
      : next === "system"
        ? "System theme"
        : "Light mode",
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
    team: "Team",
    leaderboard: "Leaderboard",
    selfStudy: "Self study",
    selfStudyLessons: "Lessons",
    selfStudyVideos: "Videos",
    selfStudyMenu: "Self study Free menu",
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
    videoTab: "Video",
    guideTab: "How to use",
    guideTitle: "How to use the site",
    guideSteps: [
      "Choose a teacher.",
      "Open their path.",
      "Follow the videos and games on that path.",
    ],
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
    bestValue: "Best value",
    flip: (label) => `Flip to calculator for ${label}`,
    puzzle: "Learn English fluently",
    puzzleHint: "Tap a letter to fill it, or drag it aside.",
    restart: "Restart puzzle",
    jostle: "Bounce the letters",
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
    ctaTitle: "Ready to start your path?",
    backToTop: "Back to top",
  },
  ranks: {
    kicker: "Ranks",
    title: "See who is climbing",
    body: "Check the board, compare XP, and keep pace with other learners on the path.",
    cta: "Open leaderboard",
    board: "Leaderboard",
    topLearners: "Top learners",
    topThree: "Top three",
    restRanking: "Rank 4 and below",
    boardTitle: "Climb to the top",
    boardBody: "Finish lessons and games to earn XP. The more you learn, the higher you climb.",
    learners: (count) => `${count} learners`,
    topXp: (xp) => `Top ${xp} XP`,
    yourRank: (rank) => `You are #${rank}`,
    you: "You",
    xpToNext: (xp, rank) => `${xp} XP to reach #${rank}`,
    behind: (xp, rank) => `${xp} XP behind #${rank}`,
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
    comingSoon: "Coming Soon",
    emptyLead: "No teachers match “",
    emptyTail: "”.",
    matches: (count) =>
      `${count} matching ${count === 1 ? "teacher" : "teachers"}`,
    kicker: "Your guides",
    teacherCount: (count) => `${count} ${count === 1 ? "teacher" : "teachers"}`,
    progress: "Progress",
    notStarted: "Not started yet",
    lessonsDone: (done, total) => `${done}/${total} done`,
  },
  team: {
    title: "Team",
    body: "The people who build the site, and the teachers who lead a path.",
    builders: "Web Development Team",
    buildersBody: "People who build this site.",
    teachers: "Teachers",
    teachersBody: "Teachers who lead a learning path.",
    builderRole: "IT",
    teacherRole: "Teacher",
    open: "Open",
    comingSoon: "Coming Soon",
    back: "Back to team",
    seeLessons: "See lessons",
    kicker: "Meet the crew",
    memberCount: (count) => `${count} ${count === 1 ? "person" : "people"}`,
    builderTagline: "Builds Shwequest",
    viewPhoto: (name) => `View photo of ${name}`,
    closePhoto: "Close photo",
    resume: {
      email: "Email",
      github: "GitHub",
      years: "Years building",
      roles: "Roles",
      projects: "Live projects",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      now: "Now",
      education: "Education",
      languages: "Languages",
      work: "Work",
      opensNewTab: "opens in a new tab",
    },
  },
  selfStudy: {
    kicker: "Open path",
    title: "Self study for free",
    body: "Learn on your own. No plan fee — this path stays free.",
    priceLabel: "Price",
    free: "Free",
    priceHint: "Ks 0 · forever",
    searchLabel: "Search lessons",
    searchPlaceholder: "Search lessons",
    clear: "Clear search",
    search: "Search",
    layout: "Lesson layout",
    card: "Card",
    list: "List",
    openLesson: "Open lesson",
    comingSoon: "Coming Soon",
    emptyLead: "No lessons match “",
    emptyTail: "”.",
    matches: (count) =>
      `${count} matching ${count === 1 ? "lesson" : "lessons"}`,
    pagination: "Lesson pages",
    prev: "Previous page",
    next: "Next page",
    page: (n) => `Page ${n}`,
    pageOf: (page, total) => `Page ${page} of ${total}`,
    back: "Back to self study",
    sections: "Lesson sections",
    content: "Lesson content",
    playDialog: "Play dialog",
    stopDialog: "Stop",
    playTurn: "Play this line",
    stopTurn: "Stop this line",
    playReading: "Read aloud",
    stopReading: "Stop reading",
    playParagraph: "Play this paragraph",
    stopParagraph: "Stop this paragraph",
    playVocab: "Hear this word",
    stopVocab: "Stop this word",
    showTranslation: "Show translation",
    hideTranslation: "Hide translation",
    showMoreSections: "Scroll down 5 phrases",
    sectionSearchLabel: "Search phrases or number",
    sectionSearchPlaceholder: "Phrase or number…",
    sectionEmptyLead: "No phrases match “",
    sectionEmptyTail: "”.",
    sectionMatches: (count) =>
      `${count} matching ${count === 1 ? "phrase" : "phrases"}`,
    day: (n) => `Day ${n}`,
    dayPlan: (days) =>
      days === 1 ? "Finish in 1 day" : `Finish in ${days} days`,
    dayToggle: (day, from, to) => `Day ${day}, phrases ${from} to ${to}`,
    videosKicker: "Open path",
    videosTitle: "Free videos",
    videosBody:
      "Watch free speaking videos from BBC Learning English. No plan fee.",
    videosPlaylistCount: (count) =>
      `${count} ${count === 1 ? "playlist" : "playlists"}`,
    videosChannelCount: (count) =>
      `${count} ${count === 1 ? "channel" : "channels"}`,
    videosSearchLabel: "Search videos",
    videosSearchPlaceholder: "Search videos",
    videosChannelLabel: "Channel",
    videosChannelAll: "All channels",
    videosTopicLabel: "Topic",
    videosTopicAll: "All topics",
    videosTopicGrammar: "Grammar",
    videosTopicSpeaking: "Speaking",
    videosTopicVocabulary: "Vocabulary",
    videosEmptyLead: "No videos match “",
    videosEmptyTail: "”.",
    videosEmptyChannel: (channel) => `No videos from “${channel}”.`,
    videosEmptyTopic: (topic) => `No “${topic}” videos.`,
    videosResetFilters: "Reset filters",
    videosMatches: (count) =>
      `${count} matching ${count === 1 ? "video" : "videos"}`,
    videosPlaylistAria: (title) => `YouTube playlist: ${title}`,
    videosOpenOnYouTube: "Open on YouTube",
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
  profile: {
    title: "Your profile",
    edit: "Edit profile",
    save: "Save",
    cancel: "Cancel",
    saved: "Saved",
    changePhoto: "Photo",
    photoTypeError: "Choose an image file.",
    photoSizeError: "Keep the photo under 800 KB.",
    name: "Name",
    bio: "Bio",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    address: "Address",
    social: "Social",
    telegram: "Telegram",
    tiktok: "TikTok",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    twitter: "X / Twitter",
    handleHint: "@handle or full link",
    opensNewTab: "opens in a new tab",
    courses: "Your courses",
    coursesBody: "Teacher paths you bought and are working through.",
    courseCount: (count) => (count === 1 ? "1 course" : `${count} courses`),
    coursesEmpty: "No teacher courses yet. Pick a teacher to start a path.",
    courseXp: (xp) => `${xp} XP earned on this path`,
    moreTeachers: "Want another path?",
    planEnded: "Plan ended",
    openProfile: "Open your profile",
    statXp: "Total XP",
    statRank: "Leaderboard",
    statLessons: "Lessons done",
    statPlan: "Plan",
    xpToPass: (xp, name) => `${xp} XP to pass ${name}`,
    topOfBoard: "Top of the board",
  },
};

const my: Messages = {
  account: "အကောင့်",
  language: "ဘာသာစကား",
  currentLanguage: (name) => `ဘာသာစကား၊ ${name}`,
  theme: "အရောင်မုဒ်",
  toggleTheme: (next) =>
    next === "dark"
      ? "အမှောင်မုဒ်"
      : next === "system"
        ? "စနစ်အရောင်"
        : "အလင်းမုဒ်",
  seeTeachers: "ဆရာများကြည့်ရန်",
  daysShort: (days) => (days === 0 ? "ယနေ့" : `${days} ရက်`),
  daysFull: (days) => (days === 0 ? "ယနေ့ပြီး" : `${days} ရက်ကျန်`),
  nav: {
    home: "ပင်မ",
    teachers: "ဆရာများ",
    team: "အဖွဲ့",
    leaderboard: "ဦးဆောင်ဇယား",
    selfStudy: "ကိုယ်တိုင်သင်",
    selfStudyLessons: "သင်ခန်းစာများ",
    selfStudyVideos: "ဗီဒီယိုများ",
    selfStudyMenu: "ကိုယ်တိုင်သင် အခမဲ့ မီနူး",
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
    videoTab: "ဗီဒီယို",
    guideTab: "အသုံးပြုနည်း",
    guideTitle: "ဝဘ်ဆိုက်ကို ဘယ်လိုသုံးမလဲ",
    guideSteps: [
      "ဆရာတစ်ယောက်ရွေးပါ။",
      "သူ့လမ်းကြောင်းကို ဖွင့်ပါ။",
      "အဲ့ဒီလမ်းကြောင်းပေါ်က ဗီဒီယိုနဲ့ ဂိမ်းတွေကို လိုက်လုပ်ပါ။",
    ],
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
    bestValue: "အတန်ဆုံး",
    flip: (label) => `${label} အတွက် ဂဏန်းတွက်စက်`,
    puzzle: "အင်္ဂလိပ်စာ ကျွမ်းကျင်အောင်",
    puzzleHint: "အက္ခရာကို တို့ရင် ပြည့်မယ်၊ ဖုံးနေရင် ဆွဲဖယ်ပါ။",
    restart: "ပဟေဠိပြန်စရန်",
    jostle: "စာလုံးများခုန်ရန်",
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
    ctaTitle: "သင့်လမ်းကြောင်း စဖို့ အသင့်ဖြစ်ပြီလား။",
    backToTop: "အပေါ်သို့",
  },
  ranks: {
    kicker: "အဆင့်",
    title: "ဘယ်သူတွေ တက်နေလဲ",
    body: "ဇယားကိုကြည့်၊ XP နှိုင်းယှဉ်၊ လမ်းကြောင်းပေါ်က တခြားသင်ယူသူတွေနဲ့အတူ လိုက်ပါ။",
    cta: "ဇယားဖွင့်ရန်",
    board: "ဦးဆောင်ဇယား",
    topLearners: "ထိပ်တန်း သင်ယူသူများ",
    topThree: "ထိပ်တန်း သုံးယောက်",
    restRanking: "အဆင့် ၄ နှင့် အောက်",
    boardTitle: "ထိပ်ဆုံးကို တက်ကြစို့",
    boardBody: "သင်ခန်းစာနဲ့ ဂိမ်းတွေ ပြီးအောင်လုပ်ပြီး XP စုပါ။ များများသင်လေ အဆင့်မြင့်လေပါ။",
    learners: (count) => `သင်ယူသူ ${count} ယောက်`,
    topXp: (xp) => `အမြင့်ဆုံး ${xp} XP`,
    yourRank: (rank) => `သင့်အဆင့် #${rank}`,
    you: "သင်",
    xpToNext: (xp, rank) => `#${rank} ရောက်ဖို့ ${xp} XP လိုသေး`,
    behind: (xp, rank) => `#${rank} ထက် ${xp} XP နောက်ကျ`,
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
    comingSoon: "မကြာမီ",
    emptyLead: "“",
    emptyTail: "” နဲ့ ကိုက်ညီတဲ့ ဆရာမရှိပါ။",
    matches: (count) => `ကိုက်ညီတဲ့ ဆရာ ${count} ယောက်`,
    kicker: "လမ်းပြဆရာများ",
    teacherCount: (count) => `ဆရာ ${count} ယောက်`,
    progress: "တိုးတက်မှု",
    notStarted: "မစရသေးပါ",
    lessonsDone: (done, total) => `${done}/${total} ပြီး`,
  },
  team: {
    title: "အဖွဲ့",
    body: "ဆိုက်ကို တည်ဆောက်သူတွေနဲ့ လမ်းကြောင်းဦးဆောင်တဲ့ ဆရာတွေ။",
    builders: "Web Development Team",
    buildersBody: "ဒီဆိုက်ကို တည်ဆောက်သူတွေ။",
    teachers: "ဆရာများ",
    teachersBody: "သင်ယူလမ်းကြောင်း ဦးဆောင်တဲ့ ဆရာတွေ။",
    builderRole: "အိုင်တီ",
    teacherRole: "ဆရာ",
    open: "ဖွင့်ရန်",
    comingSoon: "မကြာမီ",
    back: "အဖွဲ့သို့",
    seeLessons: "သင်ခန်းစာများ",
    kicker: "အဖွဲ့ဝင်များ",
    memberCount: (count) => `${count} ယောက်`,
    builderTagline: "Shwequest ကို တည်ဆောက်သူ",
    viewPhoto: (name) => `${name} ရဲ့ပုံကြည့်ရန်`,
    closePhoto: "ပုံပိတ်ရန်",
    resume: {
      email: "အီးမေးလ်",
      github: "GitHub",
      years: "အတွေ့အကြုံ နှစ်",
      roles: "ရာထူးများ",
      projects: "Live ပရောဂျက်",
      about: "အကြောင်း",
      skills: "ကျွမ်းကျင်မှု",
      experience: "လုပ်ငန်းအတွေ့အကြုံ",
      now: "လက်ရှိ",
      education: "ပညာရေး",
      languages: "ဘာသာစကား",
      work: "လက်ရာများ",
      opensNewTab: "tab အသစ်မှာ ဖွင့်မယ်",
    },
  },
  selfStudy: {
    kicker: "လမ်းကြောင်းဖွင့်",
    title: "ကိုယ်တိုင်သင် — အခမဲ့",
    body: "ကိုယ်တိုင်သင်ယူပါ။ အစီအစဉ်ကြေးမလို — ဒီလမ်းကြောင်း အခမဲ့ပါ။",
    priceLabel: "ဈေးနှုန်း",
    free: "အခမဲ့",
    priceHint: "Ks 0 · အမြဲတမ်း",
    searchLabel: "သင်ခန်းစာရှာရန်",
    searchPlaceholder: "သင်ခန်းစာရှာရန်",
    clear: "ရှာဖွေမှုဖျက်ရန်",
    search: "ရှာရန်",
    layout: "သင်ခန်းစာပြသပုံ",
    card: "ကတ်",
    list: "စာရင်း",
    openLesson: "သင်ခန်းစာဖွင့်ရန်",
    comingSoon: "မကြာမီ",
    emptyLead: "“",
    emptyTail: "” နဲ့ ကိုက်ညီတဲ့ သင်ခန်းစာမရှိပါ။",
    matches: (count) => `ကိုက်ညီတဲ့ သင်ခန်းစာ ${count} ခု`,
    pagination: "သင်ခန်းစာစာမျက်နှာများ",
    prev: "ယခင်စာမျက်နှာ",
    next: "နောက်စာမျက်နှာ",
    page: (n) => `စာမျက်နှာ ${n}`,
    pageOf: (page, total) => `စာမျက်နှာ ${page} / ${total}`,
    back: "ကိုယ်တိုင်သင်သို့",
    sections: "သင်ခန်းစာခေါင်းစဉ်များ",
    content: "သင်ခန်းစာအကြောင်းအရာ",
    playDialog: "စကားပြော ဖွင့်ရန်",
    stopDialog: "ရပ်ရန်",
    playTurn: "ဒီစာကြောင်း နားထောင်ရန်",
    stopTurn: "ဒီစာကြောင်း ရပ်ရန်",
    playReading: "စာပိုဒ် ဖတ်ပြရန်",
    stopReading: "ဖတ်ပြမှု ရပ်ရန်",
    playParagraph: "ဒီစာပိုဒ် နားထောင်ရန်",
    stopParagraph: "ဒီစာပိုဒ် ရပ်ရန်",
    playVocab: "ဒီစကားလုံး နားထောင်ရန်",
    stopVocab: "ဒီစကားလုံး ရပ်ရန်",
    showTranslation: "ဘာသာပြန် ကြည့်ရန်",
    hideTranslation: "ဘာသာပြန် ပိတ်ရန်",
    showMoreSections: "အောက်သို့ စကားစု ၅ ခု ရွှေ့ရန်",
    sectionSearchLabel: "စကားစု သို့မဟုတ် နံပါတ်ရှာရန်",
    sectionSearchPlaceholder: "စကားစု သို့မဟုတ် နံပါတ်…",
    sectionEmptyLead: "“",
    sectionEmptyTail: "” နဲ့ ကိုက်ညီတဲ့ စကားစုမရှိပါ။",
    sectionMatches: (count) => `ကိုက်ညီတဲ့ စကားစု ${count} ခု`,
    day: (n) => `နေ့ ${n}`,
    dayPlan: (days) => `${days} ရက်နဲ့ ပြီးမယ်`,
    dayToggle: (day, from, to) => `နေ့ ${day}၊ စကားစု ${from} မှ ${to}`,
    videosKicker: "လမ်းကြောင်းဖွင့်",
    videosTitle: "အခမဲ့ ဗီဒီယိုများ",
    videosBody:
      "BBC Learning English က speaking ဗီဒီယိုများကို အခမဲ့ ကြည့်ပါ။ အစီအစဉ်ကြေးမလိုပါ။",
    videosPlaylistCount: (count) => `Playlist ${count} ခု`,
    videosChannelCount: (count) => `ချန်နယ် ${count} ခု`,
    videosSearchLabel: "ဗီဒီယိုရှာရန်",
    videosSearchPlaceholder: "ဗီဒီယိုရှာရန်",
    videosChannelLabel: "ချန်နယ်",
    videosChannelAll: "ချန်နယ်အားလုံး",
    videosTopicLabel: "အကြောင်းအရာ",
    videosTopicAll: "အကြောင်းအရာအားလုံး",
    videosTopicGrammar: "Grammar",
    videosTopicSpeaking: "Speaking",
    videosTopicVocabulary: "Vocabulary",
    videosEmptyLead: "“",
    videosEmptyTail: "” နဲ့ ကိုက်ညီတဲ့ ဗီဒီယိုမရှိပါ။",
    videosEmptyChannel: (channel) =>
      `“${channel}” က ဗီဒီယိုမရှိပါ။`,
    videosEmptyTopic: (topic) => `“${topic}” ဗီဒီယိုမရှိပါ။`,
    videosResetFilters: "Filter ပြန်စရန်",
    videosMatches: (count) => `ကိုက်ညီတဲ့ ဗီဒီယို ${count} ခု`,
    videosPlaylistAria: (title) => `YouTube playlist: ${title}`,
    videosOpenOnYouTube: "YouTube မှာ ဖွင့်မယ်",
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
  profile: {
    title: "သင့်ပရိုဖိုင်",
    edit: "ပရိုဖိုင်ပြင်ရန်",
    save: "သိမ်းရန်",
    cancel: "ပယ်ဖျက်ရန်",
    saved: "သိမ်းပြီးပါပြီ",
    changePhoto: "ဓာတ်ပုံ",
    photoTypeError: "ပုံဖိုင်တစ်ခုရွေးပါ။",
    photoSizeError: "ဓာတ်ပုံကို 800 KB အောက်ထားပါ။",
    name: "အမည်",
    bio: "မိတ်ဆက်",
    contact: "ဆက်သွယ်ရန်",
    email: "အီးမေးလ်",
    phone: "ဖုန်း",
    address: "လိပ်စာ",
    social: "လူမှုကွန်ရက်",
    telegram: "Telegram",
    tiktok: "TikTok",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    twitter: "X / Twitter",
    handleHint: "@handle သို့မဟုတ် လင့်ခ်အပြည့်",
    opensNewTab: "တက်ဘ်အသစ်တွင် ဖွင့်မည်",
    courses: "သင့်သင်တန်းများ",
    coursesBody: "၀ယ်ယူပြီး သင်နေတဲ့ ဆရာလမ်းကြောင်းများ။",
    courseCount: (count) => `သင်တန်း ${count} ခု`,
    coursesEmpty: "ဆရာသင်တန်း မရှိသေးပါ။ ဆရာရွေးပြီး လမ်းကြောင်းစပါ။",
    courseXp: (xp) => `ဒီလမ်းကြောင်းပေါ် ${xp} XP ရပြီး`,
    moreTeachers: "လမ်းကြောင်းထပ်လိုချင်လား။",
    planEnded: "အစီအစဉ်ပြီးဆုံး",
    openProfile: "သင့်ပရိုဖိုင်ဖွင့်ရန်",
    statXp: "စုစုပေါင်း XP",
    statRank: "အဆင့်စာရင်း",
    statLessons: "ပြီးသွားသော သင်ခန်းစာ",
    statPlan: "အစီအစဉ်",
    xpToPass: (xp, name) => `${name} ကိုကျော်ဖို့ ${xp} XP လို`,
    topOfBoard: "ထိပ်ဆုံးရောက်နေပြီ",
  },
};

export const messages: Record<Locale, Messages> = { en, my };

/** Native name, so each language stays recognizable in either UI language. */
export function localeLabel(locale: Locale): string {
  return locale === "my" ? "မြန်မာ" : "English";
}
