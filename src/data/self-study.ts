import {
  EVERYDAY_BASIC_ENGLISH_PHRASES,
  type EverydayBasicEnglishPhrase,
} from "@/data/everyday-basic-english";
import {
  FREE_1_ANY_DIALOG_NOTE,
  FREE_1_ANYTIME_DIALOG_NOTE,
  FREE_16_IM_AT_DIALOG_NOTE,
  FREE_16_IM_AT_IN_SWAP_DIALOG_NOTE,
  FREE_16_IM_DESCRIPTIVE_DIALOG_NOTE,
  FREE_16_IM_DIALOG_NOTE,
  FREE_16_IM_GETTING_DIALOG_NOTE,
  FREE_16_IM_GOOD_AT_DIALOG_NOTE,
  FREE_16_IM_IN_DIALOG_NOTE,
  FREE_16_IM_ON_DIALOG_NOTE,
  FREE_16_IM_GONNA_DIALOG_NOTE,
  FREE_16_IM_TRYING_DIALOG_NOTE,
  FREE_16_IM_TRYING_HARDSHIP_DIALOG_NOTE,
  FREE_16_IM_VERB_DIALOG_NOTE,
  type FreeLessonDialogNote,
} from "@/data/any-dialog-note";
import {
  FREE_1_ANY_GRAMMAR,
  FREE_1_ANYTIME_GRAMMAR,
  type FreeLessonGrammar,
} from "@/data/any-grammar";
import {
  FREE_1_ANY_READING,
  FREE_1_ANYTIME_READING,
  type FreeLessonReading,
} from "@/data/any-reading";
import type { TeacherAccent } from "@/data/teachers";

export type { FreeLessonDialogNote } from "@/data/any-dialog-note";
export type { FreeLessonGrammar } from "@/data/any-grammar";
export type { FreeLessonReading } from "@/data/any-reading";

export type FreeLessonDialogSpeaker = "mike" | "sarah";

export type FreeLessonDialogTurn = {
  speaker: FreeLessonDialogSpeaker;
  text: string;
  /** Optional Myanmar gloss under the EN bubble (toggle in UI). */
  textMy?: string;
};

/** Ordered right-pane blocks (note → dialog → note → dialog). When set, prefer over single dialog/dialogNote. */
export type FreeLessonContentBlock =
  | { type: "dialogNote"; note: FreeLessonDialogNote }
  | {
      type: "dialog";
      dialog: FreeLessonDialogTurn[];
      dialogTitle?: string;
      dialogTitleMy?: string;
    };

export type FreeLessonSection = {
  id: string;
  title: string;
  /** Myanmar gloss for the right content pane (optional). */
  bodyMy?: string;
  /** Scenario title above the speaking dialog (optional). */
  dialogTitle?: string;
  /** Myanmar gloss for the dialog scenario title (optional). */
  dialogTitleMy?: string;
  /** EN speaking turns for the white pane under the title stage (optional). */
  dialog?: FreeLessonDialogTurn[];
  /** Dialog-tied lesson note directly under the speaking dialog (optional). */
  dialogNote?: FreeLessonDialogNote;
  /** Interleaved note/dialog blocks (optional; free-16 I'm). Overrides dialog + dialogNote when set. */
  blocks?: FreeLessonContentBlock[];
  /** Grammar notes under the dialog (optional; Any section first). */
  grammar?: FreeLessonGrammar;
  /** Levelled reading under grammar (optional; Any section A1/A2 tab). */
  reading?: FreeLessonReading;
};

/** Dialog for free-1 section "Any" — Planning a Trip. */
const FREE_1_ANY_DIALOG_TITLE = "Planning a Trip";
const FREE_1_ANY_DIALOG_TITLE_MY = "ခရီးသွားဖို့ တိုင်ပင်ခြင်း";

