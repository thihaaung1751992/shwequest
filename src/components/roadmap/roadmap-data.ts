export type LessonStatus = "completed" | "current" | "locked";

type LessonBase = {
  id: string;
  title: string;
  status: LessonStatus;
  xp: number;
};

export type VideoLesson = LessonBase & {
  kind: "video";
  duration: string;
};

export type BossLesson = LessonBase & {
  kind: "boss";
  gameStatus: string;
};

export type RoadmapNode = VideoLesson | BossLesson;

export type PathUnit = {
  title: string;
};

/**
 * Drawing cluster on the path: three lesson slots and one wider slot.
 * A teacher's video count and game count do not have to follow this shape.
 */
export const VIDEOS_PER_UNIT = 3;
export const NODES_PER_UNIT = VIDEOS_PER_UNIT + 1;

/** Teacher 1's stand-in only. Other teachers pass their own counts into `placeholderCatalog`. */
const DEMO_VIDEOS = 50;
const DEMO_GAMES = 16;

const UNIT_TITLES = ["First Steps", "Market Talk", "The Long Trail", "Golden Peak"] as const;

const KEPT_VIDEOS: Record<
  number,
  { title: string; status: LessonStatus; xp: number; duration: string }
> = {
  1: { title: "Welcome to the Quest", status: "completed", xp: 20, duration: "4:12" },
  2: { title: "Reading the Map", status: "completed", xp: 25, duration: "5:40" },
  3: { title: "First Clues", status: "completed", xp: 25, duration: "6:05" },
  4: { title: "Market Voices", status: "completed", xp: 30, duration: "7:18" },
  5: { title: "Tone and Timing", status: "current", xp: 30, duration: "6:44" },
  6: { title: "Asking the Price", status: "locked", xp: 30, duration: "8:02" },
  7: { title: "Trail Signs", status: "locked", xp: 35, duration: "5:55" },
  8: { title: "Night Watch", status: "locked", xp: 35, duration: "7:30" },
  9: { title: "Hidden Paths", status: "locked", xp: 35, duration: "6:20" },
  10: { title: "Golden Rules", status: "locked", xp: 40, duration: "9:10" },
  11: { title: "Ally Signals", status: "locked", xp: 40, duration: "6:48" },
  12: { title: "Final Briefing", status: "locked", xp: 40, duration: "8:33" },
};

const KEPT_BOSSES: Record<
  number,
  { title: string; status: LessonStatus; xp: number; gameStatus: string }
> = {
  1: { title: "Gatekeeper Duel", status: "completed", xp: 80, gameStatus: "Cleared" },
  2: { title: "Bargain Arena", status: "locked", xp: 100, gameStatus: "Locked" },
  3: { title: "Shadow Maze", status: "locked", xp: 120, gameStatus: "Locked" },
  4: { title: "Crown of Shwe", status: "locked", xp: 150, gameStatus: "Locked" },
};

