<template>
  <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="120"
      require-mark-placement="right-hanging"
  >
    <n-form-item label="属性名" path="attrName">
      <n-input v-model:value="formValue.attrName" />
    </n-form-item>
    <n-form-item label="备注" path="attrComment">
      <n-input v-model:value="formValue.attrComment" />
    </n-form-item>
    <n-form-item path="isShowOnTable">
      <template #label>
        <label-with-tooltip label="列表展示" tooltip="是否在列表页面展示该字段" />
      </template>
      <n-switch v-model:value="formValue.isShowOnTable">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>
    <n-form-item path="isShowOnView">
      <template #label>
        <label-with-tooltip label="查看展示" tooltip="是否在查看表单时展示该字段" />
      </template>
      <n-switch v-model:value="formValue.isShowOnView">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>
    <n-form-item path="isShowOnEdit">
      <template #label>
        <label-with-tooltip label="编辑展示" tooltip="是否在编辑表单时展示该字段" />
      </template>
      <n-switch v-model:value="formValue.isShowOnEdit">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>
    <n-form-item path="dataType">
      <template #label>
        <label-with-tooltip label="数据类型" tooltip="前端列表和表单的字段录入和展示方式" />
      </template>
      <n-select v-model:value="formValue.dataType" :options="options" />
    </n-form-item>

    <n-divider>查询配置</n-divider>
    <n-form-item path="isSearch">
      <template #label>
        <label-with-tooltip label="用于搜索" tooltip="是否用于列表搜索" />
      </template>
      <n-switch v-model:value="formValue.isSearch">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>
    <n-form-item path="isFuzzySearch" v-if="['input','textarea'].includes(formValue.dataType)">
      <template #label>
        <label-with-tooltip label="模糊搜索" tooltip="like '%**%'" />
      </template>
      <n-switch v-model:value="formValue.isFuzzySearch" :default-value="true">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>

    <n-divider>表单配置</n-divider>
    <n-form-item path="isRequired">
      <template #label>
        <label-with-tooltip label="必填项" tooltip="编辑表单时必填" />
      </template>
      <n-switch v-model:value="formValue.isRequired">
        <template #checked>是</template>
        <template #unchecked>否</template>
      </n-switch>
    </n-form-item>

    <n-form-item path="maxLength" v-if="['input','textarea'].includes(formValue.dataType)">
      <template #label>
        <label-with-tooltip label="最大长度" tooltip="最大长度" />
      </template>
      <n-input-number v-model:value="formValue.maxLength" />
    </n-form-item>

    <n-form-item path="dictCode" v-if="formValue.dataType === 'dictSelect'">
      <template #label>
        <label-with-tooltip label="字典编码" tooltip="自动渲染字典编码" />
      </template>
      <n-input v-model:value="formValue.dictCode" />
    </n-form-item>

    <n-form-item path="dateFormat" v-if="formValue.dataType === 'date'">
      <template #label>
        <label-with-tooltip label="日期格式" tooltip="例如YYYY-MM-DD HH:hh:ss" />
      </template>
      <n-input v-model:value="formValue.dateFormat" />
    </n-form-item>
    <n-form-item path="selectOptions" v-if="formValue.dataType === 'select'">
      <template #label>
        <label-with-tooltip label="下拉选项" tooltip="键值对选项" />
      </template>
      <n-dynamic-input
          v-model:value="formValue.selectOptions"
          preset="pair"
          key-placeholder="value"
          value-placeholder="label"
      />
    </n-form-item>

    <n-form-item path="attachmentRelateType" v-if="formValue.dataType === 'attachment'">
      <template #label>
        <label-with-tooltip label="关联类型" tooltip="附件表的relate_type，例如 WORK_DOC" />
      </template>
      <n-input v-model:value="formValue.attachmentRelateType" />
    </n-form-item>
    <n-form-item path="attachmentMaxSize" v-if="formValue.dataType === 'attachment'">
      <template #label>
        <label-with-tooltip label="最大文件数" tooltip="数字" />
      </template>
      <n-input-number v-model:value="formValue.attachmentMaxSize" />
    </n-form-item>
    <n-form-item path="attachmentAllowType" v-if="formValue.dataType === 'attachment'">
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
import {options} from '@/utils/Constants.js'

const formValue = defineModel()
const props = defineProps({data: Array})
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
