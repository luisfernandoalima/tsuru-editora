<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";
import ParceiroCard from "~/components/ui/cards/ParceiroCard.vue";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const token = getToken();

const parceiros = ref([]);

const carregarParceiros = async () => {
  try {
    let response;

    response = await api("/partner/list", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    parceiros.value = response.parceiros;
  } catch (error) {
    toast.error({
      title: "Erro",
      message: "Não foi possível buscar os parceiros",
    });
    console.log(error);
  }
};

watch(
  () => {
    carregarParceiros();
  },
  { immediate: true },
);
</script>

<template>
  <NuxtLayout>
    <SearchBar />
    <Container>
      <section class="section_card">
        <ParceiroCard
          v-for="item in parceiros"
          :id="item.id"
          :nome="item.nome"
          :cnpj="item.cnpj"
          :contato="item.contato"
          :email="item.email"
          :ativo="item.ativo"
          :data-cadastro="item.dataCadastro"
        />
      </section>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.section_card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}
</style>
