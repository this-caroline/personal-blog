import { currentSnapshot } from "./current";
import { siteIdentity } from "./site";

const boardGameGeekProfile = siteIdentity.profiles.find(
  (profile) => profile.label === "BoardGameGeek",
);

interface PersonalSnapshotCard {
  readonly title: string;
  readonly label: string;
  readonly description: string;
  readonly detail?: string | undefined;
  readonly link?: {
    readonly label: string;
    readonly url: string;
  };
}

export const homepagePersonalSnapshots: readonly PersonalSnapshotCard[] = [
  {
    title: currentSnapshot.offline.title,
    label: "Mountains & climbing",
    description: currentSnapshot.offline.description,
  },
  {
    title: currentSnapshot.playing.title,
    label: "Tabletop Games",
    description: currentSnapshot.playing.description,
    ...(boardGameGeekProfile === undefined
      ? {}
      : {
          link: {
            label: "See what I've been playing ->",
            url: boardGameGeekProfile.url,
          },
        }),
  },
  {
    title: currentSnapshot.reading.title,
    label: "Last read",
    description: currentSnapshot.reading.title,
    detail: currentSnapshot.reading.detail,
  },
];

export const aboutPersonalSnapshots: readonly PersonalSnapshotCard[] = [
  {
    label: currentSnapshot.offline.value,
    title: currentSnapshot.offline.title,
    description: currentSnapshot.offline.description,
  },
  {
    label: currentSnapshot.playing.value,
    title: currentSnapshot.playing.title,
    description: currentSnapshot.playing.description,
    ...(boardGameGeekProfile === undefined
      ? {}
      : {
          link: {
            label: "See what I've been playing ->",
            url: boardGameGeekProfile.url,
          },
        }),
  },
  {
    label: currentSnapshot.reading.value,
    title: currentSnapshot.reading.title,
    description: currentSnapshot.reading.description,
    detail: currentSnapshot.reading.detail,
  },
];
