export interface Project {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly homepage: {
    readonly description: string;
    readonly focusAreas: readonly string[];
    readonly terminalLines?: readonly string[];
    readonly statusNote: string;
  };
  readonly detail: {
    readonly description: string;
    readonly focusAreas: readonly string[];
    readonly benchNotes: readonly string[];
  };
}

export const projects: readonly Project[] = [
  {
    id: "local-llm-infrastructure",
    name: "Local LLM Home Infrastructure",
    status: "In progress",
    homepage: {
      description:
        "A local AI service and shared inference environment for personal applications and assistants.",
      focusAreas: [
        "local model serving",
        "private inference",
        "latency",
        "model selection",
        "application integrations",
      ],
      terminalLines: [
        "$ ollama ps",
        "local inference: online",
        "cloud dependency: optional",
      ],
      statusNote: "GitHub soon - stay tuned.",
    },
    detail: {
      description:
        "A local AI service layer for personal applications and assistants. I want one useful, private inference setup instead of a different pile of scripts for every idea.",
      focusAreas: ["Ollama", "private inference", "shared APIs"],
      benchNotes: [
        "Making local inference reusable across small personal tools",
        "Learning where latency and model choice change the experience",
        "Keeping the service boundaries loose enough to experiment",
      ],
    },
  },
  {
    id: "grammar-assistant",
    name: "Personal Grammar Assistant",
    status: "Exploring",
    homepage: {
      description:
        "A Chrome extension using a local LLM to correct grammar, suggest clearer phrasing, detect harsh or dismissive tone, and learn recurring writing mistakes.",
      focusAreas: [
        "browser APIs",
        "frontend",
        "local AI",
        "privacy-minded product behavior",
      ],
      statusNote: "Designed around local inference and privacy.",
    },
    detail: {
      description:
        "A browser extension experiment that uses a local LLM for grammar, phrasing, and tone without sending every half-finished sentence to the cloud.",
      focusAreas: ["browser APIs", "local AI", "writing feedback"],
      benchNotes: [
        "Finding feedback that is useful without becoming annoying",
        "Keeping local processing visible and trustworthy",
        "Remembering recurring mistakes without pretending the model is always right",
      ],
    },
  },
];
