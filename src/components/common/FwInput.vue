<template>
  <div :class="['fw-input-wrapper', { 'fw-input-wrapper--error': error, 'fw-input-wrapper--disabled': disabled }]">
    <label v-if="label" class="fw-input__label">{{ label }}<span v-if="required" class="fw-input__required">*</span></label>
    
    <div class="fw-input__container">
      <span v-if="$slots.prefix" class="fw-input__prefix">
        <slot name="prefix"></slot>
      </span>
      
      <input
        v-if="type !== 'textarea'"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="['fw-input', { 'fw-input--with-prefix': $slots.prefix, 'fw-input--with-suffix': $slots.suffix || showPasswordToggle }]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
      />
      
      <textarea
        v-else
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :class="['fw-input fw-input--textarea', { 'fw-input--error': error }]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>
      
      <span v-if="$slots.suffix || showPasswordToggle" class="fw-input__suffix">
        <slot name="suffix"></slot>
        <button
          v-if="type === 'password' && showPasswordToggle"
          type="button"
          class="fw-input__password-toggle"
          @click="togglePassword"
        >
          {{ showPassword ? '🔒' : '👁' }}
        </button>
      </span>
    </div>
    
    <div v-if="error" class="fw-input__error">{{ error }}</div>
    <div v-else-if="hint" class="fw-input__hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'search' | 'textarea';
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  maxlength?: number;
  rows?: number;
  showPasswordToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  label: '',
  error: '',
  hint: '',
  disabled: false,
  readonly: false,
  required: false,
  maxlength: undefined,
  rows: 4,
  showPasswordToggle: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  enter: [event: KeyboardEvent];
}>();

const showPassword = ref(false);
const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleEnter = (event: KeyboardEvent) => {
  emit('enter', event);
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.fw-input-wrapper {
  width: 100%;
}

.fw-input__label {
  display: block;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.fw-input__required {
  color: var(--color-danger);
  margin-left: 2px;
}

.fw-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.fw-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  outline: none;
  transition: all var(--transition-normal);
}

.fw-input::placeholder {
  color: var(--color-text-disabled);
}

.fw-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(38, 70, 83, 0.1);
}

.fw-input--with-prefix {
  padding-left: 44px;
}

.fw-input--with-suffix {
  padding-right: 44px;
}

.fw-input--textarea {
  height: auto;
  min-height: 100px;
  padding: 12px 16px;
  resize: vertical;
  line-height: 1.6;
}

.fw-input--error {
  border-color: var(--color-danger);
}

.fw-input--error:focus {
  box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.1);
}

.fw-input:disabled {
  background: var(--color-background);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

/* 前缀图标 */
.fw-input__prefix {
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

/* 后缀图标 */
.fw-input__suffix {
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.fw-input__password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  color: var(--color-text-tertiary);
}

/* 错误提示 */
.fw-input__error {
  font-size: var(--font-size-caption);
  color: var(--color-danger);
  margin-top: var(--spacing-xs);
}

/* 提示文字 */
.fw-input__hint {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

/* 尺寸变体 */
.fw-input-wrapper--error .fw-input {
  border-color: var(--color-danger);
}

.fw-input-wrapper--disabled .fw-input {
  background: var(--color-background);
  cursor: not-allowed;
}
</style>
