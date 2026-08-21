<script setup>
import { Icon } from "@iconify/vue";
defineProps({
  name: String,
  image: String,
  id: Number,
});
</script>

<template>
  <div class="card_body">
    <div
      class="image_content"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
    <p class="mt-1 mb-1">{{ name }}</p>
    <div class="button_area w-full flex items-center justify-between">
      <button>
        <NuxtLink :to="`/estoque/atualizar/${id}`"
          ><Icon icon="jam:write-f" width="24" height="24"
        /></NuxtLink>
      </button>
      <button>
        <NuxtLink :to="`/estoque/excluir/${id}`"
          ><Icon icon="tabler:trash" width="24" height="24"
        /></NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card_body {
  width: 150px;
}

.image_content {
  height: 100%;
  border-radius: 10px;
  height: 180px;

  background-position: center center;
  background-size: contain;
}

p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.button_area {
  button {
    background-color: #f7f7f7;
    color: var(--details);
    border-radius: 10px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow);
  }
}
</style>
