<script setup>
import LoginInput from "~/components/ui/forms/LoginInput.vue";
import LoginButton from "~/components/ui/forms/LoginButton.vue";

import { ref } from "vue";
import { useRouter } from "#app";
import { useApi } from "~/composables/useApi";
import { useToast } from "#imports";

import { validateLogin } from "~/utils/formValidation";
import { useAuthToken } from "~/composables/useAuthToken";

const { setToken } = useAuthToken();

const api = useApi();

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();

// const token = useCookie("auth_token");

const login = async () => {
  const data = {
    email: email.value,
    password: password.value,
  };

  const validationError = validateLogin(data);

  if (Object.keys(validationError).length > 0) {
    Object.values(validationError).forEach((value) => {
      toast.error({ title: "Erro!", message: value });
    });
    return;
  }

  try {
    const response = await api("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: email.value,
        senha: password.value,
      },
    });

    setToken(response.token);

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
      <h1 class="text-5xl font-bold">Bem-vindo!</h1>
      <p class="text-2xl">Faça o login para continuar</p>
      <form
        class="pt-6 flex flex-col gap-6 items-center"
        @submit.prevent="login"
      >
        <LoginInput
          text="E-mail"
          type="email"
          placeholder="E-mail."
          name="email"
          v-model="email"
        />

        <LoginInput
          text="Senha"
          type="password"
          placeholder="Senha."
          name="senha"
          v-model="password"
        />

        <LoginButton text="Enviar" />
      </form>
    </div>
    <div>
      <img src="/img/tsuru-logo.jpeg" alt="Tsuru" />
    </div>
  </div>
</template>
