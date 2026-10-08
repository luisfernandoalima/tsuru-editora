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

const lotes = ref([]);
const estoque = ref(0);

const data = await api(`/product/find-product/${id}`, {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const produto = data.produto;
lotes.value = data.lotes;
estoque.value = data.quantidadeAtual;

const genero = listGeneros.find((item) => item.id == produto.genero)?.text;

const clasIndicativa = listClassificacoesIndicativas.find(
  (item) => item.id == produto.classIndicativa,
)?.text;

const spanFichaTecnica = ref(null);
const divFichaTecnica = ref(null);
const spanLote = ref(null);
const divLote = ref(null);

const showLote = () => {
  spanFichaTecnica.value.classList.remove("active");
  divFichaTecnica.value.classList.remove("active");

  spanLote.value.classList.add("active");
  divLote.value.classList.add("active");
};

const showFichaTecnca = () => {
  spanFichaTecnica.value.classList.add("active");
  divFichaTecnica.value.classList.add("active");

  spanLote.value.classList.remove("active");
  divLote.value.classList.remove("active");
};

onMounted(() => {
  spanFichaTecnica.value.classList.add("active");
  divFichaTecnica.value.classList.add("active");
});
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarProduto"
      :value="produtoBusca"
      @update:value="produtoBusca = $event"
    />
    <div class="main_area_product">
      <div class="product_main w-full">
        <BackButton class="back_button" />
        <div class="py-5">
          <img
            :src="`http://localhost:8081${produto.imgCapa}`"
            :alt="data.titulo"
          />
        </div>
        <div class="py-5">
          <div>
            <h1 class="text-5xl mb-4">{{ produto.titulo }}</h1>
            <h2 class="text-3xl">Autor: {{ produto.autor }}</h2>
            <p class="text-3xl mt-2 mb-2">Gênero: {{ genero }}</p>
          </div>
          <div>
            <p class="text-4xl">Valor:</p>
            <p class="text-6xl">R${{ produto.preco }}</p>
            <p class="text-2xl">
              Quantidade em estoque: {{ estoque }} unidades
            </p>
          </div>
        </div>
      </div>
      <div class="product_info py-5 px-3">
        <div>
          <h2 class="text-3xl font-bold mb-2">
            <span class="span" ref="spanFichaTecnica" @click="showFichaTecnca"
              >Ficha técnica</span
            >
            /
            <span class="span" ref="spanLote" @click="showLote">Lotes</span>
          </h2>
        </div>
        <div ref="divFichaTecnica" class="product_info_table">
          <table
            class="ficha_info_table table-fixed border-collapse border-gray-400 w-full"
          >
            <tbody>
              <tr>
                <td class="border border-gray-300 font-bold">ISBN</td>
                <td class="border border-gray-300">
                  {{ produto.isbn13 }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">Idioma</td>
                <td class="border border-gray-300">
                  {{ produto.idioma }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">
                  Classificação Indicativa
                </td>
                <td class="border border-gray-300">
                  {{ clasIndicativa }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">
                  Data de publicação
                </td>
                <td class="border border-gray-300">
                  {{ formatDate(produto.dataPublicacao) }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">
                  Número de páginas
                </td>
                <td class="border border-gray-300">
                  {{ produto.numPaginas }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">Série</td>
                <td class="border border-gray-300">
                  {{ produto.serie }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 font-bold">Volume</td>
                <td class="border border-gray-300">
                  {{ produto.volume }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="product_info_table" ref="divLote">
          <table
            class="lote_info_table table-fixed border-collapse border-gray-400 w-full"
          >
            <thead>
              <tr>
                <th>Código</th>
                <th>Qtd. Produzida</th>
                <th>Qtd. Atual</th>
                <th>Data de produção</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lote in lotes">
                <td>{{ lote.codigo }}</td>
                <td>{{ lote.quantidade_inicial }}</td>
                <td>{{ lote.quantidade_atual }}</td>
                <td>{{ formatDate(lote.data_producao) }}</td>
                <td>{{ lote.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.main_area_product {
  display: block;
}
.back_button {
  position: absolute;
  top: 10px;
  left: 10px;
}

.product_main {
  display: grid;
  position: relative;
  margin: 0px 0px 20px 0px;
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

.span {
  padding: 4px 6px;
  border-radius: 10px;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background-color: rgb(255, 213, 213);
  }

  &.active {
    color: #fff;
    background-color: var(--secondary);
  }
}

.product_info_table {
  display: none;

  &.active {
    display: block;
  }
}

.ficha_info_table {
  height: 250px;
  font-size: 1.2em;
  td:nth-child(1) {
    font-weight: bold;
  }
}

.lote_info_table {
  border: 2px solid #f1e4e4;
  td {
    text-align: center;
  }
  td:nth-child(1) {
    text-align: left;
  }
}

table {
  color: var(--main_text);

  td,
  th {
    border: 1px solid #99a1af;
  }

  td,
  th {
    padding: 2px 8px;
  }

  tr:nth-child(even) {
    background-color: #f1e4e4;
  }

  tr:nth-child(odd) {
    background-color: #fff;
  }
}
</style>
