<template>
  <n-h2 class="mb-2">{{ title }}</n-h2>
  <n-space align="baseline">
    <n-tooltip trigger="hover" placement="left">
      <template #trigger>
        <n-h4 class="my-2" prefix="bar">
          <n-text type="primary">
            {{ tableName }}
          </n-text>
        </n-h4>
      </template>
      正在编辑的表[{{ tableComment }}]
    </n-tooltip>
    <n-tag size="small" :bordered="false" type="success" round>
      {{ configType.startsWith('subTables') ? '子表' : '主表' }}
    </n-tag>
  </n-space>
</template>

<script setup>
import {getTableComment} from '@/utils/Apis.js'

const props = defineProps({
  title: String,
  tableName: String,
  configType: String,
})

const tableComment = computed(() => {
  return getTableComment(props.tableName)
})
</script>

<style scoped>

</style>
