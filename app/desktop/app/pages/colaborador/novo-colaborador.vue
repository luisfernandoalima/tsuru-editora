<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonSelect from "~/components/ui/forms/CommonSelect.vue";
import BackButton from "~/components/layout/BackButton.vue";
import Container from "~/components/layout/Container.vue";

import { useApi } from "~/composables/useApi";
import { useToast } from "#imports";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const token = getToken();

const cpf = ref("");
const name = ref("");
const email = ref("");
const telefone = ref("");
const senha = ref("");
const cargo = ref("");

const cargos = [
  {
    id: 1,
    text: "Administrador",
  },
  {
    id: 2,
    text: "Colaborador",
  },
];

const createUser = async () => {
  const data = {
    nome: name.value,
    email: email.value,
    senha: senha.value,
    telefone: telefone.value,
    cpf: cpf.value,
    cargo: Number(cargo.value),
  };

  try {
    const response = await api("/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    toast.success({ title: "Sucesso!", message: response });
  } catch (error) {
    toast.error({ title: "Erro!", message: error.message });
  }
};
</script>

<template>
  <NuxtLayout>
    <Container>
      <h1 class="text-3xl font-bold text-white mb-4 flex gap-5">
        <BackButton /> Preencha os campos abaixo:
      </h1>

      <form @submit.prevent="createUser">
        <div class="form_area">
          <CommonInput
            text="CPF"
            name="cpf"
            type="text"
            placeholder="123.456.789/10"
            v-model="cpf"
            mask="###.###.###-##"
            :maxlength="14"
          />
          <CommonInput
            text="Nome"
            name="nome"
            type="text"
            placeholder="Digite o nome"
            v-model="name"
          />
          <CommonInput
            text="E-mail"
            name="email"
            type="email"
            placeholder="exemplo@tsuru.com"
            v-model="email"
          />
          <CommonInput
            text="Telefone"
            name="telefone"
            type="text"
            placeholder="(00) 00000-0000"
            v-model="telefone"
            mask="(##) #####-####"
            :maxlength="15"
          />
          <CommonInput
            text="Senha"
            name="senha"
            type="password"
            placeholder="Digite a senha"
            v-model="senha"
          />
          <CommonSelect
            text="Função"
            name="funcao"
            v-model="cargo"
            :options="cargos"
          />
        </div>
        <div class="button_area">
          <input type="reset" value="Cancelar" class="cancel_button" />
          <input type="submit" value="Enviar" class="submit_button" />
        </div>
      </form>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.form_area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 100px;
  align-items: start;
  justify-items: center;
}

.button_area {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 20px;
  margin-top: 50px;

  input {
    padding: 4px 6px;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    width: 100px;
  }

  .cancel_button {
    border: 2px solid #fff;
    color: #fff;
  }

  .submit_button {
    background-color: #fff;
  }
}
</style>
