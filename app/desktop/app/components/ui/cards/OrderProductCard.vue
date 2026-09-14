<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  item: Object,
});

const emit = defineEmits(["remover"]);
</script>

<template>
  <div class="item_card">
    <div
      class="image_container"
      :style="{
        backgroundImage: `url(http://localhost:8081${item.produto._imgCapa})`,
      }"
    ></div>

    <div class="info_container">
      <p>
        {{ item.produto._id }}
        -
        {{ item.produto._isbn13 }}
      </p>

      <p class="text-3xl">
        {{ item.produto._titulo }}
      </p>
    </div>

    <input type="number" v-model="item.quantidade" min="1" />

    <button @click="emit('remover', item.produto._id)">
      <Icon icon="tabler:trash" />
    </button>
  </div>
</template>

<style scoped>
.item_card {
  display: grid;
  grid-template-columns: 17% 63% 10% 10%;

  border: 2px solid var(--details);
  border-radius: 10px;

  .image_container {
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;

    height: 100px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .info_container {
    padding-left: 10px;
  }

  input {
    background-color: #fff;
    color: #000;
    height: fit-content;

    align-self: center;
    padding: 2px 5px;
    &:focus {
      outline: none;
    }
  }
}
</style>
