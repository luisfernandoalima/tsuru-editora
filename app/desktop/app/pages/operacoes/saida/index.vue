<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";
import { Icon } from "@iconify/vue";
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const route = useRoute();
const router = useRouter();

const api = useApi();
const token = getToken();

const cupom = ref(route.query.cupom ?? "");

const saidas = ref([]);

const buscarSaidas = () => {
  router.push(`/operacoes/saida?cupom=${cupom.value}`);
};

const carregaSaidas = async () => {
  const cupomSaida = cupom.value;

  let response;

  if (!cupomSaida) {
    response = await api("/outgoing/list-registration", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } else {
    response = await api(`/outgoing/list-registration-cupom/${cupomSaida}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  saidas.value = response.saidas;
  console.log(saidas.value);
  console.log(saidas);
};

watch(
  () => route.query.cupom,
  () => {
    carregaSaidas();
  },
  { immediate: true },
);
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarSaidas"
      :value="cupom"
      @update:value="cupom = $event"
    />

    <div class="button_area">
      <NuxtLink to="/operacoes/saida/nova-saida"
        >+ Cadastrar nova saída</NuxtLink
      >
    </div>

    <Container customClass="table_area">
      <table
        class="table-auto border-collapse border border-gray-400 text-white"
      >
        <thead>
          <tr>
            <th class="border border-gray-300">Nº Cupom Fiscal</th>
            <th class="border border-gray-300">Data</th>
            <th class="border border-gray-300">Valor Final</th>
            <th class="border border-gray-300">Método de Pagamento</th>
            <th class="border border-gray-300">Ver</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in saidas">
            <td class="border border-gray-300">
              {{ value.numero_cupom_fiscal }}
            </td>
            <td class="border border-gray-300">
              {{ formatDate(value.data_saida) }}
            </td>
            <td class="border border-gray-300">{{ value.valor_final }}</td>
            <td class="border border-gray-300">{{ value.metodo_pagamento }}</td>
            <td class="border border-gray-300">
              <NuxtLink
                class="flex justify-center"
                :to="`/operacoes/saida/${value.numero_cupom_fiscal}`"
                ><Icon icon="mdi:eye" width="24" height="24"
              /></NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.button_area {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;

  a {
    background-color: #fff;
    padding: 3px 8px;
    border-radius: 10px;
  }
}

.table_area {
  flex: 1;
  width: 100%;
  overflow-y: auto;

  table {
    color: #000;
    width: 100%;
    overflow: auto;

    td {
      padding-left: 4px;
      text-align: center;
    }
  }
}
</style>
