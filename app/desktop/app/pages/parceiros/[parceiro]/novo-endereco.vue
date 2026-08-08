<script setup>
import Container from "~/components/layout/Container.vue";
import CommonInput from "~/components/ui/forms/CommonInput.vue";

import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const router = useRoute();
const id = router.params.parceiro;

const cep = ref("");
const logradouro = ref("");
const numero = ref("");
const bairro = ref("");
const cidade = ref("");
const estado = ref("");

const CheckCep = ref(false);
const disableInput = ref(true);

const consultaEndereco = async () => {
  const cepLimpo = cep.value.split("-").join("");

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await response.json();

  console.log(data);

  logradouro.value = data.logradouro;
  bairro.value = data.bairro;
  cidade.value = data.localidade;
  estado.value = data.uf;
};

const resetForms = () => {
  cep.value = "";
  logradouro.value = "";
  numero.value = "";
  bairro.value = "";
  cidade.value = "";
  estado.value = "";
};

const salvarEndereco = () => {
  alert("OI");
  navigateTo(`/parceiros/${id}/visualizar`);
};

watch(CheckCep, (marcado) => {
  if (marcado) {
    disableInput.value = false;
  } else {
    disableInput.value = true;
    cep.value = "";
    logradouro.value = "";
    numero.value = "";
    bairro.value = "";
    cidade.value = "";
    estado.value = "";
  }
});
</script>

<template>
  <NuxtLayout
    ><div class="parceiro_main_page">
      <Container>
        <h1 class="text-4xl font-semibold mb-2">Amazon Brasil</h1>
        <section>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID do Parceiro</span>
              <strong># {{ id }}</strong>
            </div>

            <div class="info-item">
              <span class="label">CNPJ do Parceiro</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail de contanto</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">Contato do Parceiro</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">Status</span>
              <strong></strong>
            </div>
            <div class="info-item">
              <span class="label">Data de cadastro</span>
              <strong></strong>
            </div>
          </div>
        </section>
      </Container>
      <Container custom-class="enderecos_container">
        <h2>Novo Endereço</h2>
        <div class="flex justify-start gap-5 text-2xl">
          <div class="input_cep_div">
            <input
              name="cep"
              type="text"
              placeholder="Digite o CEP do endereço"
              v-maska
              data-maska="#####-###"
              maxlength="9"
              v-model="cep"
              autocomplete="off"
              :disabled="CheckCep"
              @keyup.enter="consultaEndereco"
            />
            <button v-on:click="consultaEndereco" :disabled="CheckCep">
              <Icon
                icon="material-symbols:search"
                width="35"
                height="35"
                style="color: #fff"
              />
            </button>
          </div>
          <div class="checkbox_cep_div">
            <input
              type="checkbox"
              name="CheckCep"
              id="CheckCep"
              v-model="CheckCep"
            />
            <label for="CheckCep">Não possuo o CEP do local</label>
          </div>
        </div>
        <hr class="mt-4 mb-4" />
        <div class="endereco_forms">
          <CommonInput
            text="Logradouro"
            name="logradouro"
            type="text"
            placeholder="Digite o CEP do endereço"
            :disabled="disableInput"
            v-model="logradouro"
          />
          <CommonInput
            text="Número"
            name="numero"
            type="text"
            placeholder="Digite o CEP do endereço"
            v-model="numero"
          />
          <CommonInput
            text="Bairro"
            name="bairro"
            type="text"
            placeholder="Digite o CEP do endereço"
            :disabled="disableInput"
            v-model="bairro"
          />
          <CommonInput
            text="Estado"
            name="estado"
            type="text"
            placeholder="Digite o CEP do endereço"
            :disabled="disableInput"
            v-model="estado"
          />
          <CommonInput
            text="Cidade"
            name="cidade"
            type="text"
            placeholder="Digite o CEP do endereço"
            :disabled="disableInput"
            v-model="cidade"
          />
          <div class="buttons_div">
            <button @click="salvarEndereco" class="submit">Salvar</button>
            <button @click="resetForms" class="reset">Cancelar</button>
          </div>
        </div>
      </Container>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.parceiro_main_page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #6b7280;
}

.info-item strong {
  color: #111827;
  font-size: 16px;
}

.enderecos_container {
  flex: 1;
  width: 100%;
  margin-top: 20px;

  h2 {
    font-size: 1.6em;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .endereco_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
}

.input_cep_div {
  display: flex;

  input {
    height: 1.8em;
    border: var(--border);
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    padding-left: 15px;

    &:focus {
      outline: none;
    }

    &:disabled {
      cursor: not-allowed;
      color: #616161;
      background-color: #cecece;
    }
  }
  button {
    height: 1.8em;
    color: var(--main);
    background-color: var(--red);
    border: var(--border);
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    padding-right: 5px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.checkbox_cep_div {
  display: flex;
  align-items: center;
  gap: 5px;

  label {
    font-size: 0.9em;
  }
}

.buttons_div {
  justify-self: flex-end;
  display: flex;
  align-items: flex-end;
  gap: 20px;

  button {
    font-weight: 800;
    cursor: pointer;
    border: var(--border);
    border-radius: 15px;
    width: 150px;
    height: 45px;
    transition: 0.3s;

    &.submit {
      background-color: var(--red);
      color: var(--main);
    }

    &.reset {
      color: var(--red);
    }

    &:hover {
      transform: scale(1.1);
    }
  }
}

.endereco_forms {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
</style>