/** Dialog for free-1 section "Any" — EN + optional MY glosses. */
const FREE_1_ANY_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "Do we need any snacks for the trip?",
    textMy: "ခရီးအတွက် snack တစ်ခုခု လိုသေးလား။",
  },
  {
    speaker: "sarah",
    text: "Yes, but we don't have any chips left at home.",
    textMy: "လိုတယ်၊ ဒါပေမယ့် အိမ်မှာ chips မကျန်တော့ဘူး။",
  },
  {
    speaker: "mike",
    text: "Should I buy potato chips or corn chips?",
    textMy: "အာလူး chips ဝယ်ရမလား၊ ပြောင်း chips ဝယ်ရမလား။",
  },
  {
    speaker: "sarah",
    text: "Any kind is fine with me. Just get some water too.",
    textMy: "ဘယ်အမျိုးအစားဖြစ်ဖြစ် ရပါတယ်။ ရေလည်း နည်းနည်းပါ ဝယ်ပေးပါ။",
  },
  {
    speaker: "mike",
    text: "Is there anyone else coming with us?",
    textMy: "နောက်ထပ် ဘယ်သူမှ လိုက်လာမှာလား။",
  },
  {
    speaker: "sarah",
    text: "No, I didn't invite anyone. We can go anywhere we want.",
    textMy: "မရှိဘူး၊ ဘယ်သူ့ကိုမှ ဖိတ်မထားဘူး။ ငါတို့ သွားချင်တဲ့နေရာ ဘယ်နေရာမဆို သွားလို့ရတယ်။",
  },
  {
    speaker: "mike",
    text: "Great! What time should I pick you up?",
    textMy: "ကောင်းပြီ! မင်းကို ဘယ်အချိန် လာခေါ်ရမလဲ။",
  },
	{
		speaker: "sarah",
		text: "Any time after 9 AM is perfect.",
		textMy: "မနက် ၉ နာရီနောက်ပိုင်း အချိန်မရွေး အဆင်ပြေပါတယ်။",
	},
];

	/** Dialog for free-1 section "Anytime." — Helping a Friend. */
	const FREE_1_ANYTIME_DIALOG_TITLE = "Helping a Friend";
	const FREE_1_ANYTIME_DIALOG_TITLE_MY = "သူငယ်ချင်းကို ကူညီပေးခြင်း";

	const FREE_1_ANYTIME_DIALOG: FreeLessonDialogTurn[] = [
	{
		speaker: "mike",
		text: "Thanks so much for helping me fix my computer, Sarah.",
		textMy: "ငါ့ကွန်ပျူတာကို ပြင်ပေးတဲ့အတွက် ကျေးဇူးအများကြီးတင်ပါတယ် ဆာရာ။",
	},
	{
		speaker: "sarah",
		text: "Anytime, Mike! It was an easy fix.",
		textMy: "ရပါတယ် မိုက်ခ်ရာ ဘယ်အချိန်ဖြစ်ဖြစ် ကူညီပေးပါ့မယ်။ ပြင်ရတာ လွယ်လွယ်လေးပါ။",
	},
	{
		speaker: "mike",
		text: "If it breaks down again, when can I bring it to you?",
		textMy: "အကယ်၍ ထပ်ပျက်သွားရင် မင်းဆီကို ဘယ်အချိန် ယူလာလို့ရမလဲ။",
	},
	{
		speaker: "sarah",
		text: "You can drop by my house anytime tomorrow. I'll be home all day.",
		textMy: "မနက်ဖြန် ဘယ်အချိန်ဖြစ်ဖြစ် ငါ့အိမ်ကို ဝင်ခဲ့လို့ရတယ်။ ငါ တစ်နေကုန် အိမ်မှာရှိမယ်။",
	},
	{
		speaker: "mike",
		text: "Great! I will come anytime after lunch.",
		textMy: "ကောင်းပြီလေ။ နေ့လယ်စာစားပြီး ကြိုက်တဲ့အချိန် လာခဲ့မယ်။",
	},
	{
		speaker: "sarah",
		text: "Sounds good. Call me anytime if you have more problems.",
		textMy: "အဆင်ပြေပါတယ်။ နောက်ထပ် အခက်အခဲရှိရင်လည်း ဘယ်အချိန်ဖြစ်ဖြစ် ဖုန်းဆက်လိုက်ပါ။",
	},
];

/** Dialog for free-16 "Basic usage of 'I'm'" — Mike (boy) basic lines. */
const FREE_16_IM_DIALOG_TITLE = "Talking about myself";
const FREE_16_IM_DIALOG_TITLE_MY = "ကိုယ့်အကြောင်း ပြောပြခြင်း";

