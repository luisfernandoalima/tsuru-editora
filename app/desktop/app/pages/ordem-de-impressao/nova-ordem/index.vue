<script setup>
import BackButton from "~/components/layout/BackButton.vue";
import Container from "~/components/layout/Container.vue";

import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonButtons from "~/components/ui/forms/CommonButtons.vue";

import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const token = getToken();

const orderName = ref("");
const dataCriacao = new Date();
const statusOrdem = "Pendente";

const salvarOrdem = async () => {
  try {
    const data = {
      nome: orderName.value,
      dataCriacao,
      statusOrdem,
    };

    console.log(data);

    const response = await api("/print-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    toast.success({ title: "Sucesso!", message: response });
  } catch (error) {}
};
</script>

<template>
  <NuxtLayout>
    <Container>
      <BackButton />
      <h1>NOVA ORDEM</h1>
      <form @submit.prevent="salvarOrdem">
        <CommonInput
          type="text"
          text="Nome da Ordem"
          placeholder="Insira o nome da Ordem"
          name="orderName"
          v-model="orderName"
        />
        <CommonButtons resetText="Limpar" submitText="Salvar" />
      </form>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h1 {
  margin: 10px 0px;
  font-size: 2em;
  font-weight: 600;
}
</style>
