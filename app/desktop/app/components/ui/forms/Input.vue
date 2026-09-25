<script setup>
import { defineProps } from "vue";

defineProps({
  label: Boolean,
  text: String,
  name: String,
  type: String,
  placeholder: String,
  modelValue: String,

  className: String,

  mask: String,
  maxlength: Number,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label v-if="label" :for="name">{{ text }}</label>
    <input
      v-maska="mask"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :id="name"
      :class="className"
      :value="modelValue"
      :maxlength="maxlength"
      @input="emit('update:modelValue', $event.target.value)"
      autocomplete="off"
      :disabled="disabled"
    />
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #000;
  font-size: 1.2em;
}

input {
  border: var(--border);
  border-radius: 10px;
  padding: 3px;

  &:disabled {
    background-color: #cecece;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #ababab;
  }

  &:disabled::placeholder {
    color: #616161;
  }

  &:focus {
    outline: none;
  }

  &.login {
    display: block;
    height: 2rem;
    border: 2px solid #fff;
    background-color: #5b0606;

    &::placeholder {
      color: #fff;
    }
  }
}
</style>
