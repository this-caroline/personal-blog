export interface EngineeringStory {
  readonly id: string;
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export const engineeringStories: readonly EngineeringStory[] = [
  {
    id: "mtls-file-transfers",
    number: "01",
    label: "Secure file transfers",
    title: "Secure file transfers inside a major bank",
    paragraphs: [
      "Architected and built an mTLS solution for high-volume internal file transfers at Latin America’s largest investment bank.",
    ],
  },
  {
    id: "ev-home-charging",
    number: "02",
    label: "EV charging",
    title: "EV charging",
    paragraphs: [
      "Built home-charging reimbursement from vehicle telemetry, from specification to release.",
    ],
  },
  {
    id: "release-risk",
    number: "03",
    label: "Release risk",
    title: "Release risk",
    paragraphs: [
      "Built an AI-assisted workflow that helps QA identify what actually needs retesting after a change.",
    ],
  },
];
