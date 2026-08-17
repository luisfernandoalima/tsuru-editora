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

    <div class="flex justify-end">
      <NuxtLink to="/ordem-de-impressao/nova-ordem" class="new_order"
        >+ Nova Janela</NuxtLink
      >
    </div>

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

.new_order {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 1px 6px;
  margin-bottom: 15px;
}
</style>
