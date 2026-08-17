<script setup>
const props = defineProps({ customClass: String });
</script>

<template>
  <section :class="['page_container', props.customClass]">
    <slot></slot>
  </section>
</template>
<style>
.page_container {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 15px;
}
</style>
