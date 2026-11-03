<script setup>
const props = defineProps({
  lote: { type: Object, required: true },
  modelValue: { type: Number, default: 0 },
});

const emit = defineEmits(["update:modelValue"]);

const maximo = computed(() => Number(props.lote.quantidade_saida) || 0);

// Preço realmente pago por unidade nessa saída
const precoUnitario = computed(() =>
  maximo.value
    ? Number(props.lote.subtotal) / maximo.value
    : Number(props.lote.preco_produto) || 0,
);

const valorDevolvido = computed(() => props.modelValue * precoUnitario.value);

const atualizar = (event) => {
  let valor = Math.floor(Number(event.target.value));

  if (!Number.isFinite(valor) || valor < 0) valor = 0;
  if (valor > maximo.value) valor = maximo.value;

  event.target.value = valor;
  emit("update:modelValue", valor);
};
</script>

<template>
  <div class="lote-card" :class="{ 'lote-card--ativo': modelValue > 0 }">
    <div class="lote-card__header">
      <div>
        <p class="lote-card__codigo">Lote {{ lote.codigo }}</p>
        <p class="lote-card__produto">{{ lote.produto_titulo }}</p>
      </div>
      <span class="lote-card__isbn">ISBN {{ lote.isbn }}</span>
    </div>

    <div class="lote-card__info">
      <div>
        <span class="label">Qtd. na saída</span>
        <strong>{{ maximo }}</strong>
      </div>
      <div>
        <span class="label">Preço unitário</span>
        <strong>{{ formatCurrency(precoUnitario) }}</strong>
      </div>
      <div>
        <span class="label">Subtotal da saída</span>
        <strong>{{ formatCurrency(Number(lote.subtotal) || 0) }}</strong>
      </div>
    </div>

    <div class="lote-card__devolucao">
      <label :for="`devolver-${lote.id}`">Unidades a devolver</label>
      <input
        :id="`devolver-${lote.id}`"
        type="number"
        min="0"
        :max="maximo"
        step="1"
        :value="modelValue"
        @input="atualizar"
      />
      <p class="lote-card__valor">
        Valor a devolver: <strong>{{ formatCurrency(valorDevolvido) }}</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.lote-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow);
}

.lote-card--ativo {
  border-color: var(--details);
}

.lote-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.lote-card__codigo {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.lote-card__produto {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.lote-card__isbn {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
}

.lote-card__info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.lote-card__info div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: 11px;
  color: #999;
}

.lote-card__info strong {
  font-size: 14px;
  color: #111827;
}

.lote-card__devolucao {
  border-top: 0.5px solid #eee;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lote-card__devolucao label {
  font-size: 13px;
  color: #374151;
}

.lote-card__devolucao input {
  border: 3px solid var(--details);
  border-radius: 10px;
  padding: 5px;
  width: 100%;
}

.lote-card__valor {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}
</style>
