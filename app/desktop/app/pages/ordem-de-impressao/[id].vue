<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";
import OrderProductCard from "~/components/ui/cards/OrderProductCard.vue";
import Button from "~/components/ui/utils/Button.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const route = useRoute();
const router = useRouter();
const api = useApi();
const token = getToken();
const toast = useToast();

const id = route.params.id;
const ordem = ref({
  nome: "",
  id: "",
  criador: {
    nome: "",
    email: "",
  },
  totalObras: 0,
  totalUnidades: 0,
  statusOrdem: "",
  dataCriacao: null,
  dataAprovacao: null,
  dataFechamento: null,
  aprovador: {
    nome: null,
  },
});

const situacao = ref(ordem.statusOrdem);

const pesquisa = ref();
const produtos = ref([]);
const orderItems = ref([]);

const buscarProduto = async () => {
  if (ordem.value.statusOrdem == "ABERTA") {
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
  }
};

const consultarOrdem = async () => {
  try {
    const response = await api(`/print-order/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    ordem.value = response.ordem;
    buscarProduto();
    situacao.value =
      ordem.value.statusOrdem.charAt(0).toUpperCase() +
      ordem.value.statusOrdem.slice(1).toLowerCase();
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

const adicionarProduto = (produto) => {
  if (ordem.value.statusOrdem == "ABERTA") {
    const produtoExiste = orderItems.value.find(
      (item) => item.produto.id === produto.id,
    );

    if (produtoExiste) {
      produtoExiste.quantidade++;
    } else {
      orderItems.value.push({
        produto: produto,
        quantidade: 1,
      });
    }
  }
};

const removerProduto = (id) => {
  if (ordem.value.statusOrdem == "ABERTA") {
    orderItems.value = orderItems.value.filter(
      (item) => item.produto.id !== id,
    );
  }
};

const salvarOrdem = async () => {
  if (ordem.value.statusOrdem == "ABERTA") {
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

    toast.success({ title: "Sucesso!", message: "Os produtos foram salvos!" });
  }
};

const definirStatus = async (status) => {
  try {
    let response;
    if (status == "aprovada") {
      response = await api(`/print-order/approve/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } else if (status == "cancelada") {
      response = await api(`/print-order/reject/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } else if (status == "fechada") {
      response = await api(`/print-order/close/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    toast.success({ title: "Sucesso!", message: response.message });
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

onMounted(() => {
  consultarOrdem();
  consultarItens();
});
</script>

<template>
  <NuxtLayout>
    <div class="order_main_page">
      <Container>
        <h1 class="text-4xl font-semibold mb-2">{{ ordem.nome }}</h1>
        <div class="area_aprovacao" v-if="ordem.statusOrdem == 'ABERTA'">
          <Button
            text="CANCELAR"
            className="secondary"
            :width="50"
            :click="() => definirStatus('cancelada')"
          />
          <Button
            text="APROVAR"
            className="primary"
            :width="50"
            :click="() => definirStatus('aprovada')"
          />
        </div>
        <div class="area_fechamento" v-if="ordem.statusOrdem == 'APROVADA'">
          <Button
            text="FECHAR"
            className="primary"
            :width="100"
            :click="() => definirStatus('fechada')"
          />
        </div>
        <section>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID da Ordem</span>
              <strong>#{{ ordem.id }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Nome do criador</span>
              <strong>{{ ordem.criador.nome }}</strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail do criador</span>
              <strong>{{ ordem.criador.email }}</strong>
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
              <span class="label">Data de tramitação</span>
              <strong>{{
                ordem.dataAprovacao
                  ? formatDate(ordem.dataAprovacao)
                  : "Nenhuma"
              }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Tramitada por:</span>
              <strong>{{ ordem.aprovador?.nome || "Não Tramitada" }}</strong>
            </div>
            <div class="info-item" v-if="ordem.statusOrdem != 'CANCELADA'">
              <span class="label">Data de fechamento</span>
              <strong>{{
                ordem.dataFechamento
                  ? formatDate(ordem.dataFechamento)
                  : "Nenhuma"
              }}</strong>
            </div>
            <div class="info-item" v-if="ordem.statusOrdem != 'CANCELADA'">
              <span class="label">Fechada por:</span>
              <strong>{{ ordem.fechador?.nome || "Não Fechada" }}</strong>
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

            <div class="flex flex-col gap-3 search_obras">
              <img
                v-for="produto in produtos"
                :src="`http://localhost:8081${produto.imgCapa}`"
                :alt="produto.titulo"
                @click="adicionarProduto(produto)"
              />
            </div>
          </div>
          <div class="obras_cadastradas">
            <h2>Obras Cadastradas</h2>
            <div class="flex flex-col gap-y-3">
              <OrderProductCard
                v-for="value in orderItems"
                :key="value.produto.id"
                :item="value"
                @remover="removerProduto"
                :orderStatus="ordem.statusOrdem"
              />
            </div>
          </div>
        </div>
        <div
          class="button_area flex gap-2 w-[50%] self-end"
          v-if="ordem.statusOrdem == 'ABERTA'"
        >
          <Button
            text="CANCELAR"
            :width="50"
            :click="router.back"
            className="secondary"
          />
          <Button
            text="SALVAR"
            :width="50"
            :click="salvarOrdem"
            className="primary"
          />
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

.area_aprovacao,
.area_fechamento {
  position: absolute;
  display: flex;
  gap: 0px 15px;
  bottom: 15px;
  right: 15px;
}

.area_aprovacao {
  width: 400px;
}

.area_fechamento {
  width: 200px;
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
  flex: 100%;
  width: 100%;
  height: 100%;

  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }

  .obras_adicionadas {
    display: flex;
    flex-direction: column;
    height: max-content;
    flex: 1;
  }

  .search_obras {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    height: 500px;
    overflow: auto;
    img {
      display: block;
      width: 150px;
      height: 250px;
      cursor: pointer;
    }
  }
}

.obras_cadastradas {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 600px;
  overflow: auto;
}

.obras_container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}
</style>
