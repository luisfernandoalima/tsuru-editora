<script setup>
import SearchBar from "~/components/layout/SearchBar.vue";
import Container from "~/components/layout/Container.vue";

definePageMeta({
  middleware: "admin",
  layout: "default",
});

const route = useRoute();

const id = route.params.parceiro;
</script>

<template>
  <NuxtLayout>
    <div class="parceiro_main_page">
      <Container>
        <h1 class="text-4xl font-semibold mb-2">Amazon Brasil</h1>
        <section>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID do Parceiro</span>
              <strong># {{ id }}</strong>
            </div>

            <div class="info-item">
              <span class="label">CNPJ do Parceiro</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">E-mail de contanto</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">Contato do Parceiro</span>
              <strong></strong>
            </div>

            <div class="info-item">
              <span class="label">Status</span>
              <strong></strong>
            </div>
            <div class="info-item">
              <span class="label">Data de cadastro</span>
              <strong></strong>
            </div>
          </div>
        </section>
      </Container>
      <Container custom-class="enderecos_container">
        <div class="endereco_header">
          <h2>Endereços</h2>

          <NuxtLink
            :to="`/parceiros/${id}/novo-endereco`"
            class="novo_endereco"
          >
            Novo endereço +
          </NuxtLink>
        </div>
        <div class="flex justify-center text-2xl">
          Não há endereços cadastrados
        </div>
      </Container>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.parceiro_main_page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #6b7280;
}

.info-item strong {
  color: #111827;
  font-size: 16px;
}

.enderecos_container {
  flex: 1;
  width: 100%;
  margin-top: 20px;

  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }

  .endereco_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
}

.novo_endereco {
  border: var(--border);
  border-radius: 15px;
  width: fit-content;
  padding: 2px 5px;
  transition: 0.3s;

  &:hover {
    background-color: var(--red);
    color: #fff;
  }
}
</style>
