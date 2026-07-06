# Cornet Project Overview

## Architecture

```
lib/
├── index.ts                    # Main exports (components + composables)
├── index.css                   # Global styles
├── plugin-vite.ts              # Vite plugin for integration
├── package.json                # Dependencies (peerDependencies)
├── cornet-llm.txt              # Complete component documentation (legacy)
├── types/
│   └── index.ts                # Auto-generated: all type exports
├── composables/
│   ├── useSizeProps.ts         # Size mapping -> CSS classes
│   └── useVariantProps.ts      # Variant mapping -> CSS classes
├── components/
│   ├── Actions/                # 5 components: buttons, modals, dropdowns
│   ├── DataDisplay/            # 18 components: cards, tables, badges, avatars
│   ├── DataInput/              # 13 components: inputs, selects, checkboxes
│   ├── Feedback/               # 7 components: alerts, loading, tooltips
│   ├── Layout/                 # 2 components: drawer, join
│   └── Navigation/             # 9 components: menus, pagination, tabs
└── build-scripts/              # Build and generation scripts
```

## Components by category (54 total)

### Actions (5)
DuButton, DuDropdown, DuModal, DuSwap, DuFab

### DataDisplay (18)
DuAccordion, DuAvatar, DuBadge, DuCard, DuCarousel, DuCarouselItem, DuChat, DuCollapse, DuCountdown, DuCountdownGroup, DuDiff, DuKbd, DuList, DuStat, DuStats, DuStatus, DuTable, DuTimeline

### DataInput (13)
DuCheckbox, DuFieldset, DuFileInput, DuFilter, DuInputField, DuLabel, DuLabelInputValidator, DuRadio, DuRange, DuRating, DuSearch, DuSelect, DuTextArea

### Feedback (7)
DuAlert, DuLoading, DuProgress, DuRadialProgress, DuSkeleton, DuToast, DuTooltip

### Layout (2)
DuDrawer, DuJoin

### Navigation (9)
DuBreadcrumbs, DuDock, DuLink, DuMenu, DuNavbar, DuPagination, DuStepItem, DuSteps, DuTabs

## Key dependencies (peerDependencies)

- `vue` >= 3.3.11
- `daisyui` >= 5.5.18
- `tailwindcss` >= 4.0.0
- `typescript` >= 5.8.3
- `vite` >= 6.4.1
- `@tailwindcss/vite` >= 4.1.18

## Package exports

| Export | File | Description |
|--------|---------|-------------|
| `.` | `index.ts` | All components and composables |
| `./plugin-vite` | `plugin-vite.ts` | Vite plugin |
| `./css` | `index.css` | Styles |
| `./types` | `types/index.ts` | All TypeScript types |

## Contribution rules

- Never create a component file without the 3 associated files (.vue, .types.ts, .stories.ts)
- Always export the new component in `index.ts`
- Types must be in the `.types.ts` file, not in the `.vue` file
- Use `useSizeMapping` and `useVariantMapping` composables for common props
- Follow DaisyUI conventions for CSS class names
