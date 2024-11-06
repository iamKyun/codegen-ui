<template>
  <n-card class="attr-config">
    <template #header>
      <config-header title="通用配置" :config-type="configType" :table-name="tableName" />
    </template>
    <n-scrollbar style="max-height: calc(100vh - 200px);padding-right: 16px;">
      <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="top"
          require-mark-placement="right-hanging"
          :key="tableName"
      >
        <n-form-item path="isShowNum">
          <template #label>
            <label-with-tooltip label="列表展示序号列" tooltip="列表展示序号列" />
          </template>
          <n-switch v-model:value="formValue.isShowNum" :default-value="true">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>

        <n-form-item path="foreignKey" v-if="configType === 'subTablesGeneral'">
          <template #label>
            <label-with-tooltip label="关联主表字段" tooltip="表里用来关联逻辑删除字段的字段" />
          </template>
          <n-select filterable v-model:value="formValue.foreignKey" :options="columns" />
        </n-form-item>

        <n-form-item path="isUseCommonGroup" v-if="configType === 'general'">
          <template #label>
            <label-with-tooltip label="使用通用分组" tooltip="是否使用通用分组，在列表页面展示分组" />
          </template>
          <n-switch v-model:value="formValue.isUseCommonGroup">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>

        <n-form-item path="groupCode" v-if="configType === 'general' && formValue.isUseCommonGroup">
          <template #label>
            <label-with-tooltip label="通用分组Code" tooltip="分组表的Code，用来标识不同业务，如 MODEL_GROUP" />
          </template>
          <n-input v-model:value="formValue.groupCode" />
        </n-form-item>

        <n-form-item path="groupRelateId" v-if="configType === 'general' && formValue.isUseCommonGroup">
          <template #label>
            <label-with-tooltip label="分组关联字段" tooltip="表里用来关联分组ID的字段" />
          </template>
          <n-select filterable v-model:value="formValue.groupRelateId" :options="columns" />
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
          <n-select filterable v-model:value="formValue.logicDelField" :options="columns" />
        </n-form-item>
      </n-form>
    </n-scrollbar>
  </n-card>
</template>

<script setup>
import {NSwitch} from 'naive-ui'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'
import ConfigHeader from '@/components/common/ConfigHeader.vue'

const formValue = defineModel()
const props = defineProps({tableColumns: Array, configType: String, tableName: String})
const columns = computed(() => props.tableColumns.map(
    item => ({label: `${item.columnName}(${item.columnComment})`, value: item.columnName})))

const rules = {}

const formRef = ref()
const validate = (callback) => formRef.value.validate(callback)
defineExpose({validate})
</script>

<style scoped>

</style>
