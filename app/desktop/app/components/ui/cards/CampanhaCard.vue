<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  id: Number,
  nome: String,
  descricao: String,
  data: [Date, String],
  status: String,
});

// Normaliza o status para escolher a cor do badge
const statusClass = computed(() => {
  const s = (props.status ?? "").toLowerCase();
  if (["ativa", "ativo", "em andamento", "aberta"].includes(s))
    return "is-ativo";
  if (["encerrada", "cancelada", "inativa", "inativo", "fechada"].includes(s))
    return "is-inativo";
  return "is-neutro";
});
</script>

<template>
  <div class="campanha-card">
    <div class="campanha-card__header">
      <div class="campanha-card__identidade">
        <div class="campanha-card__icone">
          <Icon icon="material-symbols:campaign-outline-rounded" />
        </div>
        <p class="campanha-card__nome">{{ props.nome }}</p>
      </div>

      <span class="campanha-card__status" :class="statusClass">
        {{ props.status || "N/A" }}
      </span>
    </div>

    <div class="campanha-card__body">
      <div class="campanha-card__linha">
        <Icon icon="material-symbols:notes-rounded" />
        <div>
          <p class="campanha-card__label">Descrição</p>
          <p class="campanha-card__valor campanha-card__descricao">
            {{ props.descricao || "Sem descrição" }}
          </p>
        </div>
      </div>

      <div class="campanha-card__footer">
        <span class="campanha-card__data">
          <Icon icon="material-symbols:calendar-month-outline-rounded" />
          {{ props.data ? formatDate(props.data) : "Sem data" }}
        </span>

        <div class="campanha-card__acoes">
          <NuxtLink
            :to="`/campanhas/${props.id}/visualizar`"
            aria-label="Visualizar"
          >
            <Icon icon="mdi:eye-outline" />
          </NuxtLink>
          <NuxtLink :to="`/campanhas/${props.id}/editar`" aria-label="Editar">
            <Icon icon="material-symbols:edit-outline" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campanha-card {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  max-width: 360px;
  box-shadow: var(--shadow);
}

.campanha-card__header {
  background: var(--details);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.campanha-card__identidade {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.campanha-card__icone {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #945d5d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.campanha-card__nome {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.campanha-card__status {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: capitalize;
}

.campanha-card__status.is-ativo {
  background: #d9f0e2;
  color: #1a6b3f;
}

.campanha-card__status.is-inativo {
  background: #f0d9d9;
  color: #8a2c2c;
}

.campanha-card__status.is-neutro {
  background: #ececec;
  color: #555;
}

.campanha-card__body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.campanha-card__linha {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #945d5d;
}

.campanha-card__linha svg {
  flex-shrink: 0;
  font-size: 16px;
  margin-top: 2px;
}

.campanha-card__label {
  margin: 0;
  font-size: 11px;
  color: #999;
}

.campanha-card__valor {
  margin: 0;
  font-size: 13px;
  color: #222;
}

.campanha-card__descricao {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campanha-card__footer {
  border-top: 0.5px solid #eee;
  margin-top: 4px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.campanha-card__data {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.campanha-card__acoes {
  display: flex;
  gap: 6px;
  color: var(--details);
}

.campanha-card__acoes a {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 0.5px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.campanha-card__acoes a:hover {
  background: #f5f5f5;
}
</style>
