<script setup>
import { Icon } from "@iconify/vue";

const { user } = useAuth();
</script>

<template>
  <div class="main_body">
    <header class="flex items-center justify-start gap-10 flex-col">
      <div>
        <NuxtLink to="/" class="flex justify-center items-center">
          <img src="/img/tsuru-small.png" alt="Tsuru" />
        </NuxtLink>
      </div>
      <nav>
        <ul>
          <li>
            <NuxtLink to="/"
              ><Icon
                icon="material-symbols:home-outline-rounded"
              />Home</NuxtLink
            >
          </li>
          <li v-if="user?.funcao === 1">
            <NuxtLink to="/estoque">
              <Icon icon="fluent:box-24-regular" />Estoque</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/ordem-de-impressao">
              <Icon icon="mingcute:paper-2-line" />Ordens Impre.</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/operacoes"
              ><Icon icon="fluent:arrow-sort-16-filled" />Operações</NuxtLink
            >
          </li>
          <li v-if="user?.funcao === 1">
            <NuxtLink to="/colaborador"
              ><Icon icon="ri:team-line" />Colaboradores</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/perfil"
              ><Icon icon="lucide:circle-user" />Perfil</NuxtLink
            >
          </li>
        </ul>
      </nav>
    </header>
    <main class="main_area">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main_body {
  flex: 1;
  display: grid;
  grid-template-columns: 15% 85%;
  grid-template-rows: 100vh;
  height: 100vh;
  background-color: var(--main_secundary);
}

header {
  padding: 0.3em;
  box-shadow: var(--shadow);
  border-radius: 0px 15px 15px 0px;
  background-color: var(--main);
  height: 100%;
  overflow: hidden;
}

.main_area {
  padding: 15px 50px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}
nav {
  display: block;
  width: 100%;

  a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px;
    width: 100%;
    color: var(--fucus_text);
    font-weight: 400;
    font-size: 1.5em;
    transition: 0.3s;
  }

  ul {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px 15px;
    width: 100%;

    li {
      width: 100%;
      border-bottom: 1px solid #141414;
      transition: 0.5s;

      &:hover {
        background-color: #5b0606;
        border-radius: 10px;

        a {
          color: #fff;
        }
      }
    }
  }
}
</style>