const FREE_16_IM_DIALOG: FreeLessonDialogTurn[] = [
  { speaker: "mike", text: "I'm so tired.", textMy: "ငါ အရမ်းပင်ပန်းနေတယ်။" },
  {
    speaker: "mike",
    text: "I'm confused.",
    textMy: "ငါ ရှုပ်နေတယ် / နားမလည်ဖြစ်နေတယ်။",
  },
  { speaker: "mike", text: "I'm happy.", textMy: "ငါ ပျော်နေတယ်။" },
  {
    speaker: "mike",
    text: "I'm twenty three years old.",
    textMy: "ငါ အသက် ၂၃ နှစ်ရှိပြီ။",
  },
  { speaker: "mike", text: "I'm hungry.", textMy: "ငါ ဗိုက်ဆာနေတယ်။" },
  {
    speaker: "mike",
    text: "I'm nervous.",
    textMy: "ငါ တုန်လှုပ် / စိုးရိမ်နေတယ်။",
  },
  { speaker: "mike", text: "I'm excited.", textMy: "ငါ စိတ်လှုပ်ရှားနေတယ်။" },
  {
    speaker: "mike",
    text: "I'm leaving work.",
    textMy: "ငါ အလုပ်က ထွက်လာတော့မယ်။",
  },
  { speaker: "mike", text: "I'm thirsty.", textMy: "ငါ ရေဆာနေတယ်။" },
  { speaker: "mike", text: "I'm from Seattle.", textMy: "ငါ Seattle ကပါ။" },
];

/** Dialog for free-16 descriptive intensifiers — Sarah (girl). */
const FREE_16_IM_DESCRIPTIVE_DIALOG_TITLE = "Making feelings stronger";
const FREE_16_IM_DESCRIPTIVE_DIALOG_TITLE_MY =
  "ခံစားချက်ကို ပိုပြင်းထန်အောင် ပြောခြင်း";

const FREE_16_IM_DESCRIPTIVE_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "sarah",
    text: "I'm extremely tired.",
    textMy: "ငါ အလွန်ပင်ပန်းနေတယ်။",
  },
  { speaker: "sarah", text: "I'm very happy.", textMy: "ငါ အရမ်းပျော်နေတယ်။" },
  {
    speaker: "sarah",
    text: "I'm terribly hungry.",
    textMy: "ငါ အရမ်းဗိုက်ဆာနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am super excited.",
    textMy: "ငါ အရမ်းစိတ်လှုပ်ရှားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm very nervous.",
    textMy: "ငါ အရမ်းတုန်လှုပ် / စိုးရိမ်နေတယ်။",
  },
];

/** Dialogs for free-16 "Variations of 'I'm in/at/on'". */
const FREE_16_IM_IN_DIALOG_TITLE = "Being inside a place";
const FREE_16_IM_IN_DIALOG_TITLE_MY = "နေရာတစ်ခုရဲ့ အတွင်းမှာ ရှိနေခြင်း";

const FREE_16_IM_IN_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "I'm in the shower.",
    textMy: "ငါ ရေချိုးခန်းထဲမှာ ရှိနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm in the lobby.",
    textMy: "ငါ lobby ထဲမှာ ရှိနေတယ်။",
  },
  { speaker: "mike", text: "I'm in a car.", textMy: "ငါ ကားထဲမှာ ရှိနေတယ်။" },
  {
    speaker: "mike",
    text: "I'm in a house.",
    textMy: "ငါ အိမ်ထဲမှာ ရှိနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm in a school.",
    textMy: "ငါ ကျောင်းထဲမှာ ရှိနေတယ်။",
  },
];

const FREE_16_IM_AT_DIALOG_TITLE = "Saying where you are";
const FREE_16_IM_AT_DIALOG_TITLE_MY = "ဘယ်နေရာ ရောက်နေတယ်ဆိုတာ ပြောခြင်း";

const FREE_16_IM_AT_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "sarah",
    text: "I'm at the grocery.",
    textMy: "ငါ ကုန်စုံဆိုင်မှာ ရောက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm at the mall.",
    textMy: "ငါ mall မှာ ရောက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm at the doctor's office.",
    textMy: "ငါ ဆရာဝန်ရုံးမှာ ရောက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm at the park.",
    textMy: "ငါ ပန်းခြံမှာ ရောက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm at the airport.",
    textMy: "ငါ လေဆိပ်မှာ ရောက်နေတယ်။",
  },
];

const FREE_16_IM_AT_IN_SWAP_DIALOG_TITLE = "Same place, either word";
const FREE_16_IM_AT_IN_SWAP_DIALOG_TITLE_MY =
  "တူညီတဲ့နေရာ — at / in နှစ်ခုလုံး သုံးနိုင်ခြင်း";

const FREE_16_IM_AT_IN_SWAP_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "I'm at the mall.",
    textMy: "ငါ mall မှာ ရောက်နေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm in the mall.",
    textMy: "ငါ mall ထဲမှာ ရှိနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm at the park.",
    textMy: "ငါ ပန်းခြံမှာ ရောက်နေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm in the park.",
    textMy: "ငါ ပန်းခြံထဲမှာ ရှိနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm at the grocery.",
    textMy: "ငါ ကုန်စုံဆိုင်မှာ ရောက်နေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm in the grocery.",
    textMy: "ငါ ကုန်စုံဆိုင်ထဲမှာ ရှိနေတယ်။",
  },
];

