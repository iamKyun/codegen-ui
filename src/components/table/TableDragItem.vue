<template>
  <th class="table-config-th attr"
      :class="{ 'editing': configType === 'table' && element.id===editingId, }"
      scope="col"
      @click="config">
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
.table-config-th {
  cursor: pointer;
}

.table-config-th .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  padding: 0 3px;
}

.table-config-th .operations {
  visibility: hidden;
}

.table-config-th:hover .operations {
  border: 1px dashed #ccc;
  border-bottom: none;
  visibility: visible;
}
</style>
