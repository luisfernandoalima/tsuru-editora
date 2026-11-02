<script setup>
import Container from "~/components/layout/Container.vue";
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

// A API devolve diretamente a linha da query (colunas em snake_case)
const dados = computed(() => response.value.saida ?? null);

const saida = computed(() => {
  const s = dados.value;
  if (!s) return null;

  const endereco = [
    `${s.logradouro}, ${s.numero}`,
    s.bairro,
    `${s.cidade}/${s.estado}`,
    s.cep ? `CEP ${s.cep}` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return {
    id: s.id,
    data: s.data_saida,
    cupomFiscal: s.numero_cupom_fiscal,
    colaboradorNome: s.usuario_nome ?? "N/A",
    colaboradorEmail: s.usuario_email ?? "N/A",
    parceiroNome: s.parceiro_nome ?? "N/A",
    endereco,
    valorTotal: Number(s.valor_total) || 0,
    valorFinal: Number(s.valor_final) || 0,
    creditoUsado: Number(s.credito_usado) || 0,
    tipoPagamento: s.metodo_pagamento ?? "N/A",
  };
});

// itens: [{ lote_id, lote_codigo, produto, isbn, quantidade, subtotal }]
const produtos = computed(() =>
  (dados.value?.itens ?? []).map((item) => ({
    ...item,
    loteId: item.lote_id,
    loteCodigo: item.lote_codigo,
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
    <div class="order_main_page">
      <Container>
        <BackButton />
        <h1 class="text-4xl font-semibold mb-2">Detalhes da saída</h1>

        <!-- Estados de carregamento, erro e não encontrado -->
        <p v-if="status === 'pending'" class="feedback">Carregando...</p>

        <p v-else-if="error" class="feedback error">
          Não foi possível carregar a saída do cupom #{{ cupom }}.
        </p>

        <p v-else-if="!saida" class="feedback">
          Nenhuma saída encontrada para o cupom #{{ cupom }}.
        </p>

        <section v-else>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Cupom fiscal</span>
              <strong>#{{ saida.cupomFiscal ?? cupom }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Responsável</span>
              <strong>{{ saida.colaboradorNome }}</strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail do responsável</span>
              <strong>{{ saida.colaboradorEmail }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Data da saída</span>
              <strong>{{ formatDate(saida.data) }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Parceiro</span>
              <strong>{{ saida.parceiroNome }}</strong>
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
              <span class="label">Método de pagamento</span>
              <strong>{{ saida.tipoPagamento }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Valor total</span>
              <strong>{{ formatCurrency(saida.valorTotal) }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Crédito usado</span>
              <strong>{{ formatCurrency(saida.creditoUsado) }}</strong>
            </div>

            <div class="info-item">
              <span class="label">Valor final</span>
              <strong>{{ formatCurrency(saida.valorFinal) }}</strong>
            </div>
          </div>

          <div class="info-item mt-2">
            <span class="label">Endereço de Entrega:</span>
            <strong>{{ saida.endereco }}</strong>
          </div>
        </section>
      </Container>

      <Container v-if="saida" customClass="produtos_container">
        <h2>Produtos retirados</h2>

        <div class="produtos_area">
          <OperationCard :itens="produtos" />
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

.feedback {
  margin-top: 12px;
  color: #6b7280;
}

.feedback.error {
  color: #b91c1c;
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

.produtos_container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;

  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }
}

.produtos_area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 600px;
  overflow: auto;
}
</style>
