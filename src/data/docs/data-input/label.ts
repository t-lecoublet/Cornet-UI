import type { DocPageData } from '@/types/docs'

export default {
  title: 'Label',
  description: 'Label wraps an input with an accessible label. Use it to associate text with form fields.',
  category: 'Data Input',
  source: 'https://daisyui.com/components/label/',
  props: [
    {
      title: 'type',
      description: 'Which DaisyUI label style to render',
      type: "'label' | 'input' | 'select' | 'floating-label' | 'fieldset-label'",
      default: '"label"',
      options: ['label', 'input', 'select', 'floating-label', 'fieldset-label'],
    },
  ],
  sections: [
    {
      title: 'Basic',
      preview: `<DuLabel type="label" class="w-72">
  Email
  <DuInputField type="email" placeholder="your@email.com" />
</DuLabel>`,
      code: `<DuLabel type="label">
  Email
  <DuInputField v-model="email" type="email" placeholder="your@email.com" />
</DuLabel>`,
    },
    {
      title: 'Label with fieldset',
      description: 'When wrapping a fieldset, the label could be placed inside the fieldset and use `type="label"`.',
      links: [
        { label: 'DuFieldset docs', href: '/docs/data-input/fieldset' },
      ],
      preview: `<div class="flex flex-col">
<DuFieldset>
  <DuLabel type="label">Enter your email</DuLabel>
  <DuInputField type="email" placeholder="your@email.com" />
</DuFieldset>
</div>`,
      code: `<div class="flex flex-col">
  <DuFieldset>
    <DuLabel type="label">Enter your email</DuLabel>
    <DuInputField type="email" placeholder="your@email.com" />
  </DuFieldset>
</div>`,
    },
    {
      title: 'Label prefix',
      description: 'Place a `<span class="label">` before the input to show a prefix.',
      preview: `<DuLabel type="input" class="w-72">
  <span class="label">https://</span>
  <DuInputField placeholder="mysite.com" />
</DuLabel>`,
      code: `<DuLabel type="input">
  <span class="label">https://</span>
  <DuInputField v-model="url" placeholder="mysite.com" />
</DuLabel>`,
    },
    {
      title: 'Label suffix',
      description: 'Place a `<span class="label">` after the input to show a suffix.',
      preview: `<DuLabel type="input" class="w-72">
  <DuInputField placeholder="domain name" />
  <span class="label">.com</span>
</DuLabel>`,
      code: `<DuLabel type="input">
  <DuInputField v-model="domain" placeholder="domain name" />
  <span class="label">.com</span>
</DuLabel>`,
    },
    {
      title: 'Label for select',
      description: 'Used when wrapping a select element.',
      links: [
        { label: 'DuSelect docs', href: '/docs/data-input/select' },
      ],
      preview: `<DuLabel type="select" class="w-72">
  <span class="label">Type</span>
  <DuSelect :options="[
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]" />
</DuLabel>`,
      code: `<DuLabel type="select">
  <span class="label">Type</span>
  <DuSelect v-model="type" 
    :option="[
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]" 
  />
</DuLabel>`,
    },
    {
      title: 'Floating label',
      preview: `<DuLabel type="floating-label" class="w-72">
  <span class="label">Your name</span>
  <DuInputField placeholder="Your name" />
</DuLabel>`,
      code: `<DuLabel type="floating-label">
  <span class="label">Your name</span>
  <DuInputField v-model="name" placeholder="Your name" />
</DuLabel>`,
    },
    {
      title: 'Floating label with validation',
      description: 'Constraints go on the `DuInputField` as usual. Once the field has been visited and fails, it turns red and its message appears under the label — the field hands it to `DuLabel`, which renders it after the `<label>` so the flex row never squeezes the input. Type something wrong, then click away.',
      links: [
        { label: 'DuInputField validation', href: '/docs/data-input/input-field' },
        { label: 'DaisyUI floating-label', href: 'https://daisyui.com/components/label/#floating-label' },
      ],
      preview: `<div class="flex flex-col gap-4 w-72">
  <DuLabel type="floating-label">
    <span>Email</span>
    <DuInputField
      type="email"
      placeholder="you@example.com"
      required
      :errorMessages="{ required: 'We need an email to reach you.', type: 'That does not look like an email.' }"
    />
  </DuLabel>
  <DuLabel type="floating-label">
    <span>Username</span>
    <DuInputField
      placeholder="3 to 16 letters"
      required
      pattern="[A-Za-z]{3,16}"
      :errorMessages="{ pattern: '3 to 16 letters, nothing else.' }"
    />
  </DuLabel>
</div>`,
      code: `<DuLabel type="floating-label">
  <span>Email</span>
  <DuInputField
    v-model="email"
    type="email"
    placeholder="you@example.com"
    required
    :errorMessages="{
      required: 'We need an email to reach you.',
      type: 'That does not look like an email.',
    }"
  />
</DuLabel>`,
    },
    {
      title: 'Prefixed input with validation',
      description: 'With `type="input"` the label itself draws the border, so it is the label that turns red. The message is rendered as the label\'s next sibling, so give the parent a column layout.',
      preview: `<div class="flex flex-col w-72">
  <DuLabel type="input">
    <span class="label">https://</span>
    <DuInputField
      placeholder="mysite.com"
      required
      pattern="[a-z0-9]+(\\.[a-z0-9]+)+"
      :errorMessages="{ required: 'A domain is required.', pattern: 'Something like mysite.com' }"
    />
  </DuLabel>
</div>`,
      code: `<DuLabel type="input">
  <span class="label">https://</span>
  <DuInputField
    v-model="domain"
    placeholder="mysite.com"
    required
    pattern="[a-z0-9]+(\\.[a-z0-9]+)+"
    :errorMessages="{ required: 'A domain is required.', pattern: 'Something like mysite.com' }"
  />
</DuLabel>`,
    },
  ],
} satisfies DocPageData
