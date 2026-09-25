<script setup>
import Container from "~/components/layout/Container.vue";
import SearchBar from "~/components/layout/SearchBar.vue";
import Input from "~/components/ui/forms/Input.vue";
import Select from "~/components/ui/forms/Select.vue";
import Button from "~/components/ui/utils/Button.vue";

import CommonInput from "~/components/ui/forms/CommonInput.vue";
import ItemOperationCard from "~/components/layout/ItemOperationCard.vue";
import { Icon } from "@iconify/vue";
import { useAuthToken } from "~/composables/useAuthToken";
import CommonSelect from "~/components/ui/forms/CommonSelect.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const { getToken } = useAuthToken();

const api = useApi();
const toast = useToast();
const token = getToken();

const router = useRouter();

const pesquisa = ref();
const parceiroPesquisa = ref();

const carrinho = ref([]);
const empresas = ref([
  {
    id: "",
    cnpj: "",
    nome: "",
  },
]);

const cupomFiscal = ref();
const creditosUtilizados = ref(0);
const tipoPagamento = ref();

const id = ref("");
const nome = ref("");
const cnpj = ref("");
const email = ref("");
const enderecos = ref([]);
const enderecoEntrega = ref();
const creditos = ref(0);

const produtos = ref([]);

const valorTotal = computed(() =>
  carrinho.value.reduce(
    (total, item) => total + item.quantidade * Number(item.produto._preco),
    0,
  ),
);

