<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonButtons from "~/components/ui/forms/CommonButtons.vue";
import BackButton from "~/components/layout/BackButton.vue";
import Container from "~/components/layout/Container.vue";
import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();
const route = useRoute();

const token = getToken();

const partnerId = route.params.parceiro;

const form = reactive({
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  ativo: true,
});

const loading = ref(false);
const fetching = ref(true);

// Busca os dados do parceiro pelo id da rota
const buscarParceiro = async () => {
  try {
    fetching.value = true;

    let response = await api(`/partner/view/${partnerId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // Ajuste os nomes dos campos aqui conforme o formato que a API retorna
    form.nome = response.parceiro.nome;
    form.cnpj = response.parceiro.cnpj;
    form.email = response.parceiro.email;
    form.telefone = response.parceiro.contato;
    form.ativo = response.parceiro.ativo;
  } catch (error) {
    toast.error({
      title: "Erro!",
      message: "Não foi possível carregar os dados do parceiro.",
    });
    console.error(error);
    navigateTo("/parceiros");
  } finally {
    fetching.value = false;
  }
};

const atualizar = async () => {
  try {
    loading.value = true;

    const data = {
      nome: form.nome,
      cnpj: form.cnpj,
      email: form.email,
      contato: form.telefone,
      ativo: form.ativo,
    };

    let responseAlter = await api(`/partner/edit/${partnerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    toast.success({ title: "Sucesso!", message: responseAlter.message });
  } catch (error) {
    toast.error({ title: "Erro!", message: error.message });
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const cancelar = () => {
  navigateTo("/parceiros");
};

onMounted(() => {
  buscarParceiro();
});
</script>

<template>
  <NuxtLayout>
    <div class="p-8">
      <!-- Cabeçalho -->
      <div class="mb-6 flex items-center gap-4">
        <BackButton />

        <div>
          <h1 class="text-2xl font-semibold text-[#751111]">Editar parceiro</h1>

          <p class="text-sm text-gray-500">
            Atualize os dados do parceiro selecionado.
          </p>
        </div>
      </div>

      <!-- Card -->
      <Container>
        <!-- Título -->
        <div class="mb-8 flex items-center gap-3 border-b border-gray-200 pb-5">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-lg bg-[#751111]/10 text-[#751111]"
          >
            <Icon icon="mdi:store-outline" class="text-2xl" />
          </div>

          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              Dados do parceiro
            </h2>

            <p class="text-sm text-gray-500">
              Altere as informações necessárias.
            </p>
          </div>
        </div>

        <!-- Loading enquanto busca os dados -->
        <div
          v-if="fetching"
          class="flex items-center justify-center py-16 text-gray-500"
        >
          <Icon icon="mdi:loading" class="text-3xl animate-spin" />
        </div>

        <!-- Formulário -->
        <form v-else class="space-y-6" @submit.prevent="atualizar">
          <!-- Nome -->
          <div>
            <CommonInput
              v-model="form.nome"
              text="Nome *"
              name="nome"
              type="text"
              placeholder="Nome do parceiro"
              :maxlength="150"
            />
          </div>

          <!-- CNPJ / Telefone -->
          <div class="grid grid-cols-1 md:grid-cols-2">
            <CommonInput
              v-model="form.cnpj"
              text="CNPJ *"
              name="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              mask="##.###.###/####-##"
              :maxlength="18"
            />

            <CommonInput
              v-model="form.telefone"
              text="Telefone"
              name="telefone"
              type="text"
              placeholder="(00) 00000-0000"
              mask="(##) #####-####"
              :maxlength="20"
            />
          </div>

          <!-- Email -->
          <CommonInput
            v-model="form.email"
            text="E-mail"
            name="email"
            type="email"
            placeholder="contato@empresa.com"
            :maxlength="150"
          />

          <!-- Botões -->
          <div class="w-full flex justify-end mt-2">
            <CommonButtons @cancel="cancelar" :loading="loading" />
          </div>
        </form>
      </Container>
    </div>
  </NuxtLayout>
</template>
