export interface CurrentSnapshotEntry {
  readonly label: string;
  readonly value: string;
  readonly title: string;
  readonly description: string;
}

export interface CurrentSnapshot {
  readonly entries: readonly CurrentSnapshotEntry[];
}

export const currentSnapshot: CurrentSnapshot = {
  entries: [
    {
      label: "Building",
      value: "Local AI infrastructure",
      title: "Local AI as personal infrastructure",
      description:
        "I am building a shared local inference setup for personal applications and assistants.",
    },
    {
      label: "Experimenting with",
      value: "Ollama / local models / coding models",
      title: "Useful local models",
      description:
        "I am comparing local models and coding tools to learn where privacy, latency, and model size change the experience.",
    },
    {
      label: "Reading",
      value: "Quarto de Despejo",
      title: "Quarto de Despejo",
      description: "By Carolina Maria de Jesus.",
    },
    {
      label: "Playing",
      value: "Board games",
      title: "Board games",
      description: "Usually something with an interesting system to untangle.",
    },
    {
      label: "Offline",
      value: "Bouldering / climbing",
      title: "Bouldering and climbing",
      description: "Most weeks, I am working on V5s and V6s.",
    },
  ],
};
