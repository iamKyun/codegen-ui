<template>
  <n-h2 class="mb-2">{{ title }}</n-h2>
  <n-space align="baseline">
    <n-h4 class="my-2" prefix="bar">
      <n-text type="primary">
        {{ tableName }}
      </n-text>
    </n-h4>
    <n-tag size="small" :bordered="false" type="success" round>
      {{ configType.startsWith("subTables") ? "子表" : "主表" }}
    </n-tag>
  </n-space>
</template>

<script setup>
const props = defineProps({
  title: String,
  tableName: String,
  configType: String,
});
</script>

<style scoped></style>
