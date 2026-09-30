<script setup>
import Button from "./Button.vue";
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
      <div class="card_title">
        <h1>{{ title }}</h1>
      </div>
      <div class="card_body">
        <p>{{ message }}</p>
        <div class="card_button">
          <Button text="Confirmar" class-name="primary" @click="handleClick" />
          <Button
            text="Cancelar"
            class-name="secondary"
            @click="emit('close')"
          />
        </div>
      </div>
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
  width: 750px;
  border-radius: 15px;
  background-color: var(--main);

  .card_title {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;

    padding: 5px;
    background-color: var(--secondary);
    color: var(--main);

    h1 {
      font-size: 1.3em;
      font-weight: 700;
    }
  }

  .card_body {
    padding: 5px;
  }
}

.card_button {
  width: 100%;
  display: flex;
  gap: 5px;

  align-items: end;
}
</style>
