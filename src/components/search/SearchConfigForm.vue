<template>
  <n-form
      ref="formRef"
      :key="formValue.id"
      :model="formValue"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
  >
    <n-form-item path="columnName" label="对应字段">
      <n-input v-model:value="formValue.columnName" disabled />
    </n-form-item>

    <n-form-item path="attrName" label="属性名">
      <n-input v-model:value="formValue.attrName" />
    </n-form-item>

    <n-form-item path="label" label="标签名">
      <n-input v-model:value="formValue.label" />
    </n-form-item>

    <n-form-item path="displayFull" label="占据整行">
      <n-switch v-model:value="formValue.displayFull" :default-value="false">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>

    <n-form-item path="type" label="类型">
      <n-select v-model:value="formValue.type" :options="options" />
    </n-form-item>

    <n-form-item path="fuzzySearch" label="模糊搜索" v-if="formValue.type==='input'">
      <n-switch v-model:value="formValue.fuzzySearch" :default-value="true">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>

    <n-form-item path="rangeSearch" label="范围搜索" v-if="['date','number'].includes(formValue.type)">
      <n-switch v-model:value="formValue.rangeSearch" :default-value="true">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>


    <n-form-item path="dictCode" v-if="['select','radio'].includes(formValue.type)">
      <template #label>
        <label-with-tooltip label="字典编码" tooltip="就是数据字典" />
      </template>
      <n-input v-model:value="formValue.dictCode" />
    </n-form-item>

    <n-form-item path="selectOptions" v-if="['select','radio'].includes(formValue.type)">
      <template #label>
        <label-with-tooltip label="选项" tooltip="使用了字典的话就不用填这个了" />
      </template>
      <n-dynamic-input
          v-model:value="formValue.options"
          preset="pair"
          key-placeholder="key"
          value-placeholder="value"
      />
    </n-form-item>
  </n-form>
</template>

<script setup>

import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'

const formValue = defineModel()

const options = [
  {label: '文本', value: 'input'},
  {label: '数字', value: 'number'},
  {label: '日期', value: 'date'},
  {label: '单选按钮', value: 'radio'},
  {label: '下拉选择', value: 'select'},
]

const rules = {}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
