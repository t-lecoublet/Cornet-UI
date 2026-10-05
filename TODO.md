# TODO - Documentation composants Cornet (v2)

## Objectif

Documenter TOUTES les props de chaque composant avec:

- [x] Exemple pour chaque prop
- [x] Exemples de cas d'utilisation avec `<template>` slots
- [x] Correspondance avec les stories Storybook existantes

---

## Progression

### ✅ TOUT TERMINÉ

#### Navigation

- `navigation/menu.ts` - props, slots, all directions, sizes, nested submenus, callbacks
- `navigation/navbar.ts` - slots (#start, #center, #end)
- `navigation/tabs.ts` - props, slots, manual mode, all styles, sizes, icons
- `navigation/steps.ts` - props, slots, manual mode, all directions, variants, responsive
- `navigation/pagination.ts` - props, slots, manual mode, all variants, outline, soft, sizes
- `navigation/breadcrumbs.ts` ✓
- `navigation/dock.ts` ✓
- `navigation/link.ts` ✓

#### DataDisplay

- `data-display/table.ts` - props, slots (#cell-{key}, #header-{key}, #footer-{key})
- `data-display/timeline.ts` - props, slots, manual mode, modifiers
- `data-display/chat.ts` - props, slots (#image-{n}, #header-{n}, #message-{n}, #footer-{n})
- `data-display/carousel.ts` - props, dynamic items mode, center/start/end, vertical
- `data-display/accordion.ts` - props, slots, dynamic items, modifiers
- `data-display/collapse.ts` - props, slots, dynamic items, modifiers, open state
- `data-display/avatar.ts` - ring, mask, placeholder
- `data-display/card.ts` - slots #image/#actions
- `data-display/list.ts` - slots #start/#end
- `data-display/stat.ts` - slots
- `data-display/diff.ts` - aspectRatio
- `data-display/countdown.ts` - targetDate, autoStart
- `data-display/kbd.ts` ✓
- `data-display/badge.ts` ✓
- `data-display/status.ts` ✓

#### DataInput

- `data-input/select.ts` - props, slots (#selected, #option, #tag, #no-options)
- `data-input/search.ts` - props, slots (#option, #add-option, #no-results)
- `data-input/rating.ts` - props, shape, color, halfStar, clearable, disabled, sizes
- `data-input/input-field.ts` - suggestionList, validation
- `data-input/textarea.ts` - modelValue, ghost
- `data-input/file-input.ts` - ghost
- `data-input/filter.ts` - buttonsArgs
- `data-input/checkbox.ts` ✓
- `data-input/radio.ts` ✓
- `data-input/range.ts` ✓
- `data-input/fieldset.ts` ✓
- `data-input/label.ts` ✓

#### Actions

- `actions/dropdown.ts` - props, slots (#trigger, #content), all placements
- `actions/modal.ts` - props, slot #actions, closeButton, closeOnEscape, closeBackdrop, script support
- `actions/button.ts` - as prop, href, type
- `actions/fab.ts` - slots manuels, mainAction
- `actions/swap.ts` ✓

#### Feedback

- `feedback/alert.ts` - props, direction, soft/outline/dash, dismissible, autoDismissible, icon
- `feedback/tooltip.ts` - props, slot #content, responsive
- `feedback/loading.ts` ✓
- `feedback/progress.ts` ✓
- `feedback/radial-progress.ts` ✓
- `feedback/toast.ts` ✓
- `feedback/skeleton.ts` ✓

#### Layout

- `layout/drawer.ts` - props, slots (#sidebar, #content), items mode, iconOnly
- `layout/join.ts` ✓

---

## Nouvelles fonctionnalités de documentation

### Support du script dans les sections

Les sections supportent maintenant un champ `script` pour ajouter du code `<script setup>`:

```typescript
{
  title: 'Titre de la section',
  preview: `<DuButton @click="open = true">Open</DuButton>
<DuModal v-model:open="open">Content</DuModal>`,
  code: `<DuButton @click="open = true">Open</DuButton>
<DuModal v-model:open="open">Content</DuModal>`,
  script: `const open = ref(false)`,
}
```

### Composants de documentation

- `PropsDocs.vue` - Affiche une table des props
- `SlotsDocs.vue` - Affiche une table des slots
- `LivePreview.vue` - Supporte maintenant les props `code` et `script`

## Conventions de documentation

Pour chaque prop:

```typescript
{
  title: 'Nom de la prop',
  description: 'Description courte',
  preview: `<Composant prop="value">
    <template #slot>Contenu</template>
  </Composant>`,
  code: `<Composant prop="value">
    <template #slot>Contenu</template>
  </Composant>`,
}
```

Pour les slots complexes:

```typescript
{
  title: 'Utilisation du slot #nom',
  description: 'Quand utiliser ce slot',
  code: `<Composant>
    <template #nom="{ item, index }">
      <!-- Contenu avec destructuring -->
    </template>
  </Composant>`,
}
```
