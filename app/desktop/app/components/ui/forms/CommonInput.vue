<script setup>
import { defineProps } from "vue";

defineProps({
  text: String,
  name: String,
  type: String,
  placeholder: String,
  modelValue: String,

  mask: String,
  maxlength: Number,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label :for="name">{{ text }}</label>
    <input
      v-maska="mask"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :id="name"
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
}

input:focus {
  outline: none;
}

input:disabled {
  background-color: #cecece;
  cursor: not-allowed;
}

input::placeholder {
  color: #ababab;
}

input:disabled::placeholder {
  color: #616161;
}
</style>
