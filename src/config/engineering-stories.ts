export interface EngineeringStory {
  readonly id: string;
  readonly homepage: {
    readonly title: string;
    readonly label: string;
    readonly description: string;
    readonly technicalNote: string;
  };
  readonly about: {
    readonly label: string;
    readonly description: string;
  };
}

export const engineeringStories: readonly EngineeringStory[] = [
  {
    id: "ev-home-charging",
    homepage: {
      title: "Building EV charging from specification to telemetry",
      label: "Product / Distributed systems",
      description:
        "I took a home-charging feature from early requirements through implementation and production delivery, including the telemetry flowing between vehicles, backend services, and the product.",
      technicalNote:
        "It taught me that the difficult part of an end-to-end feature isn't writing each piece—it's making every boundary agree on what happened.",
    },
    about: {
      label: "Product / Distributed systems",
      description:
        "Took a home-charging feature from early requirements through implementation and production delivery, including telemetry between vehicles, backend services, and the product.",
    },
  },
  {
    id: "deployment-oidc",
    homepage: {
      title: "Killing long-lived deployment credentials",
      label: "Infrastructure / OIDC",
      description:
        "I migrated deployment authentication from persistent AWS credentials to short-lived credentials issued through GitLab OIDC across our services.",
      technicalNote:
        "The useful lesson wasn't just about credentials: safer infrastructure works best when the secure path is also the boring, automatic path.",
    },
    about: {
      label: "Infrastructure",
      description:
        "Migrated deployment authentication from persistent AWS credentials to short-lived credentials issued through GitLab OIDC across services.",
    },
  },
  {
    id: "mtls-file-transfers",
    homepage: {
      title: "Moving sensitive files without trusting the network",
      label: "Security / Architecture",
      description:
        "At BTG Pactual, I architected and implemented an mTLS solution for high-volume internal file transfers in the bank's back-office systems.",
      technicalNote:
        "That changed how I think about security: don't rely on where a request comes from—make systems prove who they are.",
    },
    about: {
      label: "Security / Architecture",
      description:
        "Architected and implemented an mTLS solution for high-volume internal file transfers in BTG Pactual's back-office systems.",
    },
  },
];