const FREE_16_IM_ON_DIALOG_TITLE = "Busy with something";
const FREE_16_IM_ON_DIALOG_TITLE_MY = "တစ်ခုခုမှာ အချိန်ပေးနေခြင်း";

const FREE_16_IM_ON_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "sarah",
    text: "I'm on the phone.",
    textMy: "ငါ ဖုန်းပြောနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm on my computer.",
    textMy: "ငါ ကွန်ပျူတာ သုံးနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm on a bus.",
    textMy: "ငါ ဘတ်စ်ကားပေါ်မှာ ရှိနေတယ်။",
  },
];

/** Dialog for free-16 "I'm good at" — Mike (boy). */
const FREE_16_IM_GOOD_AT_DIALOG_TITLE = "Talking about skills";
const FREE_16_IM_GOOD_AT_DIALOG_TITLE_MY = "ကျွမ်းကျင်မှုတွေအကြောင်း ပြောခြင်း";

const FREE_16_IM_GOOD_AT_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "I'm good at drawing.",
    textMy: "ငါ ပုံဆွဲတာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at video games.",
    textMy: "ငါ ဗီဒီယိုဂိမ်း ကစားတာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at swimming.",
    textMy: "ငါ ရေကူးတာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at driving.",
    textMy: "ငါ ကားမောင်းတာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at reading.",
    textMy: "ငါ စာဖတ်တာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at sports.",
    textMy: "ငါ အားကစားမှာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at writing.",
    textMy: "ငါ စာရေးတာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at math.",
    textMy: "ငါ သင်္ချာမှာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at dancing.",
    textMy: "ငါ ကခုန်တာ ကျွမ်းကျင်တယ်။",
  },
  {
    speaker: "mike",
    text: "I'm good at chess.",
    textMy: "ငါ စစ်တုရင် ကစားတာ ကျွမ်းကျင်တယ်။",
  },
];

/** Dialog for free-16 "I'm + (verb)" — Sarah (girl). */
const FREE_16_IM_VERB_DIALOG_TITLE = "Saying what I'm doing";
const FREE_16_IM_VERB_DIALOG_TITLE_MY = "လက်ရှိလုပ်နေတာ / ဖြစ်နေတာကို ပြောခြင်း";

const FREE_16_IM_VERB_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "sarah",
    text: "I'm eating lunch.",
    textMy: "ငါ နေ့လယ်စာ စားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm brushing my teeth.",
    textMy: "ငါ သွားတိုက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm scared.",
    textMy: "ငါ ကြောက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm driving to work.",
    textMy: "ငါ အလုပ်ကို ကားမောင်းသွားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm crying.",
    textMy: "ငါ ငိုနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm typing an email.",
    textMy: "ငါ email ရိုက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm cooking dinner.",
    textMy: "ငါ ညစာ ချက်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm combing my hair.",
    textMy: "ငါ ဆံပင် ဖြီးနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm hanging a picture.",
    textMy: "ငါ ပုံတစ်ပုံ ချိတ်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am texting.",
    textMy: "ငါ စာပို့နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am dancing.",
    textMy: "ငါ ကခုန်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am interested in the job.",
    textMy: "ငါ အဲဒီအလုပ်ကို စိတ်ဝင်စားတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am exercising.",
    textMy: "ငါ လေ့ကျင့်ခန်း လုပ်နေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am sad.",
    textMy: "ငါ ဝမ်းနည်းနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I am learning.",
    textMy: "ငါ သင်ယူနေတယ်။",
  },
];

/** Dialog for free-16 "I'm getting" — Mike (boy). */
const FREE_16_IM_GETTING_DIALOG_TITLE = "Saying what I'm getting";
const FREE_16_IM_GETTING_DIALOG_TITLE_MY =
  "ဖြစ်လာနေတာ / ရရှိတော့မယ်ဆိုတာ ပြောခြင်း";

const FREE_16_IM_GETTING_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "I'm getting better.",
    textMy: "ငါ ပိုကောင်းလာနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting ready for bed.",
    textMy: "ငါ အိပ်ဖို့ ပြင်ဆင်နေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting a tooth ache.",
    textMy: "ငါ သွားကိုက်လာနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting a cold.",
    textMy: "ငါ အအေးမိလာနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting married.",
    textMy: "ငါ လက်ထပ်တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting tired.",
    textMy: "ငါ ပင်ပန်းလာနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting good at reading.",
    textMy: "ငါ စာဖတ်တာ ပိုကျွမ်းကျင်လာနေတယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting a new car.",
    textMy: "ငါ ကားအသစ် ရတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting a job.",
    textMy: "ငါ အလုပ်ရတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm getting a puppy.",
    textMy: "ငါ ခွေးကလေး ရတော့မယ်။",
  },
];

