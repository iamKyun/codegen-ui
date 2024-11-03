<template>
  <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
  >
    <n-form-item path="attrName" label="属性名">
      <n-input v-model:value="formValue.attrName" />
    </n-form-item>

    <n-form-item path="comment" label="备注">
      <n-input v-model:value="formValue.comment" />
    </n-form-item>

    <n-form-item path="from" label="来源">
      <n-select v-model:value="formValue.from" :options="fromOptions" disabled />
    </n-form-item>

    <n-form-item path="columnName" label="对应表字段">
      <n-input v-model:value="formValue.columnName" disabled />
    </n-form-item>
  </n-form>
</template>

<script setup>

const formValue = defineModel()

const props = defineProps({
  attrs: Array,
})

const fromOptions = [
  {label: '数据库', value: 'table'},
  {label: '手工添加', value: 'add'},
]
const rules = {
  attrName: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入属性名')
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        return new Error('不符合规则，只能字母和数字，首位不能是数字')
      } else if (props.attrs.some(item => item.attrName === value && item.id !== formValue.value.id)) {
        return new Error('属性名重复')
      }
      return true
    },
    trigger: ['blur', 'input'],
  },
  comment: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入备注',
  },
}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
