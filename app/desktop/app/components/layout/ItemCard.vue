<script setup>
const props = defineProps({
  name: String,
  image: String,
  link: String,
  statusItem: String,
});

const classStatus = computed(() => {
  switch (props.statusItem) {
    case "Em Estoque":
      return "em_estoque";
    case "Baixo":
      return "baixo_estoque";
    case "Em Falta":
      return "falta_estoque";
    default:
      return "em_estoque";
  }
});
</script>

<template>
  <div class="card_body">
    <NuxtLink :to="props.link" class="link_container">
      <span :class="`warning ${classStatus}`">
        {{ props.statusItem }}
      </span>
      <div
        class="image_content"
        :style="{ backgroundImage: `url(${props.image})` }"
      ></div>
      <p class="mt-1 mb-1">{{ props.name }}</p>
    </NuxtLink>
  </div>
</template>

<style scoped>
.card_body {
  width: 150px;
  position: relative;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

.image_content {
  border-radius: 10px;
  height: 180px;

  background-position: center center;
  background-size: contain;

  box-shadow: var(--shadow);
}

.warning {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: x-small;
  font-weight: bold;
  color: #fff;
  border-radius: 15px;
  padding: 3px 5px;
  border: 2px solid #fff;
}

.em_estoque {
  background-color: green;
  box-shadow: 0px 0px 10px green;
}

.baixo_estoque {
  background-color: orange;
  box-shadow: 0px 0px 10px orange;
}

.falta_estoque {
  background-color: red;
  box-shadow: 0px 0px 10px red;
}

p {
  color: var(--focus-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
