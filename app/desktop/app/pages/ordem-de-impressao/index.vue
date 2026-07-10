<script setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});

import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";
import OrderCard from "~/components/ui/cards/OrderCard.vue";
</script>
<template>
  <NuxtLayout>
    <SearchBar
      :handleForms="buscarProduto"
      :value="produto"
      @update:value="produto = $event"
    />

    <NuxtLink to="/ordem-de-impressao/nova-ordem">+ Nova Janela</NuxtLink>

    <Container>
      <div class="order_container">
        <OrderCard
          :id="12345"
          nome="Janeiro"
          status="Fechado"
          dataCriacao="2026-01-05"
          dataFechamento="2026-01-31"
          :totalObras="12"
          :totalUnidades="340"
          aprovador="Denise"
        />
        <OrderCard :id="12345" nome="Janeiro" status="Fechado" />
        <OrderCard :id="12345" nome="Janeiro" status="Fechado" />
        <OrderCard :id="12345" nome="Janeiro" status="Fechado" />
        <OrderCard :id="12345" nome="Janeiro" status="Fechado" />
        <OrderCard :id="12345" nome="Janeiro" status="Fechado" />
      </div>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.order_container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-items: center;
  width: 100%;
  gap: 20px;
}
</style>
