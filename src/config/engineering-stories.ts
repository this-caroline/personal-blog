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
    id: "japanese-rollout",
    homepage: {
      title: "Japanese, beyond translated strings",
      label: "Internationalization",
      description:
        "Led the rollout of Japanese for an international software product, from the first idea through implementation and delivery.",
      technicalNote:
        "The interesting part was treating language, locale, and product behavior as one system—not a bag of translated strings.",
    },
    about: {
      label: "Internationalization",
      description:
        "Led the rollout of Japanese for an international software product, from the first idea through implementation and delivery.",
    },
  },
  {
    id: "deployment-oidc",
    homepage: {
      title: "Long-lived keys → short-lived tokens",
      label: "Infrastructure / OIDC",
      description:
        "I moved deployment authentication from long-lived AWS credentials to short-lived credentials through GitLab OIDC.",
      technicalNote:
        "It was a useful lesson in making the safer path the ordinary path across services.",
    },
    about: {
      label: "Infrastructure",
      description:
        "Moved deployment authentication from long-lived AWS credentials to short-lived GitLab OIDC credentials.",
    },
  },
  {
    id: "product-security",
    homepage: {
      title: "Finding the sharp edges",
      label: "Security / pentesting",
      description:
        "I worked directly with product security and pentesting, including hardening work that contributed to successful certification.",
      technicalNote:
        "The best part was following findings back into real product behavior instead of treating security as checklist theater.",
    },
    about: {
      label: "Security",
      description:
        "Worked directly with security and pentesting efforts connected to successful product certification.",
    },
  },
];
