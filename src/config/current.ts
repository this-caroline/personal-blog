export interface CurrentSnapshotEntry {
  readonly label: string;
  readonly value: string;
  readonly title: string;
  readonly description: string;
  readonly detail?: string;
}

export type CurrentSnapshotKey =
  | "building"
  | "experimenting"
  | "reading"
  | "playing"
  | "offline";

export const currentSnapshot: Readonly<
  Record<CurrentSnapshotKey, CurrentSnapshotEntry>
> = {
  building: {
    label: "Building",
    value: "Local AI infrastructure for personal applications and assistants",
    title: "Local AI as personal infrastructure",
    description:
      "I am building a shared local inference setup for personal applications and assistants.",
  },
  experimenting: {
    label: "Experimenting with",
    value: "Local LLM Models / Spec-Driven Development",
    title: "Useful local models",
    description:
      "I am comparing local models and coding tools to learn where privacy, latency, and model size change the experience.",
  },
  reading: {
    label: "Reading",
    title: "Beyond all Pity",
    value: "Beyond all Pity",
    description:
      "It's a powerful, autobiographical diary detailing her life as a Black, single mother living in the Canindé favela in São Paulo between 1955 and 1960.",
    detail: "By Carolina Maria de Jesus.",
  },
  playing: {
    label: "Playing",
    value: "Board games & Counting the minutos for GTA 6 :)",
    title: "Board games",
    description: "Usually something with an interesting system to untangle.",
  },
  offline: {
    label: "Offline",
    value: "Bouldering / Climbing",
    title: "Bouldering and climbing",
    description: "Most weeks, I am working on V5s and V6s.",
  },
};

export const currentSnapshotEntries = [
  currentSnapshot.building,
  currentSnapshot.experimenting,
  currentSnapshot.reading,
  currentSnapshot.playing,
  currentSnapshot.offline,
] as const;
