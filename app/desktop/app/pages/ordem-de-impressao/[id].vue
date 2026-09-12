<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const route = useRoute();
const api = useApi();
const token = getToken();

const id = route.params.id;

const pesquisa = ref();
const produtos = ref([]);
const orderItems = ref([]);

const buscarProduto = async () => {
  try {
    const response = await api(`/product/search?pesquisa=${pesquisa.value}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    produtos.value = response.produtos;
    console.log(produtos.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  buscarProduto();
});
</script>

<template>
  <NuxtLayout>
    <div class="order_main_page">
      <Container>
        <h1 class="text-4xl font-semibold mb-2">{{ id }}</h1>
        <section>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID da Ordem</span>
              <strong>#</strong>
            </div>

            <div class="info-item">
              <span class="label">Nome do criador</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail do criador</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">Total de Obras</span>
              <strong> obras</strong>
            </div>

            <div class="info-item">
              <span class="label">Total de itens</span>
              <strong> itens</strong>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <strong></strong>
            </div>
            <div class="info-item">
              <span class="label">Data de criação</span>
              <strong></strong>
            </div>
            <div class="info-item">
              <span class="label">Data de fechamento</span>
              <strong>R$</strong>
            </div>
            <div class="info-item">
              <span class="label">Aprovador</span>
              <strong></strong>
            </div>
          </div>
        </section>
      </Container>
      <Container customClass="obras_container">
        <div class="obras_area">
          <div class="obras_adicionadas">
            <h2>Obras para Impressão</h2>

            <SearchBar
              placeholder="Insira o título ou ISBN do produto"
              :handleForms="buscarProduto"
              :value="pesquisa"
              @update:value="pesquisa = $event"
            />

            <div class="flex gap-3 search_obras">
              <img
                v-for="produto in produtos"
                :src="`http://localhost:8081${produto._imgCapa}`"
                :alt="produto._titulo"
              />
            </div>
          </div>
          <div class="obras_cadastradas">
            <h2>Obras Cadastradas</h2>
          </div>
        </div>
      </Container>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.order_main_page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #6b7280;
}

.info-item strong {
  color: #111827;
  font-size: 16px;
}

.obras_area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  flex: 1;
  width: 100%;

  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }

  .search_obras {
    display: flex;
    flex: 1;
    overflow: auto;
    img {
      width: 150px;
      cursor: pointer;
    }
  }
}

.obras_container {
  display: flex;
  gap: 1rem;
  flex: 1;
}
</style>
