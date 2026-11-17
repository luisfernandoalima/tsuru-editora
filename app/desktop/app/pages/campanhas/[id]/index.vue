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

const campanha = ref(null);
const lotes = ref([]);
const totalUnidades = ref(0);
const carregando = ref(true);

const formatarData = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "-";

const carregarDetalhes = async () => {
  try {
    const response = await api(`/campaign/${route.params.id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });

    campanha.value = response.campanha;
    lotes.value = response.lotes ?? [];
    totalUnidades.value = response.totalUnidades ?? 0;
  } catch (error) {
    toast.error({
      title: "Erro",
      message: "Não foi possível buscar os detalhes da campanha",
    });
    console.log(error);
  } finally {
    carregando.value = false;
  }
};

onMounted(carregarDetalhes);
</script>

<template>
  <NuxtLayout>
    <SearchBar />

    <div class="flex justify-start">
      <NuxtLink to="/campanhas" class="back_link">
        <Icon icon="akar-icons:arrow-left" class="inline" /> Voltar
      </NuxtLink>
    </div>

    <Container>
      <p v-if="carregando" class="feedback">Carregando...</p>

      <p v-else-if="!campanha" class="feedback">Campanha não encontrada.</p>

      <template v-else>
        <section class="detalhes">
          <h1 class="titulo">{{ campanha.nome }}</h1>
          <p class="descricao">
            {{ campanha.descricao || "Sem descrição." }}
          </p>

          <div class="infos">
            <div>
              <span class="label">Data</span>
              <span>{{ formatarData(campanha.data) }}</span>
            </div>
            <div>
              <span class="label">Status</span>
              <span>{{ campanha.status }}</span>
            </div>
            <div>
              <span class="label">Unidades destinadas</span>
              <span>{{ totalUnidades }}</span>
            </div>
          </div>
        </section>

        <section class="lotes">
          <h2 class="subtitulo">Lotes devolvidos destinados à campanha</h2>

          <p v-if="!lotes.length" class="feedback">
            Nenhum lote devolvido foi destinado a esta campanha ainda.
          </p>

          <div v-else class="tabela_wrapper">
            <table class="tabela">
              <thead>
                <tr>
                  <th>Lote</th>
                  <th>Quantidade</th>
                  <th>Data da devolução</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lotes" :key="item.doacao_lote_id">
                  <td>#{{ item.lote_id }}</td>
                  <td>{{ item.quantidade }}</td>
                  <td>{{ formatarData(item.data_devolucao) }}</td>
                  <td>{{ item.motivo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
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

.detalhes {
  margin-bottom: 30px;
}

.titulo {
  font-size: 1.5rem;
  font-weight: 600;
}

.descricao {
  color: #6b7280;
  margin: 6px 0 16px;
}

.infos {
  display: flex;
  gap: 40px;
}

.infos > div {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8rem;
  color: #6b7280;
}

.subtitulo {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
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
