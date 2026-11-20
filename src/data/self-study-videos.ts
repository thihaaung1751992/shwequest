/** Free YouTube playlists shown on `/self-study/videos`. */

export type SelfStudyPlaylistTopic =
  | "grammar"
  | "speaking"
  | "vocabulary";

export const SELF_STUDY_PLAYLIST_TOPICS: SelfStudyPlaylistTopic[] = [
  "grammar",
  "speaking",
  "vocabulary",
];

export type SelfStudyPlaylist = {
  id: string;
  /** YouTube playlist id (`list=`). */
  listId: string;
  title: string;
  channel: string;
  topic: SelfStudyPlaylistTopic;
  embedSrc: string;
  watchUrl: string;
};

export const SELF_STUDY_PLAYLISTS: SelfStudyPlaylist[] = [
  {
    id: "bbc-improve-speaking",
    listId: "PLcetZ6gSk969aep15p9VBAwbitfMlsSH0",
    title: "Improve your English speaking",
    channel: "BBC Learning English",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk969aep15p9VBAwbitfMlsSH0",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk969aep15p9VBAwbitfMlsSH0",
  },
  {
    id: "bbc-pronunciation-tips",
    listId: "PLD6B222E02447DC07",
    title: "English Pronunciation Tips",
    channel: "BBC Learning English",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLD6B222E02447DC07",
    watchUrl: "https://www.youtube.com/playlist?list=PLD6B222E02447DC07",
  },
  {
    id: "bbc-6-minute-grammar",
    listId: "PLcetZ6gSk96_zHuVg6Ecy2F7j4Aq4valQ",
    title: "6 Minute Grammar",
    channel: "BBC Learning English",
    topic: "grammar",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk96_zHuVg6Ecy2F7j4Aq4valQ",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk96_zHuVg6Ecy2F7j4Aq4valQ",
  },
  {
    id: "bbc-6-minute-vocabulary",
    listId: "PLcetZ6gSk96-GbYhcN0KkFtIL8LJPOG5x",
    title: "6 Minute Vocabulary",
    channel: "BBC Learning English",
    topic: "vocabulary",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk96-GbYhcN0KkFtIL8LJPOG5x",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk96-GbYhcN0KkFtIL8LJPOG5x",
  },
  {
    id: "bbc-how-to-everyday-phrases",
    listId: "PLcetZ6gSk9692RVJgFx4JXwFG4mWK0XGj",
    title: "How to - everyday phrases to use every day",
    channel: "BBC Learning English",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk9692RVJgFx4JXwFG4mWK0XGj",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk9692RVJgFx4JXwFG4mWK0XGj",
  },
  {
    id: "bbc-news-review",
    listId: "PLcetZ6gSk968l1s4WuxwyhiyEUmg5GOZC",
    title: "News Review - Learn the English words and phrases in the news",
    channel: "BBC Learning English",
    topic: "vocabulary",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk968l1s4WuxwyhiyEUmg5GOZC",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk968l1s4WuxwyhiyEUmg5GOZC",
  },
  {
    id: "bbc-stop-saying",
    listId: "PLcetZ6gSk968jnHqvzgAm3C5v8SeE2tt0",
    title: "Stop Saying - you ask, we answer",
    channel: "BBC Learning English",
    topic: "vocabulary",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLcetZ6gSk968jnHqvzgAm3C5v8SeE2tt0",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLcetZ6gSk968jnHqvzgAm3C5v8SeE2tt0",
  },
  {
    id: "rachels-sounds-of-american-english",
    listId: "PLB043E64B8BE05FB7",
    title: "Master The Sounds of American English",
    channel: "Rachel's English",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLB043E64B8BE05FB7",
    watchUrl: "https://www.youtube.com/playlist?list=PLB043E64B8BE05FB7",
  },
  {
    id: "tv-series-english-for-children",
    listId: "PLlpAWCqcstzp3Kc-uA5g_3D6cAO5YKJ3D",
    title: "English for Children with TV Series",
    channel: "Learn English With TV Series",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLlpAWCqcstzp3Kc-uA5g_3D6cAO5YKJ3D",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLlpAWCqcstzp3Kc-uA5g_3D6cAO5YKJ3D",
  },
  {
    id: "tv-series-learn-english-with-movies",
    listId: "PLlpAWCqcstzpmyRgyqRYd1oJwMkoM93ih",
    title: "Learn English with Movies",
    channel: "Learn English With TV Series",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLlpAWCqcstzpmyRgyqRYd1oJwMkoM93ih",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLlpAWCqcstzpmyRgyqRYd1oJwMkoM93ih",
  },
  {
    id: "tv-series-learn-english-with-music",
    listId: "PLlpAWCqcstzqe7Qp5CUIAxGfCfBxuqJCl",
    title: "Learn English with Music",
    channel: "Learn English With TV Series",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLlpAWCqcstzqe7Qp5CUIAxGfCfBxuqJCl",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLlpAWCqcstzqe7Qp5CUIAxGfCfBxuqJCl",
  },
  {
    id: "tv-series-learn-christmas-english",
    listId: "PLlpAWCqcstzpIGKPYhDlefozao4LzLfkQ",
    title: "Learn Christmas English with TV Series and Movies",
    channel: "Learn English With TV Series",
    topic: "speaking",
    embedSrc:
      "https://www.youtube.com/embed/videoseries?list=PLlpAWCqcstzpIGKPYhDlefozao4LzLfkQ",
    watchUrl:
      "https://www.youtube.com/playlist?list=PLlpAWCqcstzpIGKPYhDlefozao4LzLfkQ",
  },
];
