<script setup>
import { Icon } from "@iconify/vue";
definePageMeta({
  layout: "default",
  middleware: "auth",
});

import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";
import OrderCard from "~/components/ui/cards/OrderCard.vue";
import ConfirmPopUp from "~/components/ui/utils/ConfirmPopUp.vue";

const { getToken } = useAuthToken();

const api = useApi();
const token = getToken();
const toast = useToast();

const popUpActive = ref(false);
const nomeOrdem = ref("");
const ordens = ref([]);

const listarOrdens = async () => {
  try {
    const response = await api("/print-order/list", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    ordens.value = response.orders;
    console.log(ordens.value);
  } catch (error) {
    console.error(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

const criarOrdem = async () => {
  try {
    const data = {
      nome: nomeOrdem.value,
      status: "ABERTA",
    };
    const response = await api("/print-order/create", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: data,
    });

    popUpActive.value = false;
    listarOrdens();
    toast.success({ title: "Sucesso!", message: response.message });
  } catch (error) {
    toast.error({ title: error, message: error.message });
  }
};

const abrirConfirmação = () => {
  nomeOrdem.value = generateOrderName();
  popUpActive.value = true;
};

onMounted(() => {
  listarOrdens();
});
</script>
<template>
  <NuxtLayout>
    <ConfirmPopUp
      title="Confirmação para criar Ordem"
      :message="`Deseja criar a ordem:${nomeOrdem}`"
      :active="popUpActive"
      :handleClick="criarOrdem"
      @close="popUpActive = false"
    />
    <SearchBar
      :handleForms="buscarProduto"
      :value="produto"
      @update:value="produto = $event"
    />

    <div class="flex justify-end">
      <Button
        to="/ordem-de-impressao/nova-ordem"
        class="new_order"
        @click="abrirConfirmação"
        ><Icon icon="akar-icons:plus" class="inline" /> Nova Ordem</Button
      >
    </div>

    <Container>
      <div class="order_container">
        <OrderCard
          v-for="item in ordens"
          :id="item.id"
          :nome="item.nome"
          :status="item.statusOrdem"
          :dataCriacao="formatDate(item.dataCriacao)"
          :dataFechamento="formatDate(item.dataFechamento)"
          :totalObras="item.totalObras"
          :totalUnidades="item.totalUnidades"
          :aprovador="item.aprovador?._nome || null"
        />
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
