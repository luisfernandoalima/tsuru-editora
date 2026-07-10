<script setup>
const props = defineProps({
  id: Number,
  nome: String,
  status: String,
  dataCriacao: String,
  dataFechamento: String,
  totalObras: Number,
  totalUnidades: Number,
  aprovador: String,
});

const classStatus = computed(() => {
  switch (props.status) {
    case "Aberto":
      return "status_aberto";
    case "Fechado":
      return "status_fechado";
    default:
      return "";
  }
});

const dataFormatada = (data) => {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR");
};
</script>

<template>
  <NuxtLink :to="`/ordem-de-impressao/${id}`" class="order_card_area">
    <div class="card_header">
      <h1>{{ nome }}</h1>
      <span :class="['status_badge', classStatus]">{{ status }}</span>
    </div>

    <div class="card_numbers">
      <div class="number_item">
        <strong>{{ totalObras ?? 0 }}</strong>
        <span>obras</span>
      </div>
      <div class="number_item">
        <strong>{{ totalUnidades ?? 0 }}</strong>
        <span>unidades</span>
      </div>
    </div>

    <div class="card_footer">
      <span>Criada em {{ dataFormatada(dataCriacao) }}</span>
      <span v-if="status === 'Fechado' && dataFechamento">
        · Fechada em {{ dataFormatada(dataFechamento) }}
      </span>
      <span v-if="aprovador">· Aprovador: {{ aprovador }}</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.order_card_area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  padding: 15px;
  width: 100%;
  border: var(--border);
  border-radius: 15px;
  box-shadow: var(--shadow);
  background-color: var(--main);
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

.card_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card_header h1 {
  font-size: 1.1rem;
  margin: 0;
}

.status_badge {
  font-size: x-small;
  font-weight: bold;
  color: #fff;
  border-radius: 15px;
  padding: 3px 8px;
  border: 2px solid #fff;
}

.status_aberto {
  background-color: #844545;
  box-shadow: 0px 0px 10px #844545;
}

.status_fechado {
  background-color: var(--details);
  box-shadow: 0px 0px 10px var(--details);
}

.card_numbers {
  display: flex;
  gap: 20px;
}

.number_item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.number_item strong {
  font-size: 1.4rem;
  line-height: 1;
}

.number_item span {
  font-size: 0.75rem;
  color: var(--focus-text);
}

.card_footer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.7rem;
  color: var(--focus-text);
  opacity: 0.8;
}
</style>
