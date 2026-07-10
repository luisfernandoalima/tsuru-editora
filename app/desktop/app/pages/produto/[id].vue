<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";

import BackButton from "~/components/layout/BackButton.vue";
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

const produtoBusca = ref("");
const buscarProduto = () => {
  router.push(`/?produto=${produtoBusca.value}`);
};

const id = route.params.id;

const data = await api(`/product/find-product/${id}`, {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const produto = data.produto;
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarProduto"
      :value="produtoBusca"
      @update:value="produtoBusca = $event"
    />
    <BackButton />
    <div class="main_area_product">
      <div class="product_main w-full">
        <div class="py-5">
          <img
            :src="`http://localhost:8081${produto._imgCapa}`"
            :alt="data.titulo"
          />
        </div>
        <div class="py-5">
          <div>
            <h1 class="text-5xl mb-4">{{ produto._titulo }}</h1>
            <h2 class="text-3xl">Autor: {{ produto._autor }}</h2>
            <p class="text-3xl mt-2 mb-2">Gênero: {{ produto._genero }}</p>
          </div>
          <div>
            <p class="text-4xl">Valor:</p>
            <p class="text-6xl">R${{ produto._preco }}</p>
            <p class="text-2xl">
              Quantidade em estoque: {{ produto._estoque }}
            </p>
          </div>
        </div>
      </div>
      <div class="product_info py-5 px-3">
        <p class="text-3xl font-bold mb-2">Ficha técnica</p>
        <table class="table-fixed border-collapse border-gray-400 w-full">
          <tbody>
            <tr>
              <td class="border border-gray-300 font-bold">ISBN</td>
              <td class="border border-gray-300">
                {{ produto._isbn13 }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">Idioma</td>
              <td class="border border-gray-300">
                {{ produto._idioma }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">
                Classificação Indicativa
              </td>
              <td class="border border-gray-300">
                {{ produto._classIndicativa }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">
                Data de publicação
              </td>
              <td class="border border-gray-300">
                {{ formatDate(produto._dataPublicacao) }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">
                Número de páginas
              </td>
              <td class="border border-gray-300">
                {{ produto._numPaginas }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">Série</td>
              <td class="border border-gray-300">
                {{ produto._serie }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 font-bold">Volume</td>
              <td class="border border-gray-300">
                {{ produto._volume }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.main_area_product {
  display: block;
}

.product_main {
  margin: 20px 0px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  color: var(--main_text);
  font-weight: bold;
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
}

img {
  display: block;
  width: auto;
  height: 600px;
  align-self: center;
  justify-self: center;
}

.product_info {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
}

table {
  color: var(--main_text);
  height: 250px;

  td {
    padding: 2px 8px;
    font-size: 1.2em;
  }

  tr:nth-child(even) {
    background-color: #f1e4e4; /* rosado bem claro */
  }

  tr:nth-child(odd) {
    background-color: #fff; /* rosado um pouco mais forte */
  }

  td:nth-child(1) {
    font-weight: bold;
  }
}
</style>
