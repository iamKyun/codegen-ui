<template>
  <n-card class="attr-config">
    <template #header>
      <config-header title="搜索项配置" :config-type="configType" :table-name="tableName" />
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
            <label-with-tooltip label="对应字段" tooltip="搜索项对应的字段，用来关联生成查询SQL所用字段" />
          </template>
          <n-select filterable v-model:value="formValue.columnName"
                    :options="columns"
                    clearable
                    @update:value="handleUpdateColumnName" />
        </n-form-item>

        <n-form-item path="attrName">
          <template #label>
            <label-with-tooltip label="属性名" tooltip="查询时的查询参数名" />
          </template>
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
          <n-select v-model:value="formValue.type" :options="searchElements" />
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
    </n-scrollbar>
  </n-card>
</template>

<script setup>

import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'
import {searchElements} from '@/utils/Constants.js'
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
