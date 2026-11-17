<script setup>
import { Icon } from "@iconify/vue";

import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const devolucoes = ref([]);
const expandidas = ref(new Set());
const carregando = ref(true);

const formatarData = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "-";

const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const totalUnidades = (devolucao) =>
  devolucao.lotes.reduce((soma, l) => soma + Number(l.quantidade), 0);

const alternar = (id) => {
  const novo = new Set(expandidas.value);
  novo.has(id) ? novo.delete(id) : novo.add(id);
  expandidas.value = novo;
};

const carregarDevolucoes = async () => {
  try {
    const response = await api("/return/list", {
      method: "GET",
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });

    devolucoes.value = response.devolucoes ?? [];
  } catch (error) {
    toast.error({
      title: "Erro",
      message: "Não foi possível buscar as devoluções",
    });
    console.log(error);
  } finally {
    carregando.value = false;
  }
};

onMounted(carregarDevolucoes);
</script>

<template>
  <NuxtLayout>
    <SearchBar />
    <div class="flex justify-end">
      <NuxtLink to="/devolucao/nova-devolucao" class="new_info">
        <Icon icon="akar-icons:plus" class="inline" /> Nova Devolução
      </NuxtLink>
    </div>

    <Container>
      <p v-if="carregando" class="feedback">Carregando...</p>

      <p v-else-if="!devolucoes.length" class="feedback">
        Nenhuma devolução registrada ainda.
      </p>

      <div v-else class="tabela_wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th></th>
              <th>#</th>
              <th>Data</th>
              <th>Parceiro (CNPJ)</th>
              <th>Motivo</th>
              <th>Unidades</th>
              <th>Crédito original</th>
              <th>Crédito atual</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in devolucoes" :key="item.id">
              <tr class="linha" @click="alternar(item.id)">
                <td>
                  <Icon
                    :icon="
                      expandidas.has(item.id)
                        ? 'akar-icons:chevron-down'
                        : 'akar-icons:chevron-right'
                    "
                  />
                </td>
                <td>{{ item.id }}</td>
                <td>{{ formatarData(item.data_devolucao) }}</td>
                <td>{{ item.cnpj }}</td>
                <td>{{ item.motivo }}</td>
                <td>{{ totalUnidades(item) }}</td>
                <td>{{ formatarMoeda(item.valor_original) }}</td>
                <td>{{ formatarMoeda(item.valor_atual) }}</td>
              </tr>

              <tr v-if="expandidas.has(item.id)" class="detalhe">
                <td></td>
                <td colspan="7">
                  <p v-if="!item.lotes.length" class="feedback">
                    Nenhum lote nesta devolução.
                  </p>

                  <table v-else class="tabela_interna">
                    <thead>
                      <tr>
                        <th>Lote</th>
                        <th>Quantidade devolvida</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="lote in item.lotes"
                        :key="lote.devolucao_lote_id"
                      >
                        <td>{{ lote.codigo }}</td>
                        <td>{{ lote.quantidade }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.feedback {
  color: #6b7280;
}

.new_info {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 1px 6px;
  margin-bottom: 15px;
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

.linha {
  cursor: pointer;
}

.linha:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.detalhe td {
  background-color: rgba(0, 0, 0, 0.02);
}

.tabela_interna {
  width: 100%;
  border-collapse: collapse;
}

.tabela_interna th,
.tabela_interna td {
  text-align: left;
  padding: 6px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.9rem;
}
</style>