/** Dialog for free-16 "I'm trying + (verb)" — Sarah (girl), effort. */
const FREE_16_IM_TRYING_DIALOG_TITLE = "Saying what I'm trying";
const FREE_16_IM_TRYING_DIALOG_TITLE_MY = "ကြိုးစားလုပ်နေတာကို ပြောခြင်း";

const FREE_16_IM_TRYING_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "sarah",
    text: "I'm trying to get a job.",
    textMy: "ငါ အလုပ်ရဖို့ ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to call my family.",
    textMy: "ငါ မိသားစုကို ဖုန်းဆက်ဖို့ ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to enjoy my dinner.",
    textMy: "ငါ ညစာကို ပျော်ပျော်ရွှင်ရွှင် စားဖို့ ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to educate myself.",
    textMy: "ငါ ကိုယ့်ကိုယ်ကို ပညာတတ်အောင် ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to explain myself.",
    textMy: "ငါ ကိုယ့်အကြောင်းကို ရှင်းပြဖို့ ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying new food.",
    textMy: "ငါ အစားအသောက်အသစ် စမ်းသုံးနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to eat healthy.",
    textMy: "ငါ ကျန်းမာရေးနဲ့ညီအောင် စားဖို့ ကြိုးစားနေတယ်။",
  },
  {
    speaker: "sarah",
    text: "I'm trying to understand.",
    textMy: "ငါ နားလည်အောင် ကြိုးစားနေတယ်။",
  },
];

/** Dialog for free-16 "trying" as hardship — Mike (boy). */
const FREE_16_IM_TRYING_HARDSHIP_DIALOG_TITLE = "When something is trying";
const FREE_16_IM_TRYING_HARDSHIP_DIALOG_TITLE_MY =
  "ပင်ပန်း / စိတ်ဖိစီးစရာ ဖြစ်ခြင်း";

const FREE_16_IM_TRYING_HARDSHIP_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "Learning new things can be trying on you.",
    textMy:
      "အသစ်အဆန်းတွေ သင်ယူရတာက သင့်အတွက် ပင်ပန်း / စိတ်ဖိစီးစရာ ဖြစ်နိုင်ပါတယ်။",
  },
  {
    speaker: "mike",
    text: "That marathon was very trying on me.",
    textMy: "အဲဒီ marathon က ငါ့အတွက် အရမ်းပင်ပန်း / စိတ်ဖိစီးစရာ ဖြစ်ခဲ့တယ်။",
  },
];

/** Dialog for free-16 "I'm gonna + (verb)" — Mike (boy). */
const FREE_16_IM_GONNA_DIALOG_TITLE = "Saying what I'm gonna do";
const FREE_16_IM_GONNA_DIALOG_TITLE_MY = "လုပ်ဖို့ အစီအစဉ်ရှိတာကို ပြောခြင်း";

const FREE_16_IM_GONNA_DIALOG: FreeLessonDialogTurn[] = [
  {
    speaker: "mike",
    text: "I'm gonna have some coffee.",
    textMy: "ငါ ကော်ဖီ သောက်တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna go to work.",
    textMy: "ငါ အလုပ် သွားတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna eat some cake.",
    textMy: "ငါ ကိတ်မုန့် စားတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna send out my resume.",
    textMy: "ငါ ငါ့ resume ပို့တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna run a marathon.",
    textMy: "ငါ marathon ပြေးတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna ask her out for dinner.",
    textMy: "ငါ သူမကို ညစာ စားဖို့ ဖိတ်တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna stop smoking.",
    textMy: "ငါ ဆေးလိပ် ဖြတ်တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna help my friends.",
    textMy: "ငါ သူငယ်ချင်းတွေကို ကူညီတော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna take swim lessons.",
    textMy: "ငါ ရေကူး သင်တန်း တက်တော့မယ်။",
  },
  {
    speaker: "mike",
    text: "I'm gonna read a book.",
    textMy: "ငါ စာအုပ် ဖတ်တော့မယ်။",
  },
];

