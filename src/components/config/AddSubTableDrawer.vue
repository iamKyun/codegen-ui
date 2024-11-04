<template>
  <n-drawer v-model:show="model" :width="502" placement="left" :mask-closable="false">
    <n-drawer-content title="选择子表">
      <select-table v-model="selectedTables" :multiple="true" />
      <template #footer>
        <n-space>
          <n-button @click="model = false">取消</n-button>
          <n-button type="primary" @click="confirm">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import {NButton} from 'naive-ui'
import SelectTable from '@/components/SelectTable.vue'

const model = defineModel()
const emit = defineEmits(['confirm'])
const selectedTables = ref([])

const confirm = () => {
  model.value = false
  emit('confirm', selectedTables.value)
}
</script>

<style scoped>

</style>
