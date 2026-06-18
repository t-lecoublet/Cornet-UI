# Cornet Usage Patterns

## Forms

### Field with label and validation

```vue
<DuLabelInputValidator
  type="label"
  inputType="email"
  placeholder="your@email.com"
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  title="Invalid email"
  v-model="email"
>
  Email
</DuLabelInputValidator>
```

### Label + Simple Input

```vue
<DuLabel type="label">
  Name
  <DuInputField type="text" v-model="name" required />
</DuLabel>
```

### Select with objects and search

```vue
<DuSelect
  v-model="selected"
  :options="items"
  placeholder="Choose..."
  trackBy="id"
  labelBy="name"
  returnObject
  searchableInside
/>
```

### Multi-select with checkboxes

```vue
<DuSelect
  v-model="selectedTags"
  :options="tags"
  multiple
  checkboxes
  searchableInside
  trackBy="id"
  labelBy="name"
/>
```

### Search with autocomplete

```vue
<DuSearch
  v-model="author"
  name="author"
  id="author-search"
  :listValues="[{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]"
  :limit="5"
/>
```

### Radio / Checkbox group

```vue
<!-- Radios -->
<label class="flex items-center gap-2">
  <DuRadio name="plan" value="free" v-model="plan" variant="primary" />
  Free
</label>

<!-- Checkbox -->
<label class="flex items-center gap-2">
  <DuCheckbox v-model="newsletter" variant="primary" />
  Newsletter
</label>
```

---

## Navigation

### Menu with submenus

```vue
<DuMenu
  :items="[
    { label: 'Dashboard', value: 'dash', href: '/' },
    { label: 'Products', subItems: [
      { label: 'List', href: '/products' },
      { label: 'Add', href: '/products/add' }
    ]},
    { label: 'Admin', disabled: true }
  ]"
  direction="vertical"
  :activeItem="currentPage"
/>
```

### Pagination

```vue
<DuPagination
  v-model="page"
  :total="250"
  :perPage="10"
  variant="primary"
  showFirst
  showLast
  showEllipsis
  :maxPages="5"
/>
```

### Tabs with content

```vue
<DuTabs :items="tabs" type="border">
  <template #content-0>Tab 1 content</template>
  <template #content-1>Tab 2 content</template>
</DuTabs>
```

### Steps wizard

```vue
<DuSteps
  :items="[
    { label: 'Info', dataContent: '1' },
    { label: 'Payment', dataContent: '2' },
    { label: 'Confirmation', dataContent: '3' }
  ]"
  :activeSteps="[0, 1]"
  variant="primary"
  direction="steps-horizontal"
/>
```

---

## Feedback

### Alert with variants

```vue
<!-- Success auto-dismiss -->
<DuAlert variant="success" dismissible autoDismissible icon>
  Operation successful!
</DuAlert>

<!-- Soft error -->
<DuAlert variant="error" soft icon>
  An error occurred.
</DuAlert>
```

### Toast notifications

```vue
<DuToast horizontalPosition="end" verticalPosition="top">
  <DuAlert v-for="toast in toasts" :variant="toast.type" dismissible>
    {{ toast.message }}
  </DuAlert>
</DuToast>
```

### Loading states

```vue
<!-- Spinner -->
<DuLoading animation="spinner" size="lg" variant="primary" />

<!-- Skeleton placeholder -->
<DuSkeleton class="h-32 w-full" />
<DuSkeleton class="h-4 w-3/4" />

<!-- Progress bar -->
<DuProgress :value="75" :max="100" variant="primary" />
```

### Confirmation modal

```vue
<DuModal v-model:open="isOpen" closeButton closeOnEscape placement="middle">
  <h3 class="font-bold text-lg">Confirmation</h3>
  <p>Are you sure?</p>
  <div class="flex gap-2 justify-end">
    <DuButton @click="isOpen = false" variant="neutral">Cancel</DuButton>
    <DuButton @click="confirm" variant="primary">Confirm</DuButton>
  </div>
</DuModal>
```

---

## Layout

### Responsive drawer

```vue
<DuDrawer v-model="drawerOpen" position="start" responsive :items="menuItems">
  <template #default>
    <DuNavbar>
      <template #start>
        <DuButton @click="drawerOpen = !drawerOpen" ghost square>Menu</DuButton>
      </template>
    </DuNavbar>
    <main><RouterView /></main>
  </template>
</DuDrawer>
```

### Joined elements

```vue
<!-- Input + button -->
<DuJoin direction="horizontal">
  <DuInputField v-model="query" placeholder="Search..." class="join-item" />
  <DuButton variant="primary" class="join-item">Go</DuButton>
</DuJoin>
```

### Cards grid

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <DuCard v-for="item in items" :key="item.id" :title="item.title" bordered>
    <p>{{ item.description }}</p>
    <template #actions>
      <DuButton variant="primary" size="sm">Details</DuButton>
    </template>
  </DuCard>
</div>
```

---

## Best Practices

### Always use v-model

```vue
<!-- Correct -->
<DuInputField v-model="value" />
<DuSelect v-model="selected" />
<DuCheckbox v-model="checked" />

<!-- Incorrect: no binding -->
<DuInputField />
```

### Disable buttons during async actions

```vue
<DuButton :disabled="loading" variant="primary" @click="submit">
  {{ loading ? 'Loading...' : 'Submit' }}
</DuButton>
```

### Type data with kit interfaces

```typescript
import type { MenuItem } from 'cornet-ui/types'
import type { SearchOption } from 'cornet-ui/types'

const items: MenuItem[] = [{ label: 'Home', href: '/' }]
```

### Always wrap inputs with DuLabel

```vue
<!-- Correct: accessible -->
<DuLabel type="label">
  Email
  <DuInputField type="email" v-model="email" />
</DuLabel>

<!-- Incorrect: no label -->
<DuInputField type="email" v-model="email" />
```

### Use `customClass` instead of modifying the component

```vue
<!-- Correct: custom classes via prop -->
<DuButton customClass="shadow-xl hover:scale-105" variant="primary">
  Styled
</DuButton>

<!-- Incorrect: direct override of internal styles -->
```
