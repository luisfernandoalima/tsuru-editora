<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import { Icon } from "@iconify/vue";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const { getToken } = useAuthToken();

const route = useRoute();
const router = useRouter();

const api = useApi();
const token = getToken();

const colaborador = ref(route.query.nome ?? "");

const colaboradores = ref([]);

const buscarColaboradores = () => {
  router.push(`/colaborador?nome=${colaborador.value}`);
};

const carregarColaboradores = async () => {
  const nomeColaborador = colaborador.value;

  let response;

  if (!nomeColaborador) {
    response = await api("/user/list-users", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } else {
    response = await api(`/user/list-by-name/${nomeColaborador}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  colaboradores.value = response.users;

  console.log(colaboradores.value);
  console.log(colaboradores);
};

watch(
  () => route.query.nome,
  () => {
    carregarColaboradores();
  },
  { immediate: true },
);
</script>

<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarColaboradores"
      :value="colaborador"
      @update:value="colaborador = $event"
    />

    <div class="button_area">
      <NuxtLink to="/colaborador/novo-colaborador"
        >+ Cadastrar novo funcionário</NuxtLink
      >
    </div>

    <div class="table_area">
      <table
        class="table-auto border-collapse border border-gray-400 text-white"
      >
        <thead>
          <tr>
            <th class="border border-gray-300">Nome</th>
            <th class="border border-gray-300">E-mail</th>
            <th class="border border-gray-300">Telefone</th>
            <th class="border border-gray-300">Editar</th>
            <th class="border border-gray-300">Excluir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in colaboradores">
            <td class="border border-gray-300">{{ value.nome }}</td>
            <td class="border border-gray-300">{{ value.email }}</td>
            <td class="border border-gray-300">{{ value.telefone }}</td>
            <td class="border border-gray-300">
              <NuxtLink
                class="flex justify-center"
                :to="`/colaborador/atualizar/${value.id}`"
                ><Icon icon="jam:write-f" width="24" height="24"
              /></NuxtLink>
            </td>
            <td class="border border-gray-300 text-center">
              <NuxtLink
                class="flex justify-center"
                :to="`/colaborador/excluir/${value.id}`"
                ><Icon icon="tabler:trash" width="24" height="24"
              /></NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  width: 100%;
  max-height: 700px;
  overflow-y: auto;

  table {
    background-color: #fff;
    color: black;
    width: 100%;
    overflow: auto;

    td {
      padding-left: 4px;
    }
  }
}
</style>