function durationFor(videoNumber: number): string {
  const minutes = 4 + (videoNumber % 6);
  const seconds = (videoNumber * 13) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function countLessons(nodes: readonly RoadmapNode[]): { videos: number; games: number } {
  let videos = 0;
  let games = 0;
  for (const node of nodes) {
    if (node.kind === "video") videos += 1;
    else games += 1;
  }
  return { videos, games };
}

function assertCatalog(nodes: readonly RoadmapNode[], videos: number, games: number) {
  const counts = countLessons(nodes);
  const currentCount = nodes.filter((node) => node.status === "current").length;
  if (counts.videos !== videos || counts.games !== games || currentCount !== 1) {
    throw new Error(
      `Catalog expected ${videos} videos, ${games} games, and 1 current lesson; got ${counts.videos} videos, ${counts.games} games, and ${currentCount} current.`,
    );
  }
}

/** Stand-in for Teacher 1: 3 videos then 1 game, with the last unit short two videos. */
export function demoUnitCatalog(): { nodes: RoadmapNode[]; units: PathUnit[] } {
  const fullUnits = Math.floor(DEMO_VIDEOS / VIDEOS_PER_UNIT);
  const trailingVideos = DEMO_VIDEOS % VIDEOS_PER_UNIT;
  const unitCount = fullUnits + (trailingVideos > 0 ? 1 : 0);
  const nodes: RoadmapNode[] = [];
  let videoNumber = 1;

  for (let unit = 1; unit <= unitCount; unit += 1) {
    const videosHere = unit <= fullUnits ? VIDEOS_PER_UNIT : trailingVideos;
    for (let slot = 1; slot <= videosHere; slot += 1) {
      const kept = KEPT_VIDEOS[videoNumber];
      nodes.push({
        id: `unit-${unit}-video-${slot}`,
        kind: "video",
        title: kept?.title ?? `Video ${videoNumber}`,
        status: kept?.status ?? "locked",
        xp: kept?.xp ?? 20 + (unit - 1) * 5,
        duration: kept?.duration ?? durationFor(videoNumber),
      });
      videoNumber += 1;
    }

    if (videosHere === VIDEOS_PER_UNIT) {
      const kept = KEPT_BOSSES[unit];
      nodes.push({
        id: `unit-${unit}-boss`,
        kind: "boss",
        title: kept?.title ?? `Boss ${unit}`,
        status: kept?.status ?? "locked",
        xp: kept?.xp ?? 80 + (unit - 1) * 20,
        gameStatus: kept?.gameStatus ?? "Locked",
      });
    }
  }

  const units = Array.from({ length: unitCount }, (_, index) => ({
    title: UNIT_TITLES[index] ?? `Trail ${index + 1}`,
  }));
  assertCatalog(nodes, DEMO_VIDEOS, DEMO_GAMES);
  return { nodes, units };
}

/**
 * Place videos and games independently. The scarcer kind is spread through the other
 * instead of forcing one game after every three videos.
 */
function mixOrder(videoCount: number, gameCount: number): Array<"video" | "boss"> {
  const order: Array<"video" | "boss"> = [];
  let videosPlaced = 0;
  let gamesPlaced = 0;
  while (videosPlaced < videoCount || gamesPlaced < gameCount) {
    const videosRemain = videosPlaced < videoCount;
    const gamesRemain = gamesPlaced < gameCount;
    const videoShare = videosRemain ? videosPlaced / videoCount : 1;
    const gameShare = gamesRemain ? gamesPlaced / gameCount : 1;
    if (videosRemain && (!gamesRemain || videoShare <= gameShare)) {
      order.push("video");
      videosPlaced += 1;
    } else {
      order.push("boss");
      gamesPlaced += 1;
    }
  }
  return order;
}

/** Stand-in path for a teacher whose video count and game count are not tied together. */
export function placeholderCatalog(
  videoCount: number,
  gameCount: number,
): { nodes: RoadmapNode[]; units: PathUnit[] } {
  let videoNumber = 0;
  let gameNumber = 0;
  let markedCurrent = false;
  const nodes: RoadmapNode[] = mixOrder(videoCount, gameCount).map((kind) => {
    const current = !markedCurrent;
    if (current) markedCurrent = true;
    if (kind === "video") {
      videoNumber += 1;
      return {
        id: `video-${videoNumber}`,
        kind: "video" as const,
        title: `Video ${videoNumber}`,
        status: current ? ("current" as const) : ("locked" as const),
        xp: 20,
        duration: durationFor(videoNumber),
      };
    }
    gameNumber += 1;
    return {
      id: `boss-${gameNumber}`,
      kind: "boss" as const,
      title: `Boss ${gameNumber}`,
      status: current ? ("current" as const) : ("locked" as const),
      xp: 80,
      gameStatus: "Locked",
    };
  });
  assertCatalog(nodes, videoCount, gameCount);
  return { nodes, units: [{ title: "First Steps" }] };
}

/** XP from lessons already marked completed on this catalog. */
export function earnedXp(nodes: readonly RoadmapNode[]): number {
  return nodes.reduce((sum, node) => (node.status === "completed" ? sum + node.xp : sum), 0);
}

export function videoNumberAt(nodes: readonly RoadmapNode[], index: number): number {
  let count = 0;
  for (let cursor = 0; cursor <= index && cursor < nodes.length; cursor += 1) {
    if (nodes[cursor].kind === "video") count += 1;
  }
  return count;
}

export function unitAt(
  index: number,
  units: readonly PathUnit[],
): { number: number; title: string } {
  if (units.length === 0) return { number: 1, title: "Path" };
  const slot = Math.min(unitIndexFor(index), units.length - 1);
  return { number: slot + 1, title: units[slot].title };
}

export function unitIndexFor(index: number): number {
  return Math.floor(index / NODES_PER_UNIT);
}

const PAD_TOP = 128;
const PAD_BOTTOM = 196;
const LESSON_STEP = 180;
const BOSS_STEP = 210;
const CLUSTER_STEP = 78;

const X_SLOTS = [
  [0.32, 0.7, 0.36, 0.5],
  [0.68, 0.3, 0.64, 0.5],
] as const;

export type PathPoint = {
  x: number;
  y: number;
};

function riseTo(index: number): number {
  let distance = 0;
  for (let step = 1; step <= index; step += 1) {
    const arrivingBoss = step % NODES_PER_UNIT === VIDEOS_PER_UNIT;
    const newCluster = step % NODES_PER_UNIT === 0;
    distance += arrivingBoss ? BOSS_STEP : LESSON_STEP;
    if (newCluster) distance += CLUSTER_STEP;
  }
  return distance;
}

export function roadmapHeight(count: number): number {
  if (count <= 0) return 0;
  return PAD_TOP + PAD_BOTTOM + riseTo(count - 1);
}

export function nodePoint(index: number, count: number, width: number): PathPoint {
  const cluster = Math.floor(index / NODES_PER_UNIT) % 2;
  const slot = index % NODES_PER_UNIT;
  return {
    x: width * X_SLOTS[cluster][slot],
    y: PAD_TOP + riseTo(index),
  };
}

export function unitChipY(unitNumber: number, count: number): number {
  if (unitNumber <= 1) return 40;
  const previousBoss = (unitNumber - 1) * NODES_PER_UNIT - 1;
  const bossY = PAD_TOP + riseTo(previousBoss);
  // Boss labels hang below the node. 112px put the chip on that label.
  return bossY + 132;
}

export function smoothPath(points: PathPoint[]): string {
  if (points.length === 0) return "";
  const command = (value: number) => value.toFixed(1);
  let path = `M ${command(points[0].x)} ${command(points[0].y)}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const deltaY = current.y - previous.y;
    const controlOneY = previous.y + deltaY * 0.55;
    const controlTwoY = current.y - deltaY * 0.45;
    path += ` C ${command(previous.x)} ${command(controlOneY)}, ${command(current.x)} ${command(controlTwoY)}, ${command(current.x)} ${command(current.y)}`;
  }
  return path;
}
