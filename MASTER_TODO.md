# Cornet UI `master` — remaining improvements

This document summarizes the remaining improvements to make on the `master` branch of **Cornet UI**.

The goal is not to redesign the project, but to finish aligning the public-facing branch with Cornet UI’s current positioning:

- **Vue 3 component library for DaisyUI**
- available via **npm**
- usable as **editable embedded source**
- **GitLab** as technical source of truth
- **GitHub** as public mirror and community hub

---

## Priority 1 — Fix public perception

### 1. Rename the root package in `master/package.json`
**Current issue**
- The root package still uses a placeholder-like name such as `tmp`.

**Why it matters**
- The README now looks polished and professional.
- A root `package.json` named `tmp` immediately weakens credibility.

**What to do**
- Rename the package to something explicit, for example:
  - `cornet-ui-playground`
  - `cornet-ui-demo`
  - `cornet-ui-docs-app`

**Recommended**
- Keep `"private": true` if this branch is still an app/playground/docs integration root.
- Add a short description.

---

## Priority 2 — Clarify the role of `master`

### 2. Explicitly explain what `master` is
**Current issue**
- `master` presents the project well, but does not explicitly define its role compared to `lib` and npm.

**Why it matters**
- New users may not understand the difference between:
  - the public repo branch
  - the source branch
  - the published npm package

**What to do**
Add a short section in `README.md` explaining that:

- `master` = public-facing branch, examples, integration, repo landing page
- `lib` = source branch used for library authoring and embedded/submodule mode
- npm = compiled distribution built in CI
- GitLab = technical source repository
- GitHub = public mirror + issues + PRs + community interaction

**Suggested section title**
- `Repository structure`
- or `How Cornet UI is distributed`

---

## Priority 3 — Explain source mode vs npm mode

### 3. Make the dual distribution model explicit
**Current issue**
- The README explains installation modes, but does not fully explain the difference between:
  - raw source mode
  - compiled npm mode

**Why it matters**
- Advanced users may assume npm and submodule consume the exact same file layout.
- This creates avoidable confusion when comparing repo contents and published package contents.

**What to do**
Add a short explanatory block such as:

- **npm mode**: compiled distribution built in CI for standard package consumption
- **embedded/source mode**: raw `.vue` / `.ts` files used locally through submodule or `file:lib`

---

## Priority 4 — Explain the historical naming

### 4. Document the historical `daisyui-vue-kit` URL
**Current issue**
- Public branding is now **Cornet UI**
- The GitLab project has been renamed, but its repository URL still contains the historical path `daisyui-vue-kit`

**Why it matters**
- Without explanation, users may think these are separate projects.

**What to do**
Add one short sentence in the README:

> Cornet UI was formerly named `daisyui-vue-kit`; some historical repository URLs still contain that name.

---

## Priority 5 — Update all GitHub links

### 5. Replace old GitHub repository links
**Current issue**
- The GitHub repository has been renamed to `Cornet-UI`
- Some docs, links, or metadata may still point to the old `Cornet` repository path

**Why it matters**
- Old links create confusion and may break navigation.

**What to do**
Review and replace all occurrences of:
- `https://github.com/t-lecoublet/Cornet`

with:
- `https://github.com/t-lecoublet/Cornet-UI`

**Check especially**
- `master/README.md`
- `lib/README.md`
- package metadata
- badges
- documentation site links
- npm metadata if applicable

---

## Priority 6 — Improve the quickstart flow

### 6. Simplify the README quickstart structure
**Current issue**
- The optional Vite plugin may appear too early in the main setup flow.

**Why it matters**
- New users should first understand the minimal working setup.
- Optimization should come second.

**What to do**
Restructure the quickstart as:
1. Minimal Vite setup
2. CSS import
3. First component usage
4. Optional: enable `cornetPlugin()` for smaller CSS

---

## Priority 7 — Keep the public branch fully consistent

### 7. Review `master` for remaining legacy wording
**Current issue**
- Some historical references may still remain in text, comments, examples, or supporting files.

**Why it matters**
- Cornet UI now has a clearer identity.
- Remaining legacy wording weakens the final polish.

**What to check**
- `daisyui-vue-kit`
- wording that implies the project is only a mirror and nothing more
- old installation phrasing
- old examples inconsistent with current npm package name
- old GitHub repo paths (`Cornet` vs `Cornet-UI`)

---

## Priority 8 — Align supporting metadata

### 8. Ensure `master` metadata supports the public narrative
**Current issue**
- The branch now presents Cornet UI as a real public project, but supporting metadata may still look like a private app/dev sandbox.

**What to review**
- `package.json` name
- `package.json` description
- repo description
- homepage link
- badges and visible links
- CONTRIBUTING link presence
- LICENSE visibility

**Goal**
Make sure the repo root feels intentional, not transitional.

---

## Optional improvements

### 9. Add a short “Where to contribute” note
This is not critical, but useful.

**Recommended content**
Explain simply:
- GitLab is the technical source repository
- GitHub is the public mirror and contribution hub
- Issues/PRs on GitHub are welcome
- Maintainers sync between platforms as needed

---

### 10. Add a short “Which install mode should I choose?” note
Useful for users who do not immediately know whether they should use npm or submodule.

**Recommended**
A small decision guide:
- choose **npm** for standard use
- choose **embedded source** for local control/customization
- choose **GitLab submodule** if working in CNRS/LIMOS workflows
- choose **GitHub submodule** for GitHub-only workflows

---

### 11. Optionally make the root app role explicit
If `master` is actually a demo/playground/docs app, make that visible in the repository structure or package metadata.

This is not mandatory, but it helps advanced contributors understand the branch instantly.

---

## Summary of what remains

### Must do
- Rename `tmp` in `master/package.json`
- Explain the role of `master`, `lib`, npm, GitLab, and GitHub
- Explain compiled npm mode vs raw source mode
- Add one sentence about the historical `daisyui-vue-kit` URL
- Replace old GitHub repo links with `Cornet-UI`
- Slightly simplify the quickstart flow

### Nice to do
- Add a short contribution-routing note
- Add a “which install mode should I choose?” note
- Review all remaining public-facing wording for consistency

---

## Suggested execution order

### Step 1
Fix `master/package.json`
- rename package
- add description if missing

### Step 2
Patch `README.md`
- add repository/distribution explanation
- add historical naming note
- clarify npm vs source mode
- update all GitHub links to `Cornet-UI`

### Step 3
Polish the quickstart
- move plugin usage into an optional subsection if needed

### Step 4
Final consistency pass
- grep for old wording
- grep for old GitHub repo paths
- verify links
- verify the public story is consistent everywhere

---

## End goal

When someone lands on `master`, they should instantly understand:

- what Cornet UI is
- how to install it
- why there are multiple distribution modes
- why GitLab and GitHub both exist
- where the source lives
- where the public interaction happens

That is the main remaining objective for the `master` branch.