<script setup>
definePageMeta({
  middleware: "auth",
});
import LoginInput from "~/components/ui/forms/LoginInput.vue";
import LoginButton from "~/components/ui/forms/LoginButton.vue";

import { ref } from "vue";
import { useRouter } from "#app";
import { useApi } from "~/composables/useApi";
import { useToast } from "#imports";
import { useAuthToken } from "~/composables/useAuthToken";

const { user } = useAuth();
const { validatePassword } = formValidation();
const { getToken } = useAuthToken();

const api = useApi();

const toast = useToast();
const token = getToken();
const router = useRouter();

const password = ref("");
const repeatPassword = ref("");

const changePassword = async () => {
  const data = {
    password: password.value,
    repeatPassword: repeatPassword.value,
  };

  const validationError = validatePassword(data);

  if (Object.keys(validationError).length > 0) {
    Object.values(validationError).forEach((value) => {
      toast.error({ title: "Erro!", message: value });
    });
    return;
  }

  const info = {
    id: user.value.id,
    password: password.value,
    repeatPassword: repeatPassword.value,
  };

  try {
    const response = await api("/user/update-password", {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: info,
    });

    toast.success({ title: "Sucesso!", message: response.message });

    router.push("/");
  } catch (err) {
    console.error(err);
    toast.error({ title: "Erro!", message: err.message });
  }
};
</script>

<template>
  <div
    class="h-dvh w-full grid grid-cols-2 items-center justify-items-center bg-[#E3DDE1]"
  >
    <div
      class="flex flex-col items-center justify-center w-full h-full text-white bg-[#5B0606]"
    >
      <h1 class="text-5xl font-bold">Atualizar senha.</h1>
      <p class="text-2xl">Atualise sua senha para utilizar o sistema.</p>
      <form
        class="pt-6 flex flex-col gap-6 items-center"
        @submit.prevent="changePassword"
      >
        <LoginInput
          text="Senha"
          type="password"
          placeholder="Senha."
          name="senha"
          v-model="password"
        />

        <LoginInput
          text="Senha"
          type="password"
          placeholder="Repita a Senha."
          name="repeatPassword"
          v-model="repeatPassword"
        />

        <LoginButton text="Enviar" />
      </form>
    </div>
    <div>
      <img src="/img/tsuru-logo.jpeg" alt="Tsuru" />
    </div>
  </div>
</template>
