<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <Home />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import Home from './components/Home.vue'
import { zhCN, dateZhCN } from 'naive-ui'

</script>

<style scoped>
</style>
