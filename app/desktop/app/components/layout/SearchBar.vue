<script setup>
import { Icon } from "@iconify/vue";

defineProps({
  handleForms: Function,
  placeholder: String,
  value: String,
});

const emit = defineEmits(["update:value"]);
</script>

<template>
  <form @submit.prevent="handleForms">
    <label for="searchInput">
      <button>
        <Icon
          icon="material-symbols:search"
          width="35"
          height="35"
          style="color: #5b0606"
        />
      </button>
      <input
        type="text"
        id="searchInput"
        name="seachBar"
        :placeholder="placeholder"
        :value="value"
        @input="emit('update:value', $event.target.value)"
      />
    </label>
  </form>
</template>

<style scoped>
form {
  width: 100%;
  margin-bottom: 25px;
  color: var(--main_text);
}

label {
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 5px;
  width: 100%;
  border: 3px solid var(--details);
  border-radius: 10px;

  background-color: var(--main);
  box-shadow: var(--shadow);
}

input {
  width: 100%;
  padding: 2px 5px;
  &:focus {
    outline: none;
  }
}
</style>
