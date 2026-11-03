<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonButtons from "~/components/ui/forms/CommonButtons.vue";
import BackButton from "~/components/layout/BackButton.vue";
import Container from "~/components/layout/Container.vue";
import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const form = reactive({
  nome: "",
  descricao: "",
  data: "",
  status: "ativa",
});

const loading = ref(false);

const cadastrar = async () => {
  if (!form.nome.trim() || !form.data) {
    toast.error({
      title: "Erro!",
      message: "Preencha o nome e a data da campanha.",
    });
    return;
  }

  try {
    loading.value = true;

    const data = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
      data: form.data,
      status: form.status,
    };

    const response = await api("/campaign/new-campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    toast.success({ title: "Sucesso!", message: response.message });

    navigateTo("/campanhas");
  } catch (error) {
    toast.error({ title: "Erro!", message: error.message });
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cancelar = () => {
  navigateTo("/campanhas");
};
</script>

<template>
  <NuxtLayout>
    <div class="p-8">
      <!-- Cabeçalho -->
      <div class="mb-6 flex items-center gap-4">
        <BackButton />

        <div>
          <h1 class="text-2xl font-semibold text-[#751111]">Nova campanha</h1>

          <p class="text-sm text-gray-500">
            Cadastre uma nova campanha no sistema.
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
            <Icon
              icon="material-symbols:campaign-outline-rounded"
              class="text-2xl"
            />
          </div>

          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              Dados da campanha
            </h2>

            <p class="text-sm text-gray-500">
              Preencha as informações da campanha.
            </p>
          </div>
        </div>

        <!-- Formulário -->
        <form class="space-y-6" @submit.prevent="cadastrar">
          <!-- Nome -->
          <div>
            <CommonInput
              v-model="form.nome"
              text="Nome *"
              name="nome"
              type="text"
              placeholder="Nome da campanha"
              :maxlength="150"
            />
          </div>

          <!-- Data / Status -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CommonInput
              v-model="form.data"
              text="Data *"
              name="data"
              type="date"
            />

            <div class="flex flex-col gap-1">
              <label for="status" class="text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                id="status"
                v-model="form.status"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#751111]"
              >
                <option value="ativa">Ativa</option>
                <option value="encerrada">Encerrada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <!-- Descrição -->
          <div class="flex flex-col gap-1">
            <label for="descricao" class="text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              rows="4"
              maxlength="500"
              placeholder="Descreva a campanha (opcional)"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#751111]"
            />
          </div>

          <!-- Botões -->
          <div class="w-full flex justify-end mt-2">
            <CommonButtons />
          </div>
        </form>
      </Container>
    </div>
  </NuxtLayout>
</template>
