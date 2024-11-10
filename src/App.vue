<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <Index />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import Index from "./components/Index.vue";
import { zhCN, dateZhCN } from "naive-ui";
</script>

<style scoped></style>
