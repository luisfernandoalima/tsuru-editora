<script>
// Bloco normal: roda no escopo do módulo, então o defineModel consegue usar PADRAO
const PADRAO = { status: "todos", ordenacao: "titulo_asc" };
</script>

<script setup>
const filtro = defineModel({ default: () => ({ ...PADRAO }) });

const opcoesStatus = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "em_estoque", rotulo: "Em Estoque", cor: "#0a8a0a" },
  { valor: "baixo", rotulo: "Baixo Estoque", cor: "#ffa600" },
  { valor: "esgotado", rotulo: "Esgotado", cor: "#e53935" },
];

const opcoesOrdenacao = [
  { valor: "titulo_asc", rotulo: "Título (A–Z)" },
  { valor: "titulo_desc", rotulo: "Título (Z–A)" },
  { valor: "estoque_desc", rotulo: "Maior estoque" },
  { valor: "estoque_asc", rotulo: "Menor estoque" },
];

const alterado = computed(
  () =>
    filtro.value.status !== PADRAO.status ||
    filtro.value.ordenacao !== PADRAO.ordenacao,
);

function definirStatus(status) {
  filtro.value = { ...filtro.value, status };
}

function definirOrdenacao(event) {
  filtro.value = { ...filtro.value, ordenacao: event.target.value };
}

function limpar() {
  filtro.value = { ...PADRAO };
}
</script>

<template>
  <div class="filtro" role="group" aria-label="Filtrar produtos">
    <div class="filtro__grupo">
      <span class="filtro__rotulo">Situação</span>
      <button
        v-for="op in opcoesStatus"
        :key="op.valor"
        type="button"
        class="chip"
        :class="{ 'chip--ativo': filtro.status === op.valor }"
        :aria-pressed="filtro.status === op.valor"
        @click="definirStatus(op.valor)"
      >
        <span
          v-if="op.cor"
          class="chip__ponto"
          :style="{ background: op.cor }"
          aria-hidden="true"
        />
        {{ op.rotulo }}
      </button>
    </div>

    <div class="filtro__grupo">
      <label class="filtro__rotulo" for="filtro-ordenacao">Ordenar por</label>
      <select
        id="filtro-ordenacao"
        class="filtro__select"
        :value="filtro.ordenacao"
        @change="definirOrdenacao"
      >
        <option v-for="op in opcoesOrdenacao" :key="op.valor" :value="op.valor">
          {{ op.rotulo }}
        </option>
      </select>
    </div>

    <button
      v-if="alterado"
      type="button"
      class="filtro__limpar"
      @click="limpar"
    >
      Limpar filtros
    </button>
  </div>
</template>

<style scoped>
.filtro {
  --escuro: #5c1414;
  --rose: #844545;
  --rose-claro: #f3e6e6;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 10px;
  color: var(--escuro);
  box-shadow: var(--shadow);
}

.filtro__grupo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filtro__rotulo {
  font-size: 0.95rem;
  font-weight: 600;
  margin-right: 2px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--escuro);
  background: #fff;
  border: 1.5px solid var(--rose);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.chip:hover {
  background: var(--rose-claro);
}

.chip--ativo,
.chip--ativo:hover {
  background: var(--rose);
  color: #fff;
}

.chip__ponto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px #fff;
}

.filtro__select {
  padding: 5px 10px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--escuro);
  background: #fff;
  border: 1.5px solid var(--rose);
  border-radius: 8px;
  cursor: pointer;
}

.filtro__limpar {
  margin-left: auto;
  padding: 5px 4px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--rose);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.chip:focus-visible,
.filtro__select:focus-visible,
.filtro__limpar:focus-visible {
  outline: 2px solid var(--escuro);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .filtro {
    gap: 10px;
  }
  .filtro__limpar {
    margin-left: 0;
  }
}
</style>
