<script setup>
import { Icon } from "@iconify/vue";

import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const route = useRoute();
const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const lotes = ref([]);
const selecionados = ref([]);
const carregando = ref(true);
const salvando = ref(false);

const formatarData = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "-";

const todosSelecionados = computed(
  () =>
    lotes.value.length > 0 && selecionados.value.length === lotes.value.length,
);

const totalUnidades = computed(() =>
  lotes.value
    .filter((l) => selecionados.value.includes(l.devolucao_lote_id))
    .reduce((soma, l) => soma + Number(l.quantidade), 0),
);

const alternarTodos = () => {
  selecionados.value = todosSelecionados.value
    ? []
    : lotes.value.map((l) => l.devolucao_lote_id);
};

const carregarLotes = async () => {
  try {
    const response = await api("/campaign/lotes-disponiveis", {
      method: "GET",
      headers: { authorization: `Bearer ${getToken()}` },
    });

    lotes.value = response.lotes ?? [];
  } catch (error) {
    toast.error({
      title: "Erro",
      message: "Não foi possível buscar os lotes disponíveis",
    });
    console.log(error);
  } finally {
    carregando.value = false;
  }
};

const salvar = async () => {
  if (!selecionados.value.length || salvando.value) return;

  salvando.value = true;
  try {
    await api(`/campaign/${route.params.id}/lotes`, {
      method: "POST",
      headers: { authorization: `Bearer ${getToken()}` },
      body: { devolucaoLoteIds: selecionados.value },
    });

    toast.success({
      title: "Sucesso",
      message: "Lotes vinculados à campanha",
    });

    await navigateTo(`/campanhas/${route.params.id}`);
  } catch (error) {
    toast.error({
      title: "Erro",
      message: error?.data?.message ?? "Não foi possível vincular os lotes",
    });
    console.log(error);

    // Pode ser conflito (lote já vinculado): recarrega a lista
    selecionados.value = [];
    await carregarLotes();
  } finally {
    salvando.value = false;
  }
};

onMounted(carregarLotes);
</script>

<template>
  <NuxtLayout>
    <SearchBar />

    <div class="flex justify-between">
      <NuxtLink :to="`/campanhas/`" class="back_link">
        <Icon icon="akar-icons:arrow-left" class="inline" /> Voltar
      </NuxtLink>

      <button
        type="button"
        class="save_btn"
        :disabled="!selecionados.length || salvando"
        @click="salvar"
      >
        {{ salvando ? "Salvando..." : "Salvar" }}
      </button>
    </div>

    <Container>
      <h1 class="titulo">Cadastrar lotes devolvidos na campanha</h1>
      <p class="descricao">
        Estes são os lotes devolvidos que ainda não estão vinculados a nenhuma
        campanha.
      </p>

      <p v-if="carregando" class="feedback">Carregando...</p>

      <p v-else-if="!lotes.length" class="feedback">
        Não há lotes devolvidos disponíveis.
      </p>

      <template v-else>
        <p class="resumo">
          {{ selecionados.length }} lote(s) selecionado(s) ·
          {{ totalUnidades }} unidade(s)
        </p>

        <div class="tabela_wrapper">
          <table class="tabela">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    :checked="todosSelecionados"
                    @change="alternarTodos"
                  />
                </th>
                <th>Lote</th>
                <th>Quantidade</th>
                <th>Data da devolução</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lotes" :key="item.devolucao_lote_id">
                <td>
                  <input
                    v-model="selecionados"
                    type="checkbox"
                    :value="item.devolucao_lote_id"
                  />
                </td>
                <td>#{{ item.lote_id }}</td>
                <td>{{ item.quantidade }}</td>
                <td>{{ formatarData(item.data_devolucao) }}</td>
                <td>{{ item.motivo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.feedback {
  color: #6b7280;
}

.back_link {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 1px 6px;
  margin-bottom: 15px;
}

.save_btn {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 1px 14px;
  margin-bottom: 15px;
}

.save_btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.titulo {
  font-size: 1.5rem;
  font-weight: 600;
}

.descricao {
  color: #6b7280;
  margin: 6px 0 16px;
}

.resumo {
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.tabela_wrapper {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela th,
.tabela td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.tabela th {
  font-size: 0.85rem;
  color: #6b7280;
}
</style>
