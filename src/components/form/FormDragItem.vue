<template>
  <n-flex class="form-form-item w-full h-full"
          :class="{
                              'full': !!element.displayFull,
                              'editing': configType === 'form' && element.id===editingId,
                       }"
          @click="config"
  >
    <n-flex :wrap="false" align="start" class="w-full h-full content">
      <n-flex :wrap="false" align="center" justify="space-between"  class="w-20 h-full pt-1.5">
        <span>{{ element.label }}</span>
        <span> :</span>
      </n-flex>
      <div class="flex-1">
        <div v-if="element.type==='radio'" class="pt-1.5">
          <n-radio v-for="i in exampleOptions" :key="i.value" :value="i.value" disabled>
            {{ i.label }}
          </n-radio>
        </div>
        <n-select v-if="element.type==='select'"
                  value-field="key"
                  label-field="value"
                  placeholder="下拉选择"
                  disabled />
        <n-input v-if="['text','textarea','password'].includes(element.type)" :rows="2" :type="element.type" placeholder="输入" size="medium" disabled />
        <n-input-number v-if="element.type==='number'"
                        disabled
                        placeholder="数字输入" />
        <n-date-picker v-if="element.type==='date'"
                       disabled />
        <n-upload
            v-if="element.type==='attachment'"
            disabled
            :file-list="[{ id: 'url-test', name: '附件', url: 'https://www.baidu.com/', status: 'finished' }]"
        >
          <n-button>上传文件</n-button>
        </n-upload>
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
    <div class="overlay"></div>
  </n-flex>
</template>

<script setup>

import {NButton} from 'naive-ui'
import {exampleOptions} from '@/utils/Constants.js'

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
.form-form-item {
  flex: 0 0 calc(50% - 10px);
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  border: 1px dashed #ffff;
  position: relative;
}

.form-form-item .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  border: 1px dashed #ffff;
  padding: 0 3px;
}

.form-form-item .operations {
  visibility: hidden;
}

.form-form-item:hover .operations {
  border: 1px dashed #ccc;
  border-bottom-color: #ffff;
  visibility: visible;
}

.form-form-item:hover {
  border: 1px dashed #ccc;
}

.form-form-item.full {
  flex: 0 0 100%;
}

.form-form-item.editing {
  border: 1px dashed #d93636;
}

.content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0); /* 半透明蒙版 */
  pointer-events: auto;
}
</style>
