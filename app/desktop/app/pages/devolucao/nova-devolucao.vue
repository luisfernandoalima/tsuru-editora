<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";
import Select from "~/components/ui/forms/Select.vue";
import LoteDevolucaoCard from "~/components/ui/cards/LoteDevolucao.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();
const api = useApi();
const toast = useToast();

const parceiroPesquisa = ref("");
const empresas = ref([]);
const parceiroSelecionado = ref(null);

const cupons = ref([]); // [{ value: saida.id, label: numero_cupom_fiscal }]
const cupomEscolhido = ref(null);
const lotes = ref([]);
const motivo = ref("");
const salvando = ref(false);
const quantidades = reactive({});

const headers = () => ({ authorization: `Bearer ${getToken()}` });

const pesquisarParceiros = async () => {
  try {
    const response = await api(
      `/partner/search?pesquisa=${encodeURIComponent(parceiroPesquisa.value)}`,
      { method: "GET", headers: headers() },
    );

    empresas.value = response.parceiros ?? [];
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

const selecionarParceiro = async (empresa) => {
  parceiroSelecionado.value = empresa;
  cupomEscolhido.value = null;
  lotes.value = [];
  cupons.value = [];

  try {
    const response = await api(`/list-by-partner/${empresa.id}`, {
      method: "GET",
      headers: headers(),
    });

    cupons.value = (response.saidas ?? []).map((s) => ({
      id: s.id,
      text: `${s.numero_cupom_fiscal} - ${formatDate(s.data_saida)}`,
    }));
    console.log("cupons:", cupons.value);
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

const carregarLotes = async (saidaId) => {
  lotes.value = [];
  if (!saidaId) return;

  try {
    const response = await api(`/by-outgoing/${saidaId}`, {
      method: "GET",
      headers: headers(),
    });

    lotes.value = response.lotes ?? [];
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

watch(lotes, () => {
  Object.keys(quantidades).forEach((k) => delete quantidades[k]);
});

const itensDevolucao = computed(() =>
  lotes.value
    .filter((l) => (quantidades[l.id] ?? 0) > 0)
    .map((l) => ({ loteId: l.id, quantidade: quantidades[l.id] })),
);

const totalDevolvido = computed(() =>
  lotes.value.reduce((total, l) => {
    const qtd = quantidades[l.id] ?? 0;
    const unitario = Number(l.quantidade_saida)
      ? Number(l.subtotal) / Number(l.quantidade_saida)
      : 0;
    return total + qtd * unitario;
  }, 0),
);

const creditoGerado = computed(
  () => Math.round(totalDevolvido.value * 0.05 * 100) / 100,
);

const salvarDevolucao = async () => {
  if (!cupomEscolhido.value) {
    toast.error({ title: "Erro!", message: "Escolha um cupom fiscal." });
    return;
  }

  if (!itensDevolucao.value.length) {
    toast.error({
      title: "Erro!",
      message: "Informe a quantidade de ao menos um lote.",
    });
    return;
  }

  try {
    salvando.value = true;

    const response = await api("/return/new-return", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers(),
      },
      body: JSON.stringify({
        saidaId: Number(cupomEscolhido.value),
        motivo: motivo.value.trim(),
        itens: itensDevolucao.value,
      }),
    });

    toast.success({ title: "Sucesso!", message: response.message });

    // Recarrega os lotes para refletir o que já foi devolvido
    Object.keys(quantidades).forEach((k) => delete quantidades[k]);
    motivo.value = "";
    await carregarLotes(cupomEscolhido.value);
  } catch (error) {
    console.error(error);
    toast.error({ title: "Erro!", message: error.message });
  } finally {
    salvando.value = false;
  }
};
watch(cupomEscolhido, carregarLotes);

onMounted(pesquisarParceiros);
</script>

<template>
  <NuxtLayout>
    <div class="order_main_page">
      <Container>
        <div class="parceiros_div">
          <div class="lista__parceiros">
            <SearchBar
              placeholder="Insira o CNPJ ou nome do Parceiro"
              :handleForms="pesquisarParceiros"
              :value="parceiroPesquisa"
              @update:value="parceiroPesquisa = $event"
            />
            <div class="lista__parceiros__div">
              <ul class="lista__itens">
                <li
                  v-for="empresa in empresas"
                  :key="empresa.id"
                  class="item"
                  :class="{
                    'item--ativo': parceiroSelecionado?.id === empresa.id,
                  }"
                  @click="selecionarParceiro(empresa)"
                >
                  <div class="item__avatar" aria-hidden="true">
                    {{ empresa.nome?.[0] }}
                  </div>
                  <div class="item__texto">
                    <p class="item__nome">{{ empresa.nome }}</p>
                    <p class="item__cnpj">{{ empresa.cnpj }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="form__parceiros__div">
            <Select
              text="Número do Cupom Fiscal:"
              name="cupomFiscal"
              :options="cupons"
              placeholder="Escolha o número do Cupom Fiscal"
              v-model="cupomEscolhido"
            />
            <div class="campo_motivo">
              <label for="motivo">Motivo da devolução *</label>
              <input
                id="motivo"
                v-model="motivo"
                type="text"
                maxlength="255"
                placeholder="Ex.: produto com defeito"
              />
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <h2 class="titulo_lotes">Lotes da saída</h2>

        <p v-if="!cupomEscolhido" class="feedback">
          Escolha um parceiro e um cupom fiscal para ver os lotes.
        </p>
        <p v-else-if="!lotes.length" class="feedback">
          Nenhum lote encontrado nessa saída.
        </p>

        <template v-else>
          <section class="lotes_grid">
            <LoteDevolucaoCard
              v-for="lote in lotes"
              :key="lote.id"
              :lote="lote"
              v-model="quantidades[lote.id]"
            />
          </section>

          <div class="rodape_devolucao">
            <p>
              Total a devolver:
              <strong>{{ formatCurrency(totalDevolvido) }}</strong>
            </p>
            <p>
              Crédito gerado (5%):
              <strong>{{ formatCurrency(creditoGerado) }}</strong>
            </p>
            <button
              type="button"
              class="btn_salvar"
              :disabled="salvando || !itensDevolucao.length"
              @click="salvarDevolucao"
            >
              {{ salvando ? "Salvando..." : "Salvar devolução" }}
            </button>
          </div>
        </template>
      </Container>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.lista__parceiros {
  display: flex;
  flex-direction: column;
}

.lista__parceiros__div {
  height: 100%;
  overflow: auto;
}

.parceiros_div {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  height: 100%;
}

.lista__itens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100px;
  width: 100%;

  li {
    width: 98%;
  }
}

.item {
  display: grid;
  grid-template-columns: 12% 88%;
  gap: 0px 10px;
  padding: 3px;
  border: 2px solid #000;
  border-radius: 8px;
  background-color: var(--main);
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: rgb(211, 211, 211);
  }

  .item__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--main);
    background-color: var(--secondary);
    border-radius: 8px;
    font-size: 1.8em;
    font-weight: bold;
  }

  .item__nome {
    font-size: 1.4em;
    font-weight: 600;
  }
}

.order_main_page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.item--ativo {
  background-color: rgb(211, 211, 211);
}

.titulo_lotes {
  font-size: 1.3em;
  font-weight: 700;
  margin-bottom: 12px;
}

.feedback {
  color: #6b7280;
}

.lista_lotes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lote {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.campo_motivo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
}

.campo_motivo input {
  border: 3px solid var(--details);
  border-radius: 10px;
  padding: 5px;
}
.lotes_grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
