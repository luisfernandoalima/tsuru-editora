<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  id: Number,
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

const server = useServer();
const { user } = useAuth();

const perfil = getPerfil(user.value?.funcao);
</script>

<template>
  <div class="card_body">
    <div>
      <NuxtLink :to="props.link" class="link_container">
        <span :class="`warning ${classStatus}`">
          {{ props.statusItem }}
        </span>
        <div
          class="image_content"
          :style="{ backgroundImage: `url(${server + props.image})` }"
        ></div>
        <p class="mt-1 mb-1">{{ props.name }}</p>
      </NuxtLink>
    </div>
    <div
      v-if="perfil === 1"
      class="button_area w-full flex items-center justify-between"
    >
      <button class="rounded-bl-lg">
        <NuxtLink :to="`/produto/atualizar/${props.id}`"
          ><Icon icon="jam:write-f" width="24" height="24"
        /></NuxtLink>
      </button>
      <button class="rounded-br-lg">
        <NuxtLink :to="`/produto/excluir/${props.id}`"
          ><Icon icon="tabler:trash" width="24" height="24"
        /></NuxtLink>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card_body {
  width: 175px;
  position: relative;
  transition: 0.3s;
  border: 2px solid rgb(131, 131, 131);
  border-radius: 10px;

  &:hover {
    /* transform: scale(1.05); */
    box-shadow: 4px 8px 12px #0a0a0a73;
  }
}

.image_content {
  border-radius: 8px 8px 0px 0px;
  height: 180px;

  background-position: top center;
  background-size: cover;

  /* box-shadow: var(--shadow); */
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
  margin: 2px 3px;
  line-height: 24px;
  min-height: 50px;
  overflow: hidden;
}

.button_area {
  button {
    background-color: #f7f7f7;
    color: var(--details);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:hover {
      background-color: var(--secondary);
      color: #f7f7f7;
    }
  }
}
</style>
