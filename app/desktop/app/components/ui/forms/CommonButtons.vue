<script setup>
const props = defineProps({
  resetText: String,
  submitText: String,
});
</script>

<template>
  <div class="button_area">
    <input type="reset" :value="props.resetText" class="button reset_button" />
    <input
      type="submit"
      :value="props.submitText"
      class="button submit_button"
    />
  </div>
</template>

<style scoped>
.button_area {
  display: flex;
  gap: 15px;
  align-self: flex-end;
}

.button {
  display: block;
  padding: 5px;
  width: 100px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

.reset_button {
  color: var(--details);
  border: var(--border);
}

.submit_button {
  color: #fff;
  background-color: var(--details);
}
</style>
