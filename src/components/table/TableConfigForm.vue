<template>
  <n-card class="attr-config">
    <template #header>
      <config-header
        title="列表项配置"
        :config-type="configType"
        :table-name="tableName"
      />
    </template>
    <n-scrollbar style="max-height: calc(100vh - 250px); padding-right: 16px">
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
            <label-with-tooltip
              label="对应字段"
              tooltip="列表项对应的字段，用来关联生成查询SQL所用字段"
            />
          </template>
          <n-select
            filterable
            v-model:value="formValue.columnName"
            :options="columns"
            clearable
            @update:value="handleUpdateColumnName"
          />
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
          <n-select v-model:value="formValue.type" :options="tableElements" />
        </n-form-item>

        <n-form-item
          path="dictCode"
          label="字典编码"
          v-if="formValue.type === 'dict'"
        >
          <n-input v-model:value="formValue.dictCode" />
        </n-form-item>

        <n-form-item
          path="dateFormat"
          label="日期格式"
          v-if="formValue.type === 'date'"
        >
          <n-input
            v-model:value="formValue.dateFormat"
            default-value="YYYY-MM-DD HH:mm:ss"
          />
        </n-form-item>

        <n-form-item path="width" label="宽度">
          <n-input v-model:value="formValue.width" />
        </n-form-item>
      </n-form>
    </n-scrollbar>
  </n-card>
</template>

<script setup>
import LabelWithTooltip from "@/components/tool/LabelWithTooltip.vue";
import { tableElements } from "@/utils/Constants.js";
import { toCamelCase } from "@/utils/StringUtils.js";
import ConfigHeader from "@/components/common/ConfigHeader.vue";

const props = defineProps({
  tableColumns: Array,
  configType: String,
  tableName: String,
});
const columns = computed(() =>
  props.tableColumns.map((item) => ({
    label: `${item.columnName}(${item.columnComment})`,
    value: item.columnName,
    comment: item.columnComment,
    dataType: item.dataType,
    dataLength: item.dataLength,
    key: item.key,
  }))
);
const formValue = defineModel();

const rules = {
  attrName: {
    required: true,
    message: "属性名不能为空",
  },
  label: {
    required: true,
    message: "标签名不能为空",
  },
};

const formRef = ref();
const validate = (callback) => formRef.value.validate(callback);
defineExpose({ validate });

const handleUpdateColumnName = (value, option) => {
  formValue.value.attrName = toCamelCase(value);
  formValue.value.label = option.comment;
  formValue.value.columnDataType = option.dataType;
  formValue.value.columnKey = option.key;
};
</script>

<style scoped></style>
