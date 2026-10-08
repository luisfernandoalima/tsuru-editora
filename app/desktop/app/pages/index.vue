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

const pesquisa = ref("");

const produtos = ref([]);

const atualizarRota = () => {
  router.push({
    path: "/",
    query: {
      pesquisa: pesquisa.value,
    },
  });
};

const carregarProdutos = async () => {
  const response = await api(`/product/search?pesquisa=${pesquisa.value}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  produtos.value = response.produtos;
};

const calcularEstoque = (produto) => {
  if (produto.estoque === 0) {
    return "Em Falta";
  }

  if (produto.estoque <= produto.estoqueMinimo) {
    return "Baixo";
  }

  return "Em Estoque";
};

watch(
  () => route.query.pesquisa,
  (novaPesquisa) => {
    pesquisa.value = String(novaPesquisa || "");
    carregarProdutos();
  },
);

onMounted(() => {
  pesquisa.value = String(route.query.pesquisa || "");
  carregarProdutos();
});
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="atualizarRota"
      :value="pesquisa"
      @update:value="pesquisa = $event"
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
        v-for="produto in produtos"
        :key="produto.id"
        :name="produto.titulo"
        :link="`/produto/${produto.id}`"
        :image="`http://localhost:8081${produto.imgCapa}`"
        :statusItem="calcularEstoque(produto)"
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
