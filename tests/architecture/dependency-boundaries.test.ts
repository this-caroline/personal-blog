import path from "node:path";

import { expect, it } from "vitest";

import { findDependencyViolations } from "./dependency-boundaries";

import type ts from "typescript";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const options: ts.CompilerOptions = {
  paths: {
    "@config/*": ["./src/config/*"],
    "@lib/*": ["./src/lib/*"],
    "@components/*": ["./src/components/*"],
    "@layouts/*": ["./src/layouts/*"],
    "@assets/*": ["./src/assets/*"],
  },
};

it.each([
  [
    "src/config/example.ts",
    'import { createPageMetadata } from "@lib/metadata";',
  ],
  ["src/config/example.ts", 'export * from "../lib/metadata";'],
  ["src/lib/example.ts", 'import Card from "@components/ProjectCard.astro";'],
  [
    "src/lib/example.ts",
    'export { default } from "../layouts/BaseLayout.astro";',
  ],
  ["src/lib/example.ts", 'const page = import("../pages/index.astro");'],
  [
    "src/lib/example.ts",
    "const image = import(`@assets/caroline-snowboard.png`);",
  ],
  ["src/lib/example.ts", 'import { getCollection } from "astro:content";'],
  ["src/lib/example.ts", 'import { glob } from "astro/loaders";'],
  ["src/lib/example.ts", 'import { collections } from "../content.config";'],
  ["src/lib/example.ts", 'import "../styles/global.css";'],
  [
    "src/components/Example.astro",
    '---\nimport Layout from "@layouts/BaseLayout.astro";\n---\n<p>Example</p>',
  ],
  [
    "src/components/Example.astro",
    '<script>const page = import("../pages/index.astro");</script>',
  ],
])("rejects forbidden dependency in %s: %s", (filename, source) => {
  expect(
    findDependencyViolations(source, filename, repositoryRoot, options),
  ).toHaveLength(1);
});

it.each([
  ["src/config/example.ts", 'import { siteIdentity } from "./site";'],
  ["src/config/example.ts", 'export { siteIdentity } from "@config/site";'],
  ["src/lib/example.ts", 'import { siteIdentity } from "@config/site";'],
  ["src/lib/example.ts", 'export * from "./writing";'],
  [
    "src/lib/example.ts",
    'import type { CollectionEntry } from "astro:content";',
  ],
  [
    "src/lib/example.ts",
    'import { type CollectionEntry } from "astro:content";',
  ],
  [
    "src/lib/example.ts",
    'export type { CollectionEntry } from "astro:content";',
  ],
  [
    "src/lib/example.ts",
    'type Entry = import("astro:content").CollectionEntry<"writing">;',
  ],
  [
    "src/components/Example.astro",
    '---\nimport Card from "./ProjectCard.astro";\nimport { siteIdentity } from "@config/site";\n---\n<p>Example</p>',
  ],
  [
    "src/pages/example.astro",
    '---\nimport Layout from "@layouts/BaseLayout.astro";\n---',
  ],
])("permits dependency in %s: %s", (filename, source) => {
  expect(
    findDependencyViolations(source, filename, repositoryRoot, options),
  ).toEqual([]);
});

it.each([
  ['export { type CollectionEntry } from "astro:content";', []],
  ['export type * from "astro:content";', []],
  ['export * as content from "astro:content";', ["astro:content"]],
  ['export {} from "astro:content";', ["astro:content"]],
  ['import {} from "astro:content";', ["astro:content"]],
  [
    'import Entry, { type CollectionEntry } from "astro:content";',
    ["astro:content"],
  ],
  [
    'export { type CollectionEntry, getCollection } from "astro:content";',
    ["astro:content"],
  ],
  [
    'import "astro:content"; import "astro/assets";',
    ["astro:content", "astro/assets"],
  ],
  ['const moduleName = "astro:content"; import(moduleName);', []],
  ['import "node:path";', []],
])("classifies import and export forms: %s", (source, forbiddenSpecifiers) => {
  expect(
    findDependencyViolations(
      source,
      "src/lib/example.ts",
      repositoryRoot,
      options,
    ),
  ).toEqual(
    forbiddenSpecifiers.map((specifier) => `src/lib/example.ts: ${specifier}`),
  );
});

it.each([
  ["@layout", { "@layout": ["src/layouts/BaseLayout.astro"] }, undefined, true],
  [
    "@layout/Example.astro/view",
    { "@layout/*/view": ["src/layouts/*"] },
    undefined,
    true,
  ],
  [
    "@layout/Example.astro/other",
    { "@layout/*/view": ["src/layouts/*"] },
    undefined,
    false,
  ],
  [
    "@other/Example.astro/view",
    { "@layout/*/view": ["src/layouts/*"] },
    undefined,
    false,
  ],
  ["@layout/Example.astro", { "@layout/*": [] }, undefined, false],
  [
    "@layout/Example.astro",
    { "@layout/*": ["layouts/*", "config/*"] },
    path.join(repositoryRoot, "src"),
    true,
  ],
  ["../../../external.astro", {}, undefined, false],
])(
  "resolves boundary fallback for %s",
  (specifier, paths, baseUrl, forbidden) => {
    const compilerOptions: ts.CompilerOptions = {
      paths,
      ...(baseUrl === undefined ? {} : { baseUrl }),
    };
    expect(
      findDependencyViolations(
        `import "${specifier}";`,
        "src/lib/example.ts",
        repositoryRoot,
        compilerOptions,
      ),
    ).toEqual(forbidden ? [`src/lib/example.ts: ${specifier}`] : []);
  },
);
