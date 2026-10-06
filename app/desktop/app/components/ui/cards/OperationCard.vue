<script setup>
defineProps({
  itens: {
    type: Array,
    default: () => [],
  },
});

// /uploads é servido pelo backend (porta 8081), não pelo Nuxt.
// Ajuste para a URL base da sua API, ou leve isso para o runtimeConfig.
const UPLOADS_HOST = "http://localhost:8081";

const capaSrc = (url) => (url ? `${UPLOADS_HOST}${url}` : null);
</script>

<template>
  <p v-if="!itens.length" class="empty">Nenhum produto nesta saída.</p>

  <article
    v-for="item in itens"
    v-else
    :key="item.idLote ?? `${item.idProduto}-${item.codigoLote}`"
    class="product-card"
  >
    <div class="product-header">
      <img
        v-if="capaSrc(item.capaUrl)"
        :src="capaSrc(item.capaUrl)"
        :alt="`Capa de ${item.titulo}`"
        class="product-cover"
        loading="lazy"
      />

      <div class="product-info">
        <NuxtLink :to="`/produto/${item.idProduto}`">
          <h3>{{ item.titulo }}</h3>
        </NuxtLink>

        <span class="product-id">Produto #{{ item.idProduto }}</span>

        <span v-if="item.codigoLote" class="product-id">
          Lote: {{ item.codigoLote }}
        </span>

        <span v-if="item.precoUnitario" class="product-id">
          Preço unitário: {{ formatCurrency(item.precoUnitario) }}
        </span>

        <span class="product-id product-subtotal">
          Subtotal: {{ formatCurrency(item.subtotal) }}
        </span>
      </div>

      <div class="quantity">{{ item.quantidade }}x</div>
    </div>
  </article>
</template>

<style scoped>
.empty {
  color: #6b7280;
  font-size: 14px;
}

.product-card {
  background: white;
  border-radius: 18px;
  padding: 22px;
  border: 2px solid #5b0606;
  transition: 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(42, 15, 15, 0.08);
}

.product-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.product-cover {
  width: 64px;
  height: 92px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
  line-height: 1.4;
}

.product-id {
  display: block;
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
}

.product-subtotal {
  color: #111827;
  font-weight: 600;
}

.quantity {
  min-width: 52px;
  height: 52px;
  background: #5b0606;
  color: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}
</style>
