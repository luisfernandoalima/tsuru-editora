<template>
  <div class="page_container">
    <slot></slot>
  </div>
</template>
<style>
.page_container {
  background-color: var(--main);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 15px;
}
</style>
