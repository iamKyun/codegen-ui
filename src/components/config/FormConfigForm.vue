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

    <n-form-item path="selectOptions" label="选项" v-if="['select','radio'].includes(formValue.type)">
      <n-dynamic-input
          v-model:value="formValue.options"
          preset="pair"
          key-placeholder="key"
          value-placeholder="value"
      />
    </n-form-item>

    <n-form-item path="dictCode" label="字典编码" v-if="['dictSelect','dictRadio'].includes(formValue.type)">
      <n-input v-model:value="formValue.dictCode" />
    </n-form-item>

    <n-form-item path="attachmentRelateType" v-if="formValue.type === 'attachment'">
      <template #label>
        <label-with-tooltip label="关联类型" tooltip="附件表的relate_type，例如 WORK_DOC" />
      </template>
      <n-input v-model:value="formValue.attachmentRelateType" />
    </n-form-item>
    <n-form-item path="attachmentMaxSize" v-if="formValue.type === 'attachment'">
      <template #label>
        <label-with-tooltip label="最大文件数" tooltip="数字" />
      </template>
      <n-input-number v-model:value="formValue.attachmentMaxSize" />
    </n-form-item>
    <n-form-item path="attachmentAllowType" v-if="formValue.type === 'attachment'">
      <template #label>
        <label-with-tooltip label="允许的格式" tooltip="例如：.doc,.xls" />
      </template>
      <n-input v-model:value="formValue.attachmentAllowType" />
    </n-form-item>
  </n-form>
</template>

<script setup>

import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'

const formValue = defineModel()

const options = [
  {label: '文本框', value: 'input'},
  {label: '大文本框', value: 'textarea'},
  {label: '数字', value: 'number'},
  {label: '日期', value: 'date'},
  {label: '单选按钮', value: 'radio'},
  {label: '下拉选择', value: 'select'},
  {label: '字典单选按钮', value: 'dictRadio'},
  {label: '字典下拉选择', value: 'dictSelect'},
  {label: '文件上传', value: 'attachment'},
]

const rules = {}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
