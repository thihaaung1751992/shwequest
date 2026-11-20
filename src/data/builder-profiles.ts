export type ResumeLink = { label: string; href: string };

export type ResumeJob = {
  role: string;
  company: string;
  city: string;
  period: string;
  current?: boolean;
  points: readonly string[];
};

export type SkillTone = "sky" | "amber" | "emerald" | "orange";

export type BuilderProfile = {
  headline: string;
  location: string;
  email: string;
  github: string;
  yearsExperience: string;
  about: string;
  skills: readonly { title: string; tone: SkillTone; items: readonly string[] }[];
  experience: readonly ResumeJob[];
  education: readonly { degree: string; school: string; period: string }[];
  languages: readonly { name: string; level: string; percent: number }[];
  projects: readonly { title: string; tone: SkillTone; links: readonly ResumeLink[] }[];
};

/** Public CV only. Phone and home address stay off the site on purpose. */
export const THIHA_AUNG_PROFILE: BuilderProfile = {
  headline: "Web Developer",
  location: "Yangon, Myanmar",
  email: "thihaaung1751992@gmail.com",
  github: "https://github.com/thihaaung225278",
  yearsExperience: "5+",
  about:
    "Solutions-oriented web developer with 5+ years in front-end development (HTML/CSS, JavaScript, React) and modern web architectures. Uses AI coding assistants (Cursor AI) and LLMs (Gemini, DeepSeek) with advanced meta-prompting to speed up code generation and debugging. Eager to learn workflow automation through APIs and Google Apps Script, and currently studying multi-agent frameworks (CrewAI, LangGraph) and RAG to build fast, intelligent digital products.",
  skills: [
    {
      title: "Core",
      tone: "sky",
      items: ["HTML / CSS", "JavaScript", "React", "WordPress", "Google Apps Script"],
    },
    {
      title: "AI tools & workflow",
      tone: "amber",
      items: ["Cursor AI", "Gemini", "DeepSeek", "Meta-prompting"],
    },
    {
      title: "AI concepts",
      tone: "emerald",
      items: ["RAG architecture", "Vector databases", "MCP (Model Context Protocol)"],
    },
    {
      title: "Currently learning",
      tone: "orange",
      items: ["CrewAI", "LangGraph", "AutoGen", "Python"],
    },
  ],
  experience: [
    {
      role: "Senior Web Developer (Frontend)",
      company: "Clickr Media Co., Ltd",
      city: "Yangon",
      period: "2022 – Present",
      current: true,
      points: [
        "Builds SharePoint projects for DBS Bank with JavaScript, jQuery and SharePoint.",
        "Creates WordPress projects with ACF.",
        "Creates WordPress projects with Gutenberg and React for custom blocks.",
        "Brought AI coding assistants (Cursor AI, Gemini) into daily work to speed up development, debugging and code generation.",
      ],
    },
    {
      role: "Web Developer (Frontend)",
      company: "Clickr Media Co., Ltd",
      city: "Yangon",
      period: "2019 – 2020",
      points: [
        "Built websites for Singapore clients on WordPress (HTML, CSS, UIkit, Bootstrap, JavaScript, jQuery).",
        "Maintained WordPress (CMS) websites.",
      ],
    },
    {
      role: "Junior Web Developer",
      company: "Digital Dots Creative Digital Agency",
      city: "Yangon",
      period: "2016 – 2017",
      points: [
        "Customized WordPress themes.",
        "Built responsive website templates with CSS, Bootstrap and JavaScript.",
        "Maintained WordPress websites and solved client issues.",
      ],
    },
    {
      role: "Junior Web Developer",
      company: "Media Lane The Creative Agency",
      city: "Yangon",
      period: "2015 – 2016",
      points: [
        "Created templates with HTML, CSS, Bootstrap, JavaScript and jQuery.",
        "Maintained WordPress websites.",
      ],
    },
  ],
  education: [
    {
      degree: "B.C.Tech",
      school: "University of Computer Studies, Mandalay",
      period: "2010 – 2013",
    },
  ],
  languages: [
    { name: "Myanmar", level: "Native", percent: 100 },
    { name: "English", level: "Intermediate · strong reading & writing", percent: 70 },
  ],
  projects: [
    {
      title: "WordPress",
      tone: "sky",
      links: [
        { label: "Clickr Media", href: "https://www.clickrmedia.com/" },
        { label: "Teleflex", href: "https://teleflex-criticalcare.com/anz/" },
        { label: "Setsco", href: "https://www.setsco.com/" },
        { label: "Tanoto Foundation", href: "https://www.tanotofoundation.org/" },
        { label: "Kinz Trading", href: "https://kinztrading.com.sg/" },
      ],
    },
    {
      title: "React",
      tone: "emerald",
      links: [
        { label: "Team management", href: "https://team-management-with-react.netlify.app/" },
        { label: "Profile two", href: "https://profile-two-with-react.netlify.app/" },
        { label: "Profile one", href: "https://profile-one-with-react.netlify.app/" },
        { label: "Todo app", href: "https://react-todo-one.netlify.app/" },
      ],
    },
    {
      title: "HTML, CSS, JavaScript",
      tone: "amber",
      links: [
        { label: "Clickr rebranding", href: "https://clickr-myanmar.netlify.app/" },
        { label: "LionsBot for Clickr", href: "https://thihaaung225278.github.io/LionsBot-for-Clickr-/" },
        { label: "Project for Clickr", href: "https://thihaaung225278.github.io/project_for_clickr/" },
        { label: "Profile one", href: "https://profile-one.netlify.app/" },
        { label: "Learning page", href: "https://thihaaung225278.github.io/Learning_page/" },
        { label: "India landing page", href: "https://thihaaung225278.github.io/india_d_page_with_html_javascript/" },
        { label: "Hamburger navigation", href: "https://hamburger-navigation.netlify.app/" },
        { label: "Clickr Run", href: "https://clickr-run.netlify.app/" },
      ],
    },
    {
      title: "Vue.js",
      tone: "orange",
      links: [
        { label: "Live chat", href: "https://live-chat-with-vue-capi.web.app/" },
      ],
    },
  ],
};
