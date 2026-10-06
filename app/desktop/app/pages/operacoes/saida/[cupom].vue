<script setup>
import OperationCard from "~/components/ui/cards/OperationCard.vue";
import BackButton from "~/components/layout/BackButton.vue";
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();
const route = useRoute();
const api = useApi();
const cupom = route.params.cupom;

const {
  data: response,
  error,
  status,
} = await useAsyncData(`saida-${cupom}`, () =>
  api(`/outgoing/find-registration/${cupom}`, {
    method: "GET",
    headers: { authorization: `Bearer ${getToken()}` },
  }),
);

console.log(response);

// A API devolve { saida: { ..., itens }, user: { name, email } }
const dadosSaida = computed(() => response.value?.saida ?? {});
const user = computed(() => response.value?.user ?? {});

const saida = computed(() => {
  const s = dadosSaida.value;
  return {
    id: s.id,
    colaboradorNome: user.value.name ?? "N/A",
    colaboradorEmail: user.value.email ?? "N/A",
    data: s.data,
    valorTotal: Number(s.valorTotal) || 0,
    tipoPagamento: s.tipoPagamento ?? "N/A",
  };
});

// A rota nova já devolve os itens limpos, então só garantimos os números
const produtos = computed(() =>
  (dadosSaida.value.itens ?? []).map((item) => ({
    ...item,
    quantidade: Number(item.quantidade) || 0,
    subtotal: Number(item.subtotal) || 0,
  })),
);

const quantidadeTotal = computed(() =>
  produtos.value.reduce((total, item) => total + item.quantidade, 0),
);
</script>

<template>
  <NuxtLayout>
    <div class="page">
      <!-- Cabeçalho -->
      <div class="header">
        <div class="text-white">
          <BackButton />
          <h1>Detalhes da saída</h1>
          <p class="subtitle">Informações da movimentação de estoque</p>
        </div>

        <div class="badge">Cupom #{{ cupom }}</div>
      </div>

      <!-- Estados de carregamento e erro -->
      <p v-if="status === 'pending'" class="feedback">Carregando...</p>

      <p v-else-if="error" class="feedback error">
        Não foi possível carregar a saída do cupom #{{ cupom }}.
      </p>

      <template v-else>
        <!-- Informações da saída -->
        <section class="info-card">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID da saída</span>
              <strong>#{{ saida.id }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Responsável</span>
              <strong>{{ user.name }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Email</span>
              <strong>{{ saida.colaboradorEmail }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Data da saída</span>
              <strong>{{ formatDate(saida.data) }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Lotes/Produtos distintos</span>
              <strong>{{ produtos.length }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Quantidade total</span>
              <strong>{{ quantidadeTotal }} itens</strong>
            </div>

            <div class="info-item">
              <span class="label">Valor total</span>
              <strong>{{ formatCurrency(saida.valorTotal) }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Método de pagamento</span>
              <strong>{{ saida.tipoPagamento }}</strong>
            </div>
          </div>
        </section>

        <!-- Produtos -->
        <section>
          <div class="section-title">
            <h2>Produtos retirados</h2>
          </div>

          <div class="products-grid">
            <OperationCard :itens="produtos" />
          </div>
        </section>
      </template>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.page {
  min-height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

.header h1 {
  margin: 0;
  font-size: 30px;
  color: #fff;
}

.subtitle {
  margin-top: 6px;
  color: #bbbbbb;
}

.badge {
  background: #5b0606;
  color: white;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
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

.section-title {
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
</style>
