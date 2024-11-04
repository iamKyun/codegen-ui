<template>
  <n-flex class="search-form-item w-full h-full"
          :class="{
                              'full': !!element.displayFull,
                              'editing': configType === 'search' && element.id===editingId,
                       }"
  >
    <n-flex :wrap="false" align="center" justify="flex-start" class="w-full h-full">
      <n-flex :wrap="false" align="center" justify="space-between"  class="w-20 h-full">
        <span>{{ element.label }}</span>
        <span> :</span>
      </n-flex>
      <div class="flex-1">
        <n-input v-if="element.type==='input'" placeholder="文本搜索" size="medium" disabled />
        <n-space v-if="element.type==='number' && !!element.rangeSearch" justify="center" :wrap="false">
          <n-input-number disabled placeholder="" />
          <span>~</span>
          <n-input-number disabled placeholder="" />
        </n-space>
        <n-input-number v-if="element.type==='number' && !element.rangeSearch"
                        disabled
                        placeholder="数字搜索" />
        <n-date-picker v-if="element.type==='date'"
                       disabled
                       :type="element.rangeSearch?'datetimerange':'date'" />
        <div v-if="element.type==='radio' || element.type==='dictRadio'">
          <n-radio v-for="i in exampleOptions" :key="i.value" :value="i.value" disabled>
            {{ i.label }}
          </n-radio>
        </div>
        <n-select v-if="element.type==='select' || element.type==='dictSelect'"
                  value-field="key"
                  label-field="value"
                  placeholder="下拉选择"
                  disabled />
      </div>
    </n-flex>
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
  </n-flex>
</template>

<script setup>

import {NButton} from 'naive-ui'

const props = defineProps({
  element: Object,
  configType: String,
  editingId: String,
})
const emit = defineEmits(['config', 'remove'])

const exampleOptions = [
  {
    label: '选项一',
    value: '1',
  },
  {
    label: '选项二',
    value: '2',
  },
]

function config() {
  emit('config')
}

function handleRemoveConfig() {
  emit('remove')
}
</script>

<style scoped>
.search-form-item {
  flex: 0 0 calc(50% - 10px);
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  cursor: move;
  border: 1px dashed #ffff;
  position: relative;
}

.search-form-item .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  border: 1px dashed #ffff;
  padding: 0 3px;
}

.search-form-item .operations {
  visibility: hidden;
}

.search-form-item:hover .operations {
  border: 1px dashed #ccc;
  border-bottom-color: #ffff;
  visibility: visible;
}

.search-form-item:hover {
  border: 1px dashed #ccc;
}

.search-form-item.full {
  flex: 0 0 100%;
}

.search-form-item.editing {
  border: 1px dashed #d93636;
}
</style>
