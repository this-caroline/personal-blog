import { describe, expect, it } from "vitest";

import { engineeringStories } from "../src/config/engineering-stories";
import { projects } from "../src/config/projects";
import { navigationLinks } from "../src/config/site";

describe("page editorial boundaries", () => {
  it("keeps exactly three numbered problems with secure file transfers first", () => {
    expect(engineeringStories.map((story) => story.id)).toEqual([
      "mtls-file-transfers",
      "ev-home-charging",
      "release-risk",
    ]);
    expect(engineeringStories.map((story) => story.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  it("keeps professional highlights brief rather than case studies", () => {
    for (const story of engineeringStories) {
      const wordCount = story.paragraphs.join(" ").split(/\s+/).length;
      expect(wordCount).toBeLessThanOrEqual(35);
    }
  });

  it("keeps unpublished writing out of primary navigation", () => {
    expect(navigationLinks.map((link) => link.pathname)).toEqual([
      "/",
      "/projects",
      "/about",
    ]);
  });

  it("gives projects technical depth distinct from their Home teasers", () => {
    for (const project of projects) {
      expect(project.detail.description).not.toBe(project.homepage.description);
      expect(project.detail.focusAreas.length).toBeGreaterThan(0);
      expect(project.detail.benchNotes.length).toBeGreaterThan(0);
    }
  });
});
