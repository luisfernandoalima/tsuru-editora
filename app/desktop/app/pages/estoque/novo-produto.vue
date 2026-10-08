<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonSelect from "~/components/ui/forms/CommonSelect.vue";

import { listClassificacoesIndicativas } from "~/utils/lists";
import { listGeneros } from "~/utils/lists";

import BackButton from "~/components/layout/BackButton.vue";

import { useApi } from "~/composables/useApi";
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const token = getToken();

const titulo = ref("");
const autor = ref("");
const isbn = ref("");
const numPaginas = ref("");
const idioma = ref("Português");
const dataPublicacao = ref("");
const serie = ref("");
const volume = ref("");
const genero = ref("");
const preco = ref("");
const classIndicativa = ref("");
const imgCapa = ref(null);

function onFileChange(event) {
  imgCapa.value = event.target.files[0];
}

const createProduct = async () => {
  const formData = new FormData();

  formData.append("titulo", titulo.value);
  formData.append("autor", autor.value);
  formData.append("isbn", isbn.value);
  formData.append("numPaginas", numPaginas.value);
  formData.append("idioma", idioma.value);
  formData.append("dataPublicacao", dataPublicacao.value);
  formData.append("serie", serie.value);
  formData.append("volume", volume.value);
  formData.append("genero", genero.value);
  formData.append("preco", preco.value);
  formData.append("classIndicativa", classIndicativa.value);

  if (imgCapa.value) {
    formData.append("imgCapa", imgCapa.value); // 🔥 ESSENCIAL
  }

  const response = await api("/product/create", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};
</script>

<template>
  <NuxtLayout>
    <h1 class="text-3xl font-bold text-white mb-4 flex gap-5">
      <BackButton /> Preencha os campos abaixo:
    </h1>
    <form @submit.prevent="createProduct" class="mt-5">
      <div class="form_area">
        <CommonInput
          text="Titulo"
          name="titulo"
          type="text"
          placeholder="Insira o titulo do produto"
          v-model="titulo"
        />
        <CommonInput
          text="Autor"
          name="autor"
          type="text"
          placeholder="Digite o nome do autor"
          v-model="autor"
        />
        <CommonInput
          text="ISBN-13"
          name="isbn"
          type="text"
          placeholder="1234567890123"
          v-model="isbn"
        />
        <CommonInput
          text="Número de Páginas"
          name="numPaginas"
          type="text"
          placeholder="Insira o número de páginas"
          v-model="numPaginas"
        />
        <CommonInput
          text="Idioma"
          name="idioma"
          type="text"
          placeholder="Insira o idioma do produto"
          v-model="idioma"
          value="Português"
        />
        <CommonInput
          text="Data de Publicação"
          name="dataPublicacao"
          type="date"
          v-model="dataPublicacao"
        />
        <CommonInput
          text="Serie"
          name="serie"
          type="text"
          placeholder="Insira a série do produto"
          v-model="serie"
        />
        <CommonInput
          text="Volume"
          name="volume"
          type="text"
          placeholder="Insira o volume do produto"
          v-model="volume"
        />

        <CommonSelect
          text="Genero"
          name="genero"
          v-model="genero"
          :options="listGeneros"
        />
        <CommonInput
          text="Preço"
          name="preco"
          type="text"
          placeholder="55.00"
          v-model="preco"
        />
        <CommonSelect
          text="Classificação Indicativa"
          name="classIndicativa"
          v-model="classIndicativa"
          :options="listClassificacoesIndicativas"
        />
        <input type="file" name="imgCapa" id="imgCapa" @change="onFileChange" />
      </div>
      <div class="button_area">
        <input type="reset" value="Cancelar" class="cancel_button" />
        <input type="submit" value="Enviar" class="submit_button" />
      </div>
    </form>
  </NuxtLayout>
</template>

<style scoped>
.form_area {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