function withFree1AnyDialog(sections: FreeLessonSection[]): FreeLessonSection[] {
  return sections.map((section) => {
    if (section.id === "free-1-s1") {
      return {
        ...section,
        dialogTitle: FREE_1_ANY_DIALOG_TITLE,
        dialogTitleMy: FREE_1_ANY_DIALOG_TITLE_MY,
        dialog: FREE_1_ANY_DIALOG,
        dialogNote: FREE_1_ANY_DIALOG_NOTE,
        grammar: FREE_1_ANY_GRAMMAR,
        reading: FREE_1_ANY_READING,
      };
    }
    if (section.id === "free-1-s2") {
      return {
        ...section,
        dialogTitle: FREE_1_ANYTIME_DIALOG_TITLE,
        dialogTitleMy: FREE_1_ANYTIME_DIALOG_TITLE_MY,
        dialog: FREE_1_ANYTIME_DIALOG,
        dialogNote: FREE_1_ANYTIME_DIALOG_NOTE,
        grammar: FREE_1_ANYTIME_GRAMMAR,
        reading: FREE_1_ANYTIME_READING,
      };
    }
    return section;
  });
}

function withFree16ImDialog(sections: FreeLessonSection[]): FreeLessonSection[] {
  return sections.map((section) => {
    if (section.id === "free-16-s1") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_DIALOG,
            dialogTitle: FREE_16_IM_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_DIALOG_TITLE_MY,
          },
          { type: "dialogNote", note: FREE_16_IM_DESCRIPTIVE_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_DESCRIPTIVE_DIALOG,
            dialogTitle: FREE_16_IM_DESCRIPTIVE_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_DESCRIPTIVE_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s2") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_IN_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_IN_DIALOG,
            dialogTitle: FREE_16_IM_IN_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_IN_DIALOG_TITLE_MY,
          },
          { type: "dialogNote", note: FREE_16_IM_AT_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_AT_DIALOG,
            dialogTitle: FREE_16_IM_AT_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_AT_DIALOG_TITLE_MY,
          },
          { type: "dialogNote", note: FREE_16_IM_AT_IN_SWAP_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_AT_IN_SWAP_DIALOG,
            dialogTitle: FREE_16_IM_AT_IN_SWAP_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_AT_IN_SWAP_DIALOG_TITLE_MY,
          },
          { type: "dialogNote", note: FREE_16_IM_ON_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_ON_DIALOG,
            dialogTitle: FREE_16_IM_ON_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_ON_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s3") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_GOOD_AT_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_GOOD_AT_DIALOG,
            dialogTitle: FREE_16_IM_GOOD_AT_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_GOOD_AT_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s4") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_VERB_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_VERB_DIALOG,
            dialogTitle: FREE_16_IM_VERB_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_VERB_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s5") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_GETTING_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_GETTING_DIALOG,
            dialogTitle: FREE_16_IM_GETTING_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_GETTING_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s6") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_TRYING_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_TRYING_DIALOG,
            dialogTitle: FREE_16_IM_TRYING_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_TRYING_DIALOG_TITLE_MY,
          },
          { type: "dialogNote", note: FREE_16_IM_TRYING_HARDSHIP_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_TRYING_HARDSHIP_DIALOG,
            dialogTitle: FREE_16_IM_TRYING_HARDSHIP_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_TRYING_HARDSHIP_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    if (section.id === "free-16-s7") {
      return {
        ...section,
        blocks: [
          { type: "dialogNote", note: FREE_16_IM_GONNA_DIALOG_NOTE },
          {
            type: "dialog",
            dialog: FREE_16_IM_GONNA_DIALOG,
            dialogTitle: FREE_16_IM_GONNA_DIALOG_TITLE,
            dialogTitleMy: FREE_16_IM_GONNA_DIALOG_TITLE_MY,
          },
        ],
      };
    }
    return section;
  });
}

export type FreeLesson = {
  id: string;
  title: string;
  /** Myanmar gloss under the listing / course title (optional). */
  titleMy?: string;
  /** Myanmar course pitch shown in the page banner (optional). */
  descriptionMy?: string;
  image: string;
  duration: string;
  accent: TeacherAccent;
  /** When true, listing links to the course. Omit/false → Coming Soon (not clickable). */
  available?: boolean;
  /** Sidebar titles for the course detail shell (content pane later). */
  sections: FreeLessonSection[];
};

/** Shared cover until each free lesson has its own art. */
export const FREE_LESSON_PLACEHOLDER_IMAGE = "/self-study/placeholder.svg";

function sections(courseId: string, titles: string[]): FreeLessonSection[] {
  return titles.map((title, index) => ({
    id: `${courseId}-s${index + 1}`,
    title,
  }));
}

