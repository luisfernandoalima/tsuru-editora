<script setup>
import BackButton from "~/components/layout/BackButton.vue";
import Container from "~/components/layout/Container.vue";
import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>

<template>
  <NuxtLayout>
    <Container>
      <BackButton />
      <h1>JAN-2027</h1>
    </Container>
    <Container></Container>
  </NuxtLayout>
</template>
