<script setup>
defineProps({
  text: String,
  width: Number,
  click: Function,
  className: String,
});
</script>

<template>
  <button @click="click" :style="{ width: width + '%' }" :class="className">
    {{ text }}
  </button>
</template>

<style scoped>
button {
  border-radius: 15px;
  font-size: 1.2em;
  font-weight: 600;
  border: var(--border);
  cursor: pointer;

  transition: 0.3s;

  &.primary {
    background-color: var(--secondary);
    color: var(--main);

    &:hover {
      background-color: var(--main);
      color: var(--secondary);
    }
  }

  &.secondary {
    background-color: var(--main);
    color: var(--secondary);

    &:hover {
      background-color: var(--secondary);
      color: var(--main);
    }
  }
}
</style>
