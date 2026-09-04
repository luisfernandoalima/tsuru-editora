<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonSelect from "~/components/ui/forms/CommonSelect.vue";
import BackButton from "~/components/layout/BackButton.vue";

import Container from "~/components/layout/Container.vue";

import { cargos } from "#imports";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const { getToken } = useAuthToken();

const router = useRoute();
const api = useApi();
const toast = useToast();

const token = getToken();

const id = router.params.id;

const user = await api(`/user/find-user/${id}`, {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const cpf = ref(user.cpf);
const name = ref(user.nome);
const email = ref(user.email);
const telefone = ref(user.telefone);
const senha = ref("");
const cargo = ref(user.id_cargo);

const updateUser = async () => {
  try {
    const data = {
      id: id,
      nome: name.value,
      email: email.value,
      senha: senha.value,
      telefone: telefone.value,
      cpf: cpf.value,
      cargo: cargo.value,
    };

    const response = await api(`/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    toast.success({ title: "Sucesso!", message: response.message });
  } catch (err) {
    console.error(err);
    toast.error({ title: "Erro!", message: err });
  }
};
</script>

<template>
  <NuxtLayout>
    <Container>
      <div class="header">
        <BackButton />

        <div class="title_area">
          <div class="avatar">
            {{ name?.charAt(0) || "U" }}
          </div>

          <div>
            <h1>Atualizar colaborador</h1>
            <p>Edite os dados cadastrais do colaborador</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="updateUser">
        <section class="section">
          <h2>Dados pessoais</h2>

          <div class="form_grid">
            <CommonInput
              text="CPF"
              name="cpf"
              type="text"
              placeholder="123.456.789-10"
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
              placeholder="exemplo@empresa.com"
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
          </div>
        </section>

        <section class="section">
          <h2>Dados de acesso</h2>

          <div class="form_grid">
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
        </section>

        <div class="actions">
          <button type="button" class="secondary">Cancelar</button>

          <button type="submit" class="primary">Salvar alterações</button>
        </div>
      </form>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.header {
  margin-bottom: 32px;
}

.back_button {
  border: none;
  background: transparent;

  color: #555;
  cursor: pointer;

  margin-bottom: 24px;
  font-size: 14px;
}

.title_area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 72px;
  height: 72px;

  border-radius: 50%;

  background: linear-gradient(135deg, #e54646, #ed3a3a);

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
  font-weight: bold;
}

.title_area h1 {
  margin: 0;
  font-size: 28px;
}

.title_area p {
  margin-top: 6px;
  color: #bbbbbb;
}

.section {
  margin-bottom: 36px;
}

.section h2 {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 20px;
}

.form_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  margin-top: 40px;
}

.primary,
.secondary {
  height: 48px;
  padding: 0 24px;

  border-radius: 12px;
  border: none;

  cursor: pointer;
  font-weight: 600;

  transition: 0.2s;
}

.primary {
  background: #4f46e5;
  color: white;
}

.primary:hover {
  background: #4338ca;
}

.secondary {
  background: #eef2ff;
  color: #4f46e5;
}

.secondary:hover {
  background: #e0e7ff;
}
</style>
