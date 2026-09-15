<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";
import OrderProductCard from "~/components/ui/cards/OrderProductCard.vue";
import CommonButtons from "~/components/ui/forms/CommonButtons.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const route = useRoute();
const api = useApi();
const token = getToken();
const toast = useToast();

const id = route.params.id;
const ordem = ref({
  nome: "",
  id: "",
  criador: {
    _nome: "",
    _email: "",
  },
  totalObras: 0,
  totalUnidades: 0,
  statusOrdem: "",
  dataCriacao: null,
  dataFechamento: null,
  aprovador: null,
});

const pesquisa = ref();
const produtos = ref([]);
const orderItems = ref([]);

const consultarOrdem = async () => {
  try {
    const response = await api(`/print-order/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    ordem.value = response.ordem;
  } catch (error) {
    toast.error({ title: "Erro!", message: error.message });
  }
};

const consultarItens = async () => {
  try {
    const response = await api(`/print-order/list-items/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    console.log("RESPOSTA DOS ITENS:", response);

    orderItems.value = response.produtos;

    console.log(orderItems.value);
  } catch (error) {
    console.error("Erro ao buscar itens:", error);

    toast.error({
      title: "Erro!",
      message: error.message,
    });
  }
};

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

const adicionarProduto = (produto) => {
  const produtoExiste = orderItems.value.find(
    (item) => item.produto._id === produto._id,
  );

  if (produtoExiste) {
    produtoExiste.quantidade++;
  } else {
    orderItems.value.push({
      produto: produto,
      quantidade: 1,
    });
  }
};

const removerProduto = (id) => {
  orderItems.value = orderItems.value.filter((item) => item.produto._id !== id);
};

const salvarOrdem = async () => {
  console.log(id);
  console.log(orderItems.value);

  const response = await api("/print-order/save-products", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: {
      items: orderItems.value,
      orderId: id,
    },
  });
};

onMounted(() => {
  consultarOrdem();
  buscarProduto();
  consultarItens();
});
</script>

<template>
  <NuxtLayout>
    <div class="order_main_page">
      <Container>
        <h1 class="text-4xl font-semibold mb-2">{{ ordem.nome }}</h1>
        <section>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID da Ordem</span>
              <strong>#{{ ordem.id }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Nome do criador</span>
              <strong>{{ ordem.criador._nome }}</strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail do criador</span>
              <strong>{{ ordem.criador._email }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Total de Obras</span>
              <strong>{{ ordem.totalObras }} obras</strong>
            </div>

            <div class="info-item">
              <span class="label">Total de itens</span>
              <strong>{{ ordem.totalUnidades }} itens</strong>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <strong>{{ ordem.statusOrdem }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Data de criação</span>
              <strong>{{ formatDate(ordem.dataCriacao) }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Data de fechamento</span>
              <strong>{{
                formatDate(ordem.dataFechamento) || "Nenhuma"
              }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Aprovador</span>
              <strong>{{ ordem.aprovador || "Não Aprovado" }}</strong>
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
                @click="adicionarProduto(produto)"
              />
            </div>
          </div>
          <div class="obras_cadastradas">
            <h2>Obras Cadastradas</h2>
            <div class="flex flex-col gap-y-3">
              <OrderProductCard
                v-for="value in orderItems"
                :key="value.produto._id"
                :item="value"
                @remover="removerProduto"
              />
            </div>
            <button @click="salvarOrdem">Salvar</button>
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
