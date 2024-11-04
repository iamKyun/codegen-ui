<template>
  <th class="table-config-th attr"
      :class="{ 'editing': configType === 'table' && element.id===editingId, }"
      scope="col">
    <div>
      <span>{{ element.label }}</span>
      <div class="operations">
        <n-space>
          <n-button text type="info" class="btn" @click="config">
            配置
          </n-button>
          <n-button text type="error" class="btn" @click="handleRemoveConfig">
            删除
          </n-button>
        </n-space>
      </div>
    </div>
  </th>
</template>

<script setup>

import {NButton} from 'naive-ui'

const props = defineProps({
  element: Object,
  configType: String,
  editingId: String,
})
const emit = defineEmits(['config', 'remove'])

function config() {
  emit('config')
}

function handleRemoveConfig() {
  emit('remove')
}
</script>

<style scoped>

</style>
