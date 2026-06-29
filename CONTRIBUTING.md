# Contributing to Cornet

Thanks for your interest in Cornet!

This repository (`master` branch) is the **starter/demo app** — a Vite + Vue project that consumes Cornet via the `lib` submodule.  
**Component contributions** (new components, fixes, types, tests) should target the [`lib` branch](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/tree/lib).

## Where to contribute

| What | Where |
|------|-------|
| New components, fixes, composables, types | [`lib` branch](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/tree/lib) |
| Starter app / demo improvements | This repo (`master` branch) |
| Issues & bug reports | [GitLab](https://gitlab.limos.fr/hub-isima/daisyui-vue-kit/-/issues) or [GitHub](https://github.com/t-lecoublet/Cornet-UI/issues) |

- **Primary source (CNRS/LIMOS GitLab):** merge requests and CI run here.
- **GitHub mirror:** issues are welcome; pull requests will be re-routed to GitLab by a maintainer.

## Getting started

```bash
git clone --recurse-submodules git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git
cd daisyui-vue-kit
npm install
npm run dev
```

To contribute to the library itself, work in `lib/`:

```bash
cd lib
npm install
npm run lint
npm run type-check
npm test
npm run build
```

## Conventions

- Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `chore:`, with `!` for breaking changes).
- Code comments and commit messages in English.
- See [`lib/CONTRIBUTING.md`](./lib/CONTRIBUTING.md) for component-level conventions (file structure, naming, accessibility, releases).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
