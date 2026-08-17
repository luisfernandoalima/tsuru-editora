<script setup>
import { Icon } from "@iconify/vue";
const props = defineProps({
  id: Number,
  nome: String,
  cnpj: String,
  email: String,
  contato: String,
  ativo: Boolean,
  dataCadastro: Date,
});
</script>

<template>
  <div class="parceiro-card">
    <div class="parceiro-card__header">
      <div class="parceiro-card__identidade">
        <div class="parceiro-card__icone">
          <Icon icon="material-symbols:store-outline-rounded" />
        </div>
        <div>
          <p class="parceiro-card__nome">{{ props.nome }}</p>
          <p class="parceiro-card__cnpj">{{ props.cnpj }}</p>
        </div>
      </div>

      <span
        class="parceiro-card__status"
        :class="props.ativo ? 'is-ativo' : 'is-inativo'"
      >
        <i class="ti ti-circle-filled" aria-hidden="true" />
        {{ props.ativo ? "Ativo" : "Inativo" }}
      </span>
    </div>

    <div class="parceiro-card__body">
      <div class="parceiro-card__linha">
        <i class="ti ti-user" aria-hidden="true" />
        <div>
          <p class="parceiro-card__label">Contato</p>
          <p class="parceiro-card__valor">{{ props.contato }}</p>
        </div>
      </div>

      <div class="parceiro-card__linha">
        <i class="ti ti-mail" aria-hidden="true" />
        <div>
          <p class="parceiro-card__label">Email</p>
          <p class="parceiro-card__valor">{{ props.email }}</p>
        </div>
      </div>

      <div class="parceiro-card__footer">
        <span class="parceiro-card__data">
          <i class="ti ti-calendar" aria-hidden="true" />
          Cadastrado em {{ formatDate(props.dataCadastro) }}
        </span>

        <div class="parceiro-card__acoes">
          <button type="button" aria-label="Visualizar">
            <NuxtLink :to="`/parceiros/${props.id}/visualizar`">
              <Icon icon="mdi:eye-outline" />
            </NuxtLink>
          </button>
          <button type="button" aria-label="Editar">
            <NuxtLink to="">
              <Icon icon="material-symbols:edit-outline" />
            </NuxtLink>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parceiro-card {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  max-width: 360px;
  box-shadow: var(--shadow);
}

.parceiro-card__header {
  background: var(--details);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parceiro-card__identidade {
  display: flex;
  align-items: center;
  gap: 10px;
}

.parceiro-card__icone {
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

.parceiro-card__nome {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}

.parceiro-card__cnpj {
  margin: 0;
  font-size: 12px;
  color: #f0dede;
}

.parceiro-card__status {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.parceiro-card__status i {
  font-size: 7px;
}

.parceiro-card__status.is-ativo {
  background: #d9f0e2;
  color: #1a6b3f;
}

.parceiro-card__status.is-inativo {
  background: #f0d9d9;
  color: #8a2c2c;
}

.parceiro-card__body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.parceiro-card__linha {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #945d5d;
}

.parceiro-card__linha i {
  font-size: 16px;
}

.parceiro-card__label {
  margin: 0;
  font-size: 11px;
  color: #999;
}

.parceiro-card__valor {
  margin: 0;
  font-size: 13px;
  color: #222;
}

.parceiro-card__footer {
  border-top: 0.5px solid #eee;
  margin-top: 4px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parceiro-card__data {
  font-size: 11px;
  color: #999;
}

.parceiro-card__acoes {
  display: flex;
  gap: 6px;
  color: var(--details);
}

.parceiro-card__acoes button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 0.5px solid #ddd;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.parceiro-card__acoes button:hover {
  background: #f5f5f5;
}
</style>
