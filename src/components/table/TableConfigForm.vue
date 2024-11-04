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

    <n-form-item path="type" label="类型">
      <n-select v-model:value="formValue.type" :options="options" />
    </n-form-item>

    <n-form-item path="width" label="宽度">
      <n-input v-model:value="formValue.width" />
    </n-form-item>

    <n-form-item path="dictCode" label="字典编码" v-if="formValue.type === 'dict'">
      <n-input v-model:value="formValue.dictCode" />
    </n-form-item>

    <n-form-item path="dateFormat" label="日期格式" v-if="formValue.type === 'date'">
      <n-input v-model:value="formValue.dateFormat" default-value="YYYY-MM-DD" />
    </n-form-item>
  </n-form>
</template>

<script setup>

const formValue = defineModel()

const options = [
  {label: '文本', value: 'string'},
  {label: '日期', value: 'date'},
  {label: '字典', value: 'dict'},
]

const rules = {}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
