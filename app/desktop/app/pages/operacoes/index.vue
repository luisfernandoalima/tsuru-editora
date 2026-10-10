<script setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>

<template>
  <NuxtLayout>
    <div class="operation_option_div">
      <NuxtLink to="/operacoes/saida">Saídas</NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.operation_option_div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  height: 100%;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    width: 30%;
    height: 60%;
    border-radius: 15px;
  }
}
</style>
