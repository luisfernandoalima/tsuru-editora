<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import ItemStockCard from "~/components/layout/ItemStockCard.vue";

import { Icon } from "@iconify/vue";

import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const { getToken } = useAuthToken();

const route = useRoute();
const router = useRouter();

const api = useApi();
const token = getToken();

const produto = ref(route.query.produto ?? "");

const produtos = ref([]);

const buscarProduto = () => {
  router.push(`/estoque?produto=${produto.value}`);
};

const carregarProdutos = async () => {
  const tituloProduto = produto.value;

  let response;

  if (!tituloProduto) {
    response = await api("/product/list-products", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } else {
    response = await api(`/product/list-by-name/${tituloProduto}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

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
    ></SearchBar>

    <div class="main_area_stock">
      <NuxtLink to="/estoque/novo-produto">
        <div class="new_product_container">
          <Icon icon="ep:plus" width="70" height="70" />
        </div>
        <p class="mt-1 mb-1 text-(--details) font-bold text-center">
          Criar novo
        </p>
      </NuxtLink>
      <ItemStockCard
        v-for="value in produtos"
        :key="value._id"
        :name="value._titulo"
        :id="value._id"
        :image="`http://localhost:8081${value._imgCapa}`"
      />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.main_area_stock {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
  justify-items: center;
  row-gap: 1em;
  padding: 15px 0px;
  overflow-y: auto;
  overflow-x: unset;
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
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
