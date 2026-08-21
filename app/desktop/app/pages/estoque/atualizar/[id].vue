<script setup>
import CommonInput from "~/components/ui/forms/CommonInput.vue";
import CommonSelect from "~/components/ui/forms/CommonSelect.vue";
import BackButton from "~/components/layout/BackButton.vue";

import { listClassificacoesIndicativas } from "~/utils/lists";
import { listGeneros } from "~/utils/lists";
import { useAuthToken } from "~/composables/useAuthToken";
import Container from "~/components/layout/Container.vue";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

const { getToken } = useAuthToken();

const router = useRoute();
const api = useApi();
const toast = useToast();

const id = router.params.id;
const token = getToken();

const response = await api(`/product/find-product/${id}`, {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const produto = response.produto;

const titulo = ref(produto._titulo);
const autor = ref(produto._autor);
const isbn = ref(produto._isbn13);
const numPaginas = ref(String(produto._numPaginas));
const idioma = ref(produto._idioma);
const dataPublicacao = ref(produto._dataPublicacao);
const serie = ref(produto._serie);
const volume = ref(produto._volume);
const genero = ref(produto._genero);
const preco = ref(produto._preco);
const classIndicativa = ref(produto._classIndicativa);
const imgCapa = ref(produto._imgCapa);

const previewImage = ref(`http://localhost:8081${imgCapa.value}`);

const updateProduct = async () => {
  try {
    const updatedData = {
      titulo: titulo.value,
      autor: autor.value,
      isbn: isbn.value,
      numPaginas: numPaginas.value,
      idioma: idioma.value,
      dataPublicacao: dataPublicacao.value,
      serie: serie.value,
      volume: volume.value,
      genero: genero.value,
      preco: preco.value,
      classIndicativa: classIndicativa.value,
    };

    const response = await api(`/product/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    toast.success({ title: "Sucesso!", message: response.message });
  } catch (err) {
    console.log(err);
    toast.error({ title: "Erro!", message: err });
  }
};
</script>

<template>
  <NuxtLayout>
    <Container :class="`container`">
      <div class="header">
        <BackButton />

        <div class="product_preview mt-4">
          <div class="cover_preview">
            <img v-if="previewImage" :src="previewImage" />

            <div v-else class="empty_cover">Sem capa</div>
          </div>

          <div class="product_info">
            <h1>
              {{ titulo || "Novo Produto" }}
            </h1>

            <p>
              {{ autor || "Autor" }}
            </p>

            <span> ISBN: {{ isbn || "0000000000000" }} </span>
          </div>
        </div>
      </div>

      <form @submit.prevent="updateProduct">
        <section class="section">
          <h2>Informações básicas</h2>

          <div class="form_grid">
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
              text="Idioma"
              name="idioma"
              type="text"
              placeholder="Português"
              v-model="idioma"
            />

            <CommonInput
              text="Serie"
              name="serie"
              type="text"
              placeholder="Insira a série"
              v-model="serie"
            />

            <CommonInput
              text="Volume"
              name="volume"
              type="text"
              placeholder="Volume"
              v-model="volume"
            />
          </div>
        </section>

        <section class="section">
          <h2>Detalhes</h2>

          <div class="form_grid">
            <CommonInput
              text="Número de Páginas"
              name="numPaginas"
              type="number"
              placeholder="Número de páginas"
              v-model="numPaginas"
            />

            <CommonInput
              text="Data de Publicação"
              name="dataPublicacao"
              type="date"
              v-model="dataPublicacao"
            />

            <CommonSelect
              text="Genero"
              name="genero"
              v-model="genero"
              :options="listGeneros"
            />

            <CommonSelect
              text="Classificação Indicativa"
              name="classIndicativa"
              v-model="classIndicativa"
              :options="listClassificacoesIndicativas"
            />

            <CommonInput
              text="Preço"
              name="preco"
              type="text"
              placeholder="55.00"
              v-model="preco"
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
.container {
  flex: 1;
}
.header {
  margin-bottom: 40px;
  width: 100%;
}

.product_preview {
  display: flex;
  gap: 28px;
  align-items: center;
}

.cover_preview {
  width: 140px;
  height: 200px;

  border-radius: 18px;

  overflow: hidden;

  background: #f3f4f6;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.cover_preview img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.empty_cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.product_info h1 {
  margin: 0;
  font-size: 34px;
}

.product_info p {
  margin-top: 8px;

  font-size: 18px;
  color: #505050;
}

.product_info span {
  display: block;
  margin-top: 12px;

  color: #505050;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  margin-bottom: 24px;

  color: #fff;
  font-size: 20px;
}

.form_grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  gap: 24px;
}

.actions {
  margin-top: 50px;

  display: flex;
  justify-content: flex-end;

  gap: 16px;
}

.primary,
.secondary {
  height: 50px;

  padding: 0 28px;

  border-radius: 14px;

  border: none;

  cursor: pointer;

  font-weight: 600;

  transition: 0.2s;
}

.primary {
  background: #fff;
  color: #5b0606;
}

.primary:hover {
  background: #a40000;
  color: #fff;
}

.secondary {
  background: #eef2ff;
  color: #5b0606;
}

.secondary:hover {
  background: #e0e7ff;
}
</style>
