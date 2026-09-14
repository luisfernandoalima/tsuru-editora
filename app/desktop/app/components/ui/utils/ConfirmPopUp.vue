<script setup>
defineProps({
  title: String,
  message: String,
  active: Boolean,
  handleClick: Function,
});

const emit = defineEmits(["close"]);
</script>

<template>
  <div v-if="active" class="background">
    <div class="popup_div">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <Button @click="handleClick">Confirmar</Button>
      <Button @click="emit('close')">Cancelar</Button>
    </div>
  </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(189, 189, 189, 0.486);
  z-index: 1;
}

.popup_div {
  background-color: var(--main);
}
</style>
