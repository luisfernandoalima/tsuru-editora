<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  logradouro: String,
  bairro: String,
  numero: String,
  cep: String,
  cidade: String,
  estado: String,
});

const emit = defineEmits(["editar", "remover"]);
</script>

<template>
  <div class="endereco-card">
    <div class="endereco-info">
      <div class="endereco-icone">
        <Icon icon="akar-icons:location" style="color: #5b0606" />
      </div>

      <div class="endereco-texto">
        <div class="endereco-titulo">
          <span>{{ props.logradouro }}</span>
          <span class="badge-principal">Principal</span>
        </div>

        <div class="endereco-detalhes">
          {{ props.bairro }}<br />
          {{ props.cidade }} &ndash; {{ props.estado }} &middot; CEP
          {{ props.cep }}
        </div>
      </div>
    </div>

    <div class="endereco-acoes">
      <button
        class="botao-acao botao-remover"
        type="button"
        aria-label="Remover endereço"
        @click="emit('remover', endereco.id)"
      >
        <Icon icon="akar-icons:trash-can" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.endereco-card {
  background: #fff;
  border: 1px solid #e5e0e0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.endereco-info {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.endereco-icone {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f6ecec;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.endereco-icone i {
  font-size: 19px;
  color: #844545;
}

.endereco-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 500;
  color: #1f1a1a;
}

.badge-principal {
  font-size: 11px;
  font-weight: 500;
  color: #844545;
  background: #f6ecec;
  padding: 2px 8px;
  border-radius: 20px;
}

.endereco-detalhes {
  font-size: 13px;
  color: #6b6462;
  line-height: 1.6;
}

.endereco-acoes {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.botao-acao {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e0e0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.botao-acao:hover {
  background: #f7f5f5;
}

.botao-acao i {
  font-size: 16px;
  color: #6b6462;
}

.botao-remover i {
  color: #a33b3b;
}
</style>
