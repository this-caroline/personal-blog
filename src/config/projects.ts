export interface Project {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly homepage: {
    readonly description: string;
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
    name: "Local AI infrastructure",
    status: "in progress",
    homepage: {
      description:
        "Local inference for a few tools I keep building because apparently one side project is never enough.",
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
    name: "Grammar assistant",
    status: "experiment",
    homepage: {
      description: "A local grammar app to help me learn German faster.",
    },
    detail: {
      description:
        "A Chrome extension that connects browser text fields to a local LLM for German grammar feedback, helping me learn from recurring mistakes. Unfinished drafts stay on my machine that works as a server; the extension uses the shared inference layer rather than managing its own models.",
      focusAreas: ["browser APIs", "local AI", "German grammar"],
      benchNotes: [
        "Finding feedback that is useful without becoming annoying",
        "Keeping local processing visible and trustworthy",
        "Remembering recurring mistakes without pretending the model is always right",
      ],
    },
  },
];
