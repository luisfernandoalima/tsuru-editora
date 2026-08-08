<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";
import ParceiroCard from "~/components/ui/cards/ParceiroCard.vue";

definePageMeta({
  middleware: "admin",
  layout: "default",
});
</script>

<template>
  <NuxtLayout>
    <SearchBar />
    <Container>
      <section class="section_card">
        <ParceiroCard
          id="10"
          nome="Amazon Brasil"
          cnpj="435413541"
          email="contato.brasil@amazon.com"
          ativo
          data-cadastro=""
        />
        <ParceiroCard
          id="10"
          nome="Amazon Brasil"
          cnpj="435413541"
          email="contato.brasil@amazon.com"
          ativo
          data-cadastro=""
        />
        <ParceiroCard
          id="10"
          nome="Amazon Brasil"
          cnpj="435413541"
          email="contato.brasil@amazon.com"
          ativo
          data-cadastro=""
        />
        <ParceiroCard
          id="10"
          nome="Amazon Brasil"
          cnpj="435413541"
          email="contato.brasil@amazon.com"
          ativo
          data-cadastro=""
        />
        <ParceiroCard
          id="10"
          nome="Amazon Brasil"
          cnpj="435413541"
          email="contato.brasil@amazon.com"
          ativo
          data-cadastro=""
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
