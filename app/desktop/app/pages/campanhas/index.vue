<script setup>
import { Icon } from "@iconify/vue";

import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";
import CampanhaCard from "~/components/ui/cards/CampanhaCard.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();

const campanhas = ref([]);
const carregando = ref(true);

const carregarCampanhas = async () => {
  try {
    const response = await api("/campaign/list", {
      method: "GET",
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });

    campanhas.value = response.campanhas ?? [];
  } catch (error) {
    toast.error({
      title: "Erro",
      message: "Não foi possível buscar as campanhas",
    });
    console.log(error);
  } finally {
    carregando.value = false;
  }
};

onMounted(carregarCampanhas);
</script>

<template>
  <NuxtLayout>
    <SearchBar />
    <div class="flex justify-end">
      <NuxtLink to="/campanhas/nova-campanha" class="new_info">
        <Icon icon="akar-icons:plus" class="inline" /> Nova Campanha
      </NuxtLink>
    </div>

    <Container>
      <p v-if="carregando" class="feedback">Carregando...</p>

      <p v-else-if="!campanhas.length" class="feedback">
        Nenhuma campanha cadastrada ainda.
      </p>

      <section v-else class="section_card">
        <CampanhaCard
          v-for="item in campanhas"
          :key="item.id"
          :id="item.id"
          :nome="item.nome"
          :descricao="item.descricao"
          :data="item.data"
          :status="item.status"
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

.feedback {
  color: #6b7280;
}

.new_info {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 1px 6px;
  margin-bottom: 15px;
}
</style>
