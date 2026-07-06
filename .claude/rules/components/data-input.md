---
paths:
  - "components/DataInput/**"
---

# Data Input Components

## DuInputField

**Files:** `components/DataInput/du-input-field/du-input-field.vue` | `.types.ts` | `.stories.ts`

**Props:**
- `type?`: DuInputFieldType (`'text'` | `'password'` | `'email'` | `'number'` | `'date'` | `'datetime-local'` | `'week'` | `'month'` | `'tel'` | `'url'` | `'search'` | `'time'`)
- `placeholder?`: string
- `size?`: Size
- `ghost?`: boolean
- `invalid?`: boolean
- `variant?`: Variant
- `disabled?`: boolean
- `suggestionName?`: string
- `suggestionList?`: string[]
- `required?`: boolean
- `pattern?`: string
- `minlength?`: number
- `maxlength?`: number
- `title?`: string
- `class?`: string

---

## DuSelect

**Files:** `components/DataInput/du-select/du-select.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Search logic, multi-selection, object management. Read the complete source before modifying.

**Props:**
- `ghost?`: boolean
- `variant?`: Variant
- `size?`: Size
- `disabled?`: boolean
- `multiple?`: boolean
- `modelValue?`: any (v-model)
- `placeholder?`: string
- `search?`: boolean - External search
- `searchable?`: boolean - Search enabled
- `searchableInside?`: boolean - Search integrated in dropdown
- `searchPlaceholder?`: string
- `searchNoResultsText?`: string
- `options?`: any[]
- `checkboxes?`: boolean
- `closeOnSelect?`: boolean
- `trackBy?`: string - Key property for objects
- `labelBy?`: string - Label property for objects
- `returnObject?`: boolean - Return complete object

---

## DuSearch

**Files:** `components/DataInput/du-search/du-search.vue` | `.types.ts` | `.stories.ts`

> **Complex component**: Autocomplete, multi-selection.

**Props:**
- `modelValue?`: any | any[] (v-model)
- `name`: string (required)
- `id`: string (required)
- `placeholder?`: string
- `listValues`: DuSearchOption[] (required)
- `limit?`: number
- `addOption?`: boolean
- `type?`: string
- `required?`: boolean
- `pattern?`: string
- `multiple?`: boolean
- `size?`: Size
- `variant?`: Variant
- `ghost?`: boolean
- `disabled?`: boolean
- `customClass?`: string

**Types :**
```typescript
export interface DuSearchOption {
  id: any
  name: string
}
```

---

## DuCheckbox

**Fichiers :** `components/DataInput/du-checkbox/du-checkbox.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: boolean (v-model, via `defineModel()`)
- `disabled?`: boolean
- `indeterminate?`: boolean
- `variant?`: Variant
- `size?`: Size

---

## DuRadio

**Fichiers :** `components/DataInput/du-radio/du-radio.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `checked?`: boolean
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size

---

## DuRange

**Fichiers :** `components/DataInput/du-range/du-range.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: number (v-model)
- `min?`: number
- `max?`: number
- `step?`: number
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size

---

## DuRating

**Fichiers :** `components/DataInput/du-rating/du-rating.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: number (v-model)
- `items?`: DuRatingItemData[]
- `count?`: number - Nombre d'étoiles (si pas d'items)
- `name?`: string
- `halfStar?`: boolean
- `clearable?`: boolean
- `disabled?`: boolean
- `size?`: Size
- `shape?`: `'star'` | `'star-2'` | `'heart'` | `'circle'`
- `color?`: string
- `customClass?`: string

**Types :**
```typescript
export interface DuRatingItemData {
  value: number
  checked?: boolean
}
```

---

## DuTextArea

**Fichiers :** `components/DataInput/du-text-area/du-text-area.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `modelValue?`: string (v-model)
- `placeholder?`: string
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size
- `ghost?`: boolean

---

## DuFilter

**Files:** `components/DataInput/du-filter/du-filter.vue` | `.types.ts` | `.stories.ts`

Filter button group.

**Props:**
- `items?`: DuFilterItem[]
- `name?`: string
- `buttonsArgs?`: DuFilterButtonArgs

**Types :**
```typescript
export interface DuFilterItem {
  title?: string
  checked?: boolean
  customClass?: string
  buttonsArgs?: DuFilterButtonArgs
}

export interface DuFilterButtonArgs {
  variant?: Variant
  size?: Size
  outline?: boolean
  soft?: boolean
  dash?: boolean
  active?: boolean
  ghost?: boolean
  link?: boolean
  wide?: boolean
  disabled?: boolean
  square?: boolean
  circle?: boolean
}
```

---

## DuFieldset

**Fichiers :** `components/DataInput/du-fieldset/du-fieldset.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `legend?`: string
- `label?`: string

---

## DuFileInput

**Fichiers :** `components/DataInput/du-file-input/du-file-input.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `disabled?`: boolean
- `variant?`: Variant
- `size?`: Size
- `ghost?`: boolean

---

## DuLabel

**Fichiers :** `components/DataInput/du-label/du-label.vue` | `.types.ts` | `.stories.ts`

**Props :**
- `type?`: `'label'` | `'input'` | `'select'` | `'floating-label'` | `'fieldset-label'`

---

## DuLabelInputValidator

**Files:** `components/DataInput/du-label-input-validator/du-label-input-validator.vue` | `.types.ts` | `.stories.ts`

Label + input combo with built-in HTML5 validation.

**Props:**
- `type?`: DuLabelProps["type"]
- `pattern?`: string
- `minlength?`: number
- `maxlength?`: number
- `title?`: string
- `required?`: boolean
- `placeholder?`: string
- `inputType?`: DuInputFieldType
- `disabled?`: boolean
- `suggestionName?`: string
- `suggestionList?`: string[]