const pesquisarParceiros = async () => {
  try {
    const response = await api(
      `/partner/search?pesquisa=${parceiroPesquisa.value}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    empresas.value = response.parceiros;
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
};

const consultarParceiro = async (empresaID) => {
  try {
    id.value = empresaID;

    const response = await api(`/partner/view/${id.value}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    let parceiro = response.parceiro;

    nome.value = parceiro.nome;
    cnpj.value = parceiro.cnpj;
    email.value = parceiro.email;
    enderecos.value = formatAddress(parceiro.enderecos);
  } catch (error) {
    console.log(error);
    toast.error({ title: "Erro!", message: error.message });
  }
  return;
};

const pesquisarProduto = async () => {
  try {
    const response = await api(`/product/search?pesquisa=${pesquisa.value}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    produtos.value = response.produtos;
    console.log(produtos.value);
  } catch (error) {
    console.error(error);
  }
};

const buscarProduto = async (id) => {
  try {
    const response = await api(`/product/find-product/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const produtoExiste = carrinho.value.find(
      (item) => item.produto._id === response.produto._id,
    );

    if (produtoExiste) {
      produtoExiste.quantidade++;
    } else {
      carrinho.value.push({
        produto: response.produto,
        quantidade: 1,
      });
    }

    console.log(carrinho.value);
  } catch (err) {
    toast.error(err);
  }
};

const removerItem = (id) => {
  carrinho.value = carrinho.value.filter((item) => item.produto._id !== id);
};

const finalizarVenda = async () => {
  try {
    const data = {
      saida: {
        numero_cupom_fiscal: cupomFiscal.value,
        valor_total: valorTotal.value,
        valor_final: valorTotal.value - creditosUtilizados.value / 100,
        credito_usado: creditosUtilizados.value,
        metodo_pagamento: tipoPagamento.value,
        endereco_id: enderecoEntrega.value,
      },

      produtos: carrinho.value.map((item) => ({
        produto_id: item.produto._id,
        quantidade: item.quantidade,
      })),
    };

    const response = await api("/outgoing/register", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: data,
    });

    toast.success({ title: "Sucesso!", message: response.message });
    router.push("/operacoes/saida");
  } catch (err) {
    toast.error({ title: "Erro!", message: err.data?.message || err.message });
  }
};

onMounted(() => {
  pesquisarParceiros();
  pesquisarProduto();
});
</script>

<template>
  <NuxtLayout>
    <Container>
      <div class="parceiros_div">
        <div class="lista__parceiros">
          <SearchBar
            placeholder="Insira o CNPJ ou nome do Parceiro"
            :handleForms="pesquisarParceiros"
            :value="parceiroPesquisa"
            @update:value="parceiroPesquisa = $event"
          />
          <div class="lista__parceiros__div">
            <ul class="lista__itens">
              <li
                v-for="(empresa, index) in empresas"
                v-if="empresas"
                :key="empresa.cnpj"
                class="item"
                @click="consultarParceiro(empresa.id)"
              >
                <div class="item__avatar" :style="index" aria-hidden="true">
                  {{ empresa.nome[0] }}
                </div>
                <div class="item__texto">
                  <p class="item__nome">{{ empresa.nome }}</p>
                  <p class="item__cnpj">{{ empresa.cnpj }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="form__parceiros__div">
          <div class="form__input__div">
            <Input
              :label="true"
              text="Cupom fiscal"
              placeholder="cupom fiscal"
              name="cupomFiscal"
              v-model="cupomFiscal"
            />

            <Input
              :label="true"
              text="Nome da Empresa"
              placeholder="Nome da Empresa"
              name="nome"
              :model-value="nome"
              disabled
            />
            <Input
              :label="true"
              text="CNPJ da Empresa"
              placeholder="00.000.000/0000-00"
              name="cnpj"
              :model-value="cnpj"
              disabled
            />
            <Input
              :label="true"
              text="E-mail da Empresa"
              placeholder="contato@empresa.com"
              name="email"
              :model-value="email"
              disabled
            />
          </div>
          <Select
            text="Endereço:"
            name="endereco"
            :options="enderecos"
            placeholder="Escolha o endereço de entrega"
            v-model="enderecoEntrega"
          />

          <div class="form__input__div">
            <Input
              :label="true"
              :text="`Cupom fiscal (Disponíveis: ${creditos})`"
              placeholder="cupom fiscal"
              name="cupomFiscal"
              :model-value="creditosUtilizados"
            />
            <Select
              text="Método de Pagamento:"
              name="pegamento"
              :options="metodosPagamento"
              placeholder="Escolha a forma de pagamento"
              v-model="tipoPagamento"
            />
          </div>
        </div>
      </div>
    </Container>
    <Container customClass="obras_div">
      <div class="obras_area">
        <div class="obras_adicionadas">
          <h2>Lista de Obras</h2>

          <SearchBar
            placeholder="Insira o título ou ISBN do produto"
            :handleForms="pesquisarProduto"
            :value="pesquisa"
            @update:value="pesquisa = $event"
          />

          <div class="flex gap-3 search_obras">
            <img
              v-for="produto in produtos"
              :src="`http://localhost:8081${produto._imgCapa}`"
              :alt="produto._titulo"
              @click="buscarProduto(produto._id)"
            />
          </div>
        </div>
        <div class="obras_container">
          <div class="obras_cadastradas">
            <h2>Obras Selecionadas</h2>
            <div class="flex flex-col gap-y-3">
              <ItemOperationCard
                v-for="value in carrinho"
                :key="value.produto._id"
                :item="value"
                @remover="removerItem"
              />
            </div>
          </div>

          <div>
            <p class="mb-1 text-xl">
              Valor total:
              <span class="font-semibold">{{
                formatCurrency(valorTotal)
              }}</span>
            </p>
            <p class="mb-1 text-2xl">
              Valor Final
              <span class="font-semibold">{{
                formatCurrency(valorTotal - creditosUtilizados)
              }}</span>
            </p>
            <Button
              text="Salvar"
              className="primary"
              :width="100"
              :click="finalizarVenda"
            ></Button>
          </div>
        </div>
      </div>
    </Container>
  </NuxtLayout>
</template>

<style scoped>
.lista__parceiros {
  display: flex;
  flex-direction: column;
}

.lista__parceiros__div {
  height: 100%;
  overflow: auto;
}

.parceiros_div {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  height: 100%;
}

.lista__itens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100px;
  width: 100%;

  li {
    width: 98%;
  }
}

.item {
  display: grid;
  grid-template-columns: 12% 88%;
  gap: 0px 10px;
  padding: 3px;
  border: 2px solid #000;
  border-radius: 8px;
  background-color: var(--main);
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: rgb(211, 211, 211);
  }

  .item__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--main);
    background-color: var(--secondary);
    border-radius: 8px;
    font-size: 1.8em;
    font-weight: bold;
  }

  .item__nome {
    font-size: 1.4em;
    font-weight: 600;
  }
}

.form__parceiros__div {
  height: 100%;
  overflow: auto;
}

.form__input__div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
}

/* Novo Design */
.obras_div {
  flex: 1;
  margin-top: 15px;
}

.obras_container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.obras_area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  height: 100%;
  width: 100%;

  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }

  .search_obras {
    display: flex;
    flex: 1;
    overflow: auto;
    img {
      width: 150px;
      cursor: pointer;
    }
  }
}

.obras_cadastradas {
  flex: 1;
}
</style>
