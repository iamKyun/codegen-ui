<template>
  <n-card class="attr-config">
    <template #header>
      <config-header title="表单项配置" :config-type="configType" :table-name="tableName" />
    </template>
    <n-scrollbar style="max-height: calc(100vh - 250px);padding-right: 16px;">
      <n-form
          ref="formRef"
          :key="formValue.id"
          :model="formValue"
          :rules="rules"
          label-placement="top"
          require-mark-placement="right-hanging"
      >
        <n-form-item path="columnName">
          <template #label>
            <label-with-tooltip label="对应字段"
                                tooltip="表单项对应的字段，不选择则认为是虚拟字段，不生成写入表的代码逻辑" />
          </template>
          <n-select filterable v-model:value="formValue.columnName"
                    :options="columns"
                    clearable
                    @update:value="handleUpdateColumnName" />
        </n-form-item>

        <n-form-item path="attrName">
          <template #label>
            <label-with-tooltip label="属性名" tooltip="JSON中的参数名" />
          </template>
          <n-input v-model:value="formValue.attrName" />
        </n-form-item>

        <n-form-item path="label" label="标签名">
          <n-input v-model:value="formValue.label" />
        </n-form-item>

        <n-form-item path="type" label="类型">
          <n-select v-model:value="formValue.type" :options="formElements" />
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
        <n-form-item path="displayFull" label="占据整行">
          <n-switch v-model:value="formValue.displayFull" :default-value="false">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </n-scrollbar>
  </n-card>
</template>

<script setup>

import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'
import {formElements} from '@/utils/Constants.js'
import {toCamelCase} from '@/utils/StringUtils.js'
import ConfigHeader from '@/components/common/ConfigHeader.vue'

const props = defineProps({tableColumns: Array, configType: String, tableName: String})
const columns = computed(() => props.tableColumns.map(item => ({label: `${item.columnName}(${item.columnComment})`, value: item.columnName,comment: item.columnComment})))
const formValue = defineModel()

const rules = {}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})

const handleUpdateColumnName = (value, option) => {
  formValue.value.attrName = toCamelCase(value)
  formValue.value.label = option.comment
}
</script>

<style scoped>

</style>