function sectionsFromPhrases(
  courseId: string,
  phrases: EverydayBasicEnglishPhrase[],
): FreeLessonSection[] {
  return phrases.map((phrase, index) => ({
    id: `${courseId}-s${index + 1}`,
    title: phrase.title,
    ...(phrase.bodyMy ? { bodyMy: phrase.bodyMy } : {}),
  }));
}

/** Placeholder free lessons for the self-study listing. */
export const FREE_LESSONS: FreeLesson[] = [
  {
    id: "free-1",
    title: "Everyday Basic English Speaking",
    image: "/self-study/everyday-basic-english-speaking.webp",
    duration: "891",
    accent: "emerald",
    available: true,
    sections: withFree1AnyDialog(
      sectionsFromPhrases("free-1", EVERYDAY_BASIC_ENGLISH_PHRASES),
    ),
  },
  {
    id: "free-16",
    title: "Essential Spoken English Patterns",
    titleMy: "မသိမဖြစ် အင်္ဂလိပ်စကားပြော ပုံစံများ",
    descriptionMy:
      "၉ ရက်တာ စိန်ခေါ်မှုကို လက်ခံဖို့ အဆင်သင့်ပဲလား? နေ့တိုင်း ၁၀ ခုစီပဲ မပျက်မကွက် လေ့လာသွားပါ။ တစ်ပတ်ကျော်ရုံလေးနဲ့ အစကနေ အဆုံးထိ ကျွမ်းကျင်သွားမယ့် ရလဒ်က သင့်ကို အံ့အားသင့်စေမှာပါ။",
    image: "/self-study/essential-spoken-english-patterns.webp",
    duration: "89",
    accent: "sky",
    available: true,
    sections: withFree16ImDialog(
      sections("free-16", [
      "Basic usage of 'I'm'",
      "Variations of 'I'm in/at/on'",
      "I'm good at",
      "I'm + (verb)",
      "I'm getting",
      "I'm trying + (verb)",
      "I'm gonna + (verb)",
      "I have + (noun)",
      "I have + (past participle)",
      "I used to + (verb)",
      "I have to + (verb)",
      "I wanna + (verb)",
      "I gotta + (verb)",
      "I would like to + (verb)",
      "I plan to + (verb)",
      "I've decided to + (verb)",
      "I was about to + (verb)",
      "I didn't mean to + (verb)",
      "I don't have time to + (verb)",
      "I promise not to + (verb)",
      "I'd rather + (verb)",
      "I feel like + (verb-ing)",
      "I can't help + (verb-ing)",
      "I was busy + (verb-ing)",
      "I'm not used to + (verb-ing)",
      "I want you to + (verb)",
      "I'm here to + (verb)",
      "I have something + (verb)",
      "I'm looking forward to",
      "I'm calling to + (verb)",
      "I'm working on + (noun)",
      "I'm sorry to + (verb)",
      "I'm thinking of + (verb-ing)",
      "I'll help you + (verb)",
      "I'm dying to + (verb)",
      "It's my turn to + (verb)",
      "It's hard for me to + (verb)",
      "I'm having a hard time + (verb-ing)",
      "I think I should + (verb)",
      "I've heard that + (subject + verb)",
      "It occurred to me that (subject + verb)",
      "Let me + (verb)",
      "Thank you for",
      "Can I + (verb)",
      "Can I get + (noun)",
      "I'm not sure if (subject + verb)",
      "Do you mind if I + (verb)",
      "I don't know what to + (verb)",
      "I should have + (past participle)",
      "I wish I could + (verb)",
      "You should + (verb)",
      "You're supposed to + (verb)",
      "You seem + (adjective)",
      "You'd better + (verb)",
      "Are you into + (noun)",
      "Are you trying to + (verb)",
      "Please + (verb)",
      "Don't + (verb)",
      "Do you like",
      "How often do you",
      "Do you want me to + (verb)",
      "What do you think about (verb-ing)",
      "Why don't we + (verb)",
      "It's too bad that",
      "You could have + (past participle)",
      "If I were you, I would + (verb)",
      "It's gonna be + (adjective)",
      "It looks like + (noun)",
      "That's why + (subject + verb)",
      "It's time to + (verb)",
      "The point is that + (subject + verb)",
      "How was + (noun)",
      "How about + (verb-ing)",
      "What if + (subject + verb)",
      "How much does it cost to + (verb)",
      "How come + (subject + verb)",
      "What are the chances of + (verb-ing)",
      "There is something wrong with + (noun)",
      "Let's not + (verb)",
      "Let's say that + (subject + verb)",
      "There's no need to + (verb)",
      "It takes + (time) + to + (verb)",
      "Please make sure that + (subject + verb)",
      "Here's to + (noun)",
      "It's no use + (verb-ing)",
      "There's no way + (subject + verb)",
      "It's very kind of you to + (verb)",
      "There's nothing + (subject) + can + (verb)",
      "Rumor has it that + (subject + verb)",
      ]),
    ),
  },
  {
    id: "free-2",
    title: "Greetings at the Market",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:45",
    accent: "amber",
    sections: sections("free-2", [
      "Hello & goodbye",
      "Asking the price",
      "Polite thanks",
      "Market role-play",
    ]),
  },
  {
    id: "free-3",
    title: "Numbers 1 to 20",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:10",
    accent: "sky",
    sections: sections("free-3", [
      "Count 1–10",
      "Count 11–20",
      "How many?",
      "Quick quiz",
    ]),
  },
  {
    id: "free-4",
    title: "Simple Questions",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:02",
    accent: "emerald",
    sections: sections("free-4", [
      "What / Where",
      "Who / When",
      "Yes–no questions",
      "Practice pairs",
    ]),
  },
  {
    id: "free-5",
    title: "Daily Routines",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:30",
    accent: "amber",
    sections: sections("free-5", [
      "Morning steps",
      "At school",
      "Evening wind-down",
      "Tell your day",
    ]),
  },
  {
    id: "free-6",
    title: "Food Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:48",
    accent: "sky",
    sections: sections("free-6", [
      "Fruit & veg",
      "Meals",
      "I like / I don't like",
      "Order aloud",
    ]),
  },
  {
    id: "free-7",
    title: "Polite Phrases",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:55",
    accent: "emerald",
    sections: sections("free-7", [
      "Please & thank you",
      "Excuse me",
      "Sorry & it's okay",
      "Soften a request",
    ]),
  },
  {
    id: "free-8",
    title: "Listening Warm-up",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "8:15",
    accent: "amber",
    sections: sections("free-8", [
      "Sound check",
      "Short clip A",
      "Short clip B",
      "What did you hear?",
    ]),
  },
  {
    id: "free-9",
    title: "Colors & Shapes",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:12",
    accent: "sky",
    sections: sections("free-9", [
      "Basic colors",
      "Shapes around us",
      "Describe an object",
      "Find & say",
    ]),
  },
  {
    id: "free-10",
    title: "Family Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:05",
    accent: "emerald",
    sections: sections("free-10", [
      "Parents & siblings",
      "Grandparents",
      "This is my…",
      "Family tree talk",
    ]),
  },
  {
    id: "free-11",
    title: "Weather Talk",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:40",
    accent: "amber",
    sections: sections("free-11", [
      "Sunny / rainy",
      "Hot & cold",
      "What's it like today?",
      "Pack for the weather",
    ]),
  },
  {
    id: "free-12",
    title: "Time of Day",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:55",
    accent: "sky",
    sections: sections("free-12", [
      "Morning / afternoon",
      "Evening / night",
      "What time is it?",
      "Plan your hours",
    ]),
  },
  {
    id: "free-13",
    title: "At the Cafe",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:20",
    accent: "emerald",
    sections: sections("free-13", [
      "Menu words",
      "Ordering drinks",
      "Paying politely",
      "Cafe dialogue",
    ]),
  },
  {
    id: "free-14",
    title: "Body Parts",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:30",
    accent: "amber",
    sections: sections("free-14", [
      "Head & face",
      "Arms & hands",
      "Legs & feet",
      "Point & name",
    ]),
  },
  {
    id: "free-15",
    title: "Weekend Plans",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:18",
    accent: "sky",
    sections: sections("free-15", [
      "Fun activities",
      "I'm going to…",
      "Invite a friend",
      "Share your plan",
    ]),
  },
];

export function freeLessonById(id: string): FreeLesson | undefined {
  return FREE_LESSONS.find((lesson) => lesson.id === id);
}

export function freeLessonStaticParams(): { id: string }[] {
  return FREE_LESSONS.map((lesson) => ({ id: lesson.id }));
}

export function freeLessonHref(id: string, sectionId?: string): string {
  if (!sectionId) return `/self-study/${id}`;
  return `/self-study/${id}?section=${encodeURIComponent(sectionId)}`;
}

/** Pick a valid section id from `?section=`; fall back to the first section. */
export function resolveFreeLessonSectionId(
  sections: readonly { id: string }[],
  requested: string | null | undefined,
): string {
  const first = sections[0]?.id ?? "";
  if (!requested) return first;
  return sections.some((section) => section.id === requested)
    ? requested
    : first;
}
