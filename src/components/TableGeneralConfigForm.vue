<template>
  <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="140"
      require-mark-placement="right-hanging"
  >
    <n-form-item label="表名" path="tableName">
      <n-input v-model:value="formValue.tableName" disabled />
    </n-form-item>
    <n-form-item path="isUseCommonGroup">
      <template #label>
        <label-with-tooltip label="使用通用分组" tooltip="是否使用通用分组，在列表页面展示分组" />
      </template>
      <n-switch v-model:value="formValue.isUseCommonGroup">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>

    <n-form-item path="groupCode" v-if="formValue.isUseCommonGroup">
      <template #label>
        <label-with-tooltip label="通用分组Code" tooltip="分组表的Code，用来标识不同业务，如 MODEL_GROUP" />
      </template>
      <n-input v-model:value="formValue.dictCode" />
    </n-form-item>
    <n-form-item path="relateField" v-if="formValue.isUseCommonGroup">
      <template #label>
        <label-with-tooltip label="分组关联字段" tooltip="表里用来关联分组ID的字段" />
      </template>
      <n-select filterable v-model:value="formValue.groupRelateId" :options="options" />
    </n-form-item>
    <n-form-item path="isLogicDel">
      <template #label>
        <label-with-tooltip label="是否逻辑删除" tooltip="在实体类上加上@TableLogic，要有对应的表字段才会生效" />
      </template>
      <n-switch v-model:value="formValue.isLogicDel">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>
    <n-form-item path="logicDelField" v-if="formValue.isLogicDel">
      <template #label>
        <label-with-tooltip label="逻辑删除字段" tooltip="表里用来关联逻辑删除字段的字段" />
      </template>
      <n-select filterable v-model:value="formValue.logicDelField" :options="options" />
    </n-form-item>
  </n-form>
</template>

<script setup>
import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'

const formValue = defineModel()
const props = defineProps({data: Array})
const options = computed(() => props.data.filter(item => item.from === 'table').
    map(item => ({label: `${item.columnName}(${item.attrComment})`, value: item.columnName})))
const rules = {
  attrName: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('需要属性名')
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        return new Error('不符合规则，只能字母和数字，首位不能是数字')
      } else if (props.data.some(item => item.attrName === value && item.key !== formValue.value.key)) {
        return new Error('属性名重复')
      }
      return true
    },
    trigger: ['blur', 'input'],
  },
  attrComment: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入',
  },
  dictCode: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入',
  },
}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
