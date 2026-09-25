<script setup>
defineProps({
  text: String,
  name: String,
  placeholder: String,

  options: {
    type: Array,
    required: true,
  },

  modelValue: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label :for="name">
      {{ text }}
    </label>

    <select
      :name="name"
      :id="name"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>

      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.text }}
      </option>
    </select>
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

select {
  background-color: #fff;
  border: 3px solid var(--details);
  border-radius: 10px;
  padding: 5px;
}
</style>
