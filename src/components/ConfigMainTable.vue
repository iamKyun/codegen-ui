<template>
  <n-data-table
      ref="table"
      :columns="columns"
      :data="data"
      :pagination="false"
      max-height="calc(100vh - 280px)"
      :scroll-x="1300"
  />
  <n-float-button position="absolute"
                  top="14px"
                  right="30px"
                  shape="square"
                  type="primary"
                  width="140"
                  @click="handleAdd">
    <n-flex align="center" :wrap="false">
      <n-icon>
        <Add />
      </n-icon>
      <span style="font-size: 14px;">
        添加虚拟字段
      </span>
    </n-flex>
  </n-float-button>
  <n-drawer :show="showConfig" :width="700" @update:show="onConfigUpdateShow">
    <n-drawer-content :title="`配置 [ ${formValue.attrName??''} ] ( ${formValue.attrComment??''} )`" closable>
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

        <n-divider>特殊配置</n-divider>
        <n-form-item path="isLogicDel">
          <template #label>
            <label-with-tooltip label="逻辑删除" tooltip="在实体类上加上@TableLogic，要有对应的表字段才会生效" />
          </template>
          <n-switch v-model:value="formValue.isShowOnTable">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <template #footer v-if="formValue.from === 'add'">
        <n-popconfirm @positive-click="()=>handleDelete(formValue.key)">
          <template #trigger>
            <n-button type="error">删除此项</n-button>
          </template>
          确认执行该操作吗
        </n-popconfirm>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="jsx">
import axios from 'axios'
import {NButton, NIcon, NPopconfirm, NSwitch, useMessage} from 'naive-ui'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import {Add} from '@vicons/ionicons5'
import {createSwitchForTable, createTitleWithTooltip} from '@/utils/VueUtils.jsx'
import LabelWithTooltip from '@/components/tool/LabelWithTooltip.vue'

const props = defineProps({tableName: String})

const columns = [
  {
    title: '属性名',
    key: 'attrName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '对应字段',
    key: 'columnName',
    render(row) {
      return row.columnName ? row.columnName : '虚拟字段'
    },
  },
  {
    title: '备注',
    key: 'attrComment',
  },
  {
    title: createTitleWithTooltip('数据类型', '前端列表和表单的字段录入和展示方式'),
    key: 'dataType',
    render(row) {
      return optionMap[row.dataType]
    },
  },
  {
    title: createTitleWithTooltip('Java类型', '根据数据库字段类型生成，不可更改'),
    key: 'javaType',
  },
  {
    title: createTitleWithTooltip('列表展示', '是否在列表页面展示该字段'),
    key: 'isShowOnTable',
    render(row) {
      return createSwitchForTable(row, 'isShowOnTable')
    },
  },
  {
    title: createTitleWithTooltip('用于搜索', '是否在列表搜索条件展示该字段'),
    key: 'isSearch',
    render(row) {
      return createSwitchForTable(row, 'isSearch')
    },
  },
  {
    title: createTitleWithTooltip('查看展示', '是否在查看表单时展示该字段'),
    key: 'isShowOnView',
    render(row) {
      return createSwitchForTable(row, 'isShowOnView')
    },
  },
  {
    title: createTitleWithTooltip('编辑展示', '是否在编辑表单时展示该字段'),
    key: 'isShowOnEdit',
    render(row) {
      return createSwitchForTable(row, 'isShowOnEdit')
    },
  },
  {
    title: createTitleWithTooltip('逻辑删除字段', '在实体类上加上@TableLogic'),
    key: 'isLogicDel',
    render(row) {
      return createSwitchForTable(row, 'isLogicDel')
    },
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 160,
    render(row) {
      return <div>
        <n-button size="small" type="primary" onClick={() => handleConfig(row)}>配置</n-button>
        {
          row.from !== 'table' ?
              <n-popconfirm onPositive-click={() => handleDelete(row.key)}>
                {{
                  trigger: () => <n-button size="small" type="error" style="margin-left:4px;">删除</n-button>,
                  default: () => '确认执行该操作吗？',
                }}
              </n-popconfirm>
              : null
        }
      </div>
    },
  },
]
const rules = {
  attrName: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('需要属性名')
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        return new Error('不符合规则，只能字母和数字，首位不能是数字')
      } else if (data.value.some(item => item.attrName === value && item.key !== formValue.value.key)) {
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
const options = [
  {label: '文本框', value: 'input'},
  {label: '大文本框', value: 'textarea'},
  {label: '数字输入', value: 'number'},
  {label: '布尔值（开关）', value: 'boolean'},
  {label: '日期选择', value: 'date'},
  {label: '下拉选择', value: 'select'},
  {label: '字典下拉选择', value: 'dictSelect'},
  {label: '附件上传', value: 'attachment'},
]

const optionMap = options.reduce((map, option) => {
  map[option.value] = option.label
  return map
}, {})

const showConfig = ref(false)
const formValue = ref(null)
const handleConfig = (row) => {
  formValue.value = row
  showConfig.value = true
}
const handleDelete = (rowKey) => {
  data.value = data.value.filter(item => item.key !== rowKey)
  if (showConfig.value) {
    showConfig.value = false
  }
}

const formRef = ref()
const message = useMessage()
const onConfigUpdateShow = (show) => {
  if (!show) {
    //check form
    formRef.value.validate((errors) => {
      if (!errors) {
        showConfig.value = false
      } else {
        console.log(errors)
        message.error('请按规则完成配置')
      }
    })
  }
}
const handleAdd = () => {
  const newRow = {
    key: uuidv4(),
    from: 'add',
  }
  data.value.push(newRow)
  formValue.value = newRow
  showConfig.value = true
}

const data = ref([])

onMounted(async() => {
  const res = await axios.get('/api/columns', {params: {tableName: props.tableName}})
  const columns = res.data
  console.log(columns)
  data.value = columns.map(item => {
    return {
      key: uuidv4(),
      attrName: toCamelCase(item.columnName),
      columnName: item.columnName,
      attrComment: item.columnComment,
      javaType: item.javaType,
      from: 'table',
    }
  })
})
</script>

<style scoped>

</style>
