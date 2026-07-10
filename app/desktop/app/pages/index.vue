<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import ItemCard from "~/components/layout/ItemCard.vue";
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  middleware: "auth",
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
  router.push(`/?produto=${produto.value}`);
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
    />

    <div class="main_area">
      <ItemCard
        v-for="value in produtos"
        :key="value._id"
        :name="value._titulo"
        :link="`/produto/${value._id}`"
        :image="`http://localhost:8081${value._imgCapa}`"
        statusItem="Baixo"
      />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.main_area {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
  justify-items: center;
  row-gap: 1em;
  padding: 50px 0px;
  overflow-y: auto;
  overflow-x: unset;
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
}
</style>
