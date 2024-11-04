<template>
  <n-drawer v-model:show="show" :width="502" placement="left" :mask-closable="false">
    <n-drawer-content title="选择子表">
      <select-table v-model="selectedTables" :multiple="true" />
      <template #footer>
        <n-space>
          <n-button @click="show = false">取消</n-button>
          <n-button type="primary" @click="confirm">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import {NButton} from 'naive-ui'
import SelectTable from '@/components/SelectTable.vue'

const show = defineModel('show')
const tables = defineModel('tables')
const emit = defineEmits(['confirm'])
const selectedTables = ref([])
watch(show,(val)=>{
  if (val) {
    selectedTables.value = [...tables.value]
  }
})
const confirm = () => {
  tables.value = selectedTables.value
  show.value = false
  emit('confirm')
}
</script>

<style scoped>

</style>
