export interface Project {
  readonly name: string;
  readonly status: string;
  readonly description: string;
  readonly focusAreas?: readonly string[];
  readonly linkLabel?: string;
  readonly benchNotes?: readonly string[];
  readonly terminalLines?: readonly string[];
}

export const projects: readonly Project[] = [
  {
    name: "Local LLM Home Infrastructure",
    status: "In progress",
    description:
      "A local AI service layer for personal applications and assistants. I want one useful, private inference setup instead of a different pile of scripts for every idea.",
    focusAreas: ["Ollama", "private inference", "shared APIs"],
    benchNotes: [
      "Making local inference reusable across small personal tools",
      "Learning where latency and model choice change the experience",
      "Keeping the service boundaries loose enough to experiment",
    ],
  },
  {
    name: "Personal Grammar Assistant",
    status: "Exploring",
    description:
      "A browser extension experiment that uses a local LLM for grammar, phrasing, and tone without sending every half-finished sentence to the cloud.",
    focusAreas: ["browser APIs", "local AI", "writing feedback"],
    benchNotes: [
      "Finding feedback that is useful without becoming annoying",
      "Keeping local processing visible and trustworthy",
      "Remembering recurring mistakes without pretending the model is always right",
    ],
  },
];

export const currentProjects = [
  {
    name: "Local LLM Home Infrastructure",
    status: "In progress",
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
    linkLabel: "GitHub soon - stay tuned.",
  },
  {
    name: "Personal Grammar Assistant",
    status: "Exploring",
    description:
      "A Chrome extension using a local LLM to correct grammar, suggest clearer phrasing, detect harsh or dismissive tone, and learn recurring writing mistakes.",
    focusAreas: [
      "browser APIs",
      "frontend",
      "local AI",
      "privacy-minded product behavior",
    ],
    linkLabel: "Designed around local inference and privacy.",
  },
] as const;
