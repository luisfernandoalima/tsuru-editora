<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import ItemCard from "~/components/ui/cards/ItemCard.vue";
import { useAuthToken } from "~/composables/useAuthToken";

import { Icon } from "@iconify/vue";
import Container from "~/components/layout/Container.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});
const { user } = useAuth();

const perfil = getPerfil(user.value?.funcao);

const { getToken } = useAuthToken();

const route = useRoute();
const router = useRouter();

const api = useApi();
const token = getToken();

const produto = ref(route.query.produto ?? "");

const produtos = ref([]);

const buscarProduto = () => {
  router.push(`/?produto=${produto.value}`);
};

const carregarProdutos = async () => {
  const pesquisa = produto.value;

  let response;

  response = await api(`/product/search?pesquisa=${pesquisa}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  produtos.value = response.produtos;
};

watch(
  () => route.query.produto,
  () => {
    carregarProdutos();
  },
  { immediate: true },
);
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarProduto"
      :value="produto"
      @update:value="produto = $event"
      placeholder="Pesquise pelo título ou ISBN do produto"
    />

    <Container customClass="main_area">
      <NuxtLink to="/estoque/novo-produto" v-if="perfil === 1">
        <div class="new_product_container">
          <Icon icon="ep:plus" width="70" height="70" />
        </div>
        <p class="mt-1 mb-1 text-(--details) font-bold text-center">
          Criar novo
        </p>
      </NuxtLink>
      <ItemCard
        v-for="value in produtos"
        :key="value._id"
        :name="value._titulo"
        :link="`/produto/${value._id}`"
        :image="`http://localhost:8081${value._imgCapa}`"
        statusItem="Baixo"
      />
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.main_area {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: start;
  justify-items: center;
  row-gap: 1em;
  padding: 50px 0px;
  overflow-y: auto;
  overflow-x: unset;
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  flex: 1;
}

.new_product_container {
  height: 100%;
  border-radius: 10px;
  height: 210px;
  width: 150px;
  background-position: center center;
  background-size: contain;
  background-color: rgba(255, 255, 255, 0.389);
  border: 2px solid var(--details);
  color: var(--details);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
