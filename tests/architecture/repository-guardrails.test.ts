import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import { findDependencyViolations } from "./dependency-boundaries";
import { engineeringStories } from "../../src/config/engineering-stories";
import { projects } from "../../src/config/projects";
import { siteIdentity } from "../../src/config/site";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const sourceRoot = path.join(repositoryRoot, "src");
const sourceFileExtensions = new Set([".astro", ".ts", ".tsx"]);

interface SourceFile {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly content: string;
}

async function collectSourceFiles(directory: string): Promise<SourceFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(absolutePath);
      }

      if (!sourceFileExtensions.has(path.extname(entry.name))) {
        return [];
      }

      const content = await readFile(absolutePath, "utf8");
      const relativePath = path.relative(repositoryRoot, absolutePath);

      return [{ absolutePath, relativePath, content }];
    }),
  );

  return nestedFiles.flat();
}

describe("repository architecture", () => {
  it("keeps required foundation documents in place", () => {
    const requiredFiles = [
      "AGENTS.md",
      "docs/architecture.md",
      "docs/coding-standards.md",
      "docs/seo.md",
      "docs/testing.md",
      "docs/adr/001-astro-static-first.md",
    ];

    expect(
      requiredFiles.filter((requiredFile) =>
        existsSync(path.join(repositoryRoot, requiredFile)),
      ),
    ).toEqual(requiredFiles);
  });

  it("keeps canonical and profile URLs in site configuration", async () => {
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const canonicalUrls = [
      siteIdentity.canonicalOrigin.origin,
      ...siteIdentity.profiles.map((profile) => profile.url),
    ];
    const duplicates = sourceFiles
      .filter((sourceFile) => sourceFile.relativePath !== "src/config/site.ts")
      .filter((sourceFile) =>
        canonicalUrls.some((url) => sourceFile.content.includes(url)),
      )
      .map((sourceFile) => sourceFile.relativePath);
    expect(duplicates).toEqual([]);
  });

  it.each([
    ["projects", projects],
    ["engineering stories", engineeringStories],
  ])("keeps %s identifiers unique", (_collection, records) => {
    const identifiers = records.map((record) => record.id);
    expect(identifiers.every((identifier) => identifier.length > 0)).toBe(true);
    expect(new Set(identifiers).size).toBe(identifiers.length);
  });
});

describe("source architecture", () => {
  it("respects source-layer dependency boundaries", async () => {
    const config = ts.getParsedCommandLineOfConfigFile(
      path.join(repositoryRoot, "tsconfig.json"),
      {},
      {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic(diagnostic) {
          throw new Error(
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
          );
        },
      },
    );
    if (config === undefined || config.errors.length > 0) {
      throw new Error(
        "Cannot check architecture without a valid TypeScript configuration",
      );
    }
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const violations = sourceFiles.flatMap((sourceFile) =>
      findDependencyViolations(
        sourceFile.content,
        sourceFile.relativePath,
        repositoryRoot,
        config.options,
      ),
    );
    expect(violations).toEqual([]);
  });

  it("does not add React components before an interactive use case exists", async () => {
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const reactComponents = sourceFiles
      .filter((sourceFile) => sourceFile.relativePath.endsWith(".tsx"))
      .map((sourceFile) => sourceFile.relativePath);

    expect(reactComponents).toEqual([]);
  });
});
