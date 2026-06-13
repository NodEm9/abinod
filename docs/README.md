<p align="center">
  <img src="./public/tenra-mark-layered.svg" alt="Tenra" width="104" />
</p>

<h1 align="center">Tenra Documentation</h1>

<p align="center">
  The official documentation system for Tenra.
</p>

<p align="center">
  Context-driven, enterprise-grade documentation for a runtime-aware MongoDB platform.
</p>

## Overview

This directory contains the official Tenra documentation site, including:

- product messaging and landing-page experience
- onboarding and getting-started flows
- architecture and runtime design references
- core concepts such as context, transactions, middleware, and instrumentation
- model, schema, provider, adapter, and client documentation
- CRUD, feature, and advanced operational guides

The documentation is designed to serve both first-time adopters and teams evaluating Tenra for production use.

## Documentation Goals

The Tenra docs are expected to:

- explain the runtime model clearly and accurately
- maintain enterprise-grade writing quality and visual consistency
- avoid overstating implementation details
- keep product branding and technical behavior aligned
- scale from onboarding content to architectural reference material

## Audience

This documentation is written for:

- backend engineers adopting Tenra
- platform and infrastructure teams evaluating runtime behavior
- technical decision-makers reviewing multi-tenancy, transactions, and operational boundaries
- maintainers extending the docs system itself

## Documentation Architecture

The site is organized around a stable information architecture:

- `getting-started/` for onboarding, installation, and execution walkthroughs
- `architecture/` for system design, runtime flow, and conceptual models
- `core/` for foundational runtime concepts
- `models/` for model, schema, provider, and binding behavior
- `adapters/` for runtime integration across supported environments
- `crud/` for operational data access guides
- `features/` for higher-level capabilities such as soft delete and caching
- `api/` for client and runtime reference surfaces
- `advanced/` for bootstrap, CLI, and production-oriented usage

## Technology Stack

The documentation site is built with:

- VitePress
- a custom Tenra theme layer under `.vitepress/theme/`
- reusable Vue components for diagrams, flows, cards, and visual concept blocks
- a branded design system defined in `.vitepress/theme/custom.css`

## Brand Assets

The Tenra logo pack is included in `public/` and should be used consistently across docs and supporting assets.

| Asset | File | Intended use |
| --- | --- | --- |
| Primary mark | `public/tenra-mark-layered.svg` | Main product logo, docs identity, presentations |
| Compact mark | `public/tenra-mark-monogram.svg` | Favicon, compact brand surfaces, badges |
| Alternate mark | `public/tenra-mark-orbit.svg` | Exploratory or secondary brand treatments |
| Canonical mark alias | `public/tenra-mark.svg` | Default site-level mark reference |

When adding new branded surfaces, prefer the layered mark for primary identity and the monogram for compact UI contexts.

## Repository Layout

Key files and directories in this workspace:

- `.vitepress/config.mts`
  Site navigation, sidebar structure, metadata, and docs-level configuration.
- `.vitepress/theme/index.ts`
  Theme component registration and theme bootstrap.
- `.vitepress/theme/custom.css`
  Shared design system, layout styling, brand palette, and docs UI rules.
- `.vitepress/theme/components/`
  Reusable Vue components for pills, cards, diagrams, and conceptual flows.
- `public/`
  Static brand and documentation assets.

## Local Workflow

From the repository root, install dependencies and run the documentation build.

```bash
npm install
npm run docs:build
```

The documentation build is the baseline verification step and should pass before publishing or merging substantial documentation changes.

## Writing Standards

All Tenra documentation should follow these standards:

- use Tenra naming consistently across product-facing content
- prefer technically precise, enterprise-grade language
- keep conceptual boundaries clear between runtime, model, provider, client, and adapter responsibilities
- do not describe behavior that is not supported by the implementation
- replace plain ASCII flow diagrams with designed visual components where appropriate
- preserve strong dark-mode and light-mode readability

## Visual Standards

The docs UI should remain visually coherent across all sections.

That includes:

- consistent card treatments
- shared pill-style execution flows
- deliberate contrast in both light and dark mode
- alignment between landing-page brand language and technical documentation surfaces
- premium, stable, enterprise-grade presentation rather than experimental styling drift

## Contribution Expectations

When updating the documentation:

1. maintain factual alignment with the real Tenra runtime and APIs
2. update legacy `Abimongo` wording to `Tenra` in product-facing content where appropriate
3. preserve or improve the existing visual system rather than introducing one-off patterns
4. check links, routes, and sidebar placement
5. run the docs build before finalizing changes

## Quality Checklist

Before considering a documentation change complete, verify:

- naming is accurate and current
- routes and internal links resolve correctly
- dark-mode and light-mode contrast remain acceptable
- new diagrams or flow sections match the existing design language
- documentation build passes without dead links

## Product Positioning

Tenra documentation should communicate the product as:

- a runtime-aware data platform
- context-driven by design
- suitable for both straightforward services and complex production systems
- structured for enterprise expectations without making application code heavy

## Support for Future Growth

This docs system is expected to evolve with:

- additional observability and security plugin documentation
- clearer separation between community and enterprise capabilities
- expanded API references and operational guides
- broader adapter, runtime, and deployment documentation

The README should remain a stable operating guide for maintainers even as the site grows.
