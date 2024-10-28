<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button type="info" @click="handlegeneralConfig">
        <template #icon>
          <n-icon>
            <Cog />
          </n-icon>
        </template>
        通用配置
      </n-button>
      <n-button type="primary" @click="handleAdd">
        <template #icon>
          <n-icon>
            <Add />
          </n-icon>
        </template>
        添加虚拟字段
      </n-button>
    </n-space>
    <n-data-table
        ref="table"
        :columns="columns"
        :data="data"
        :pagination="false"
        max-height="calc(100vh - 280px)"
        :scroll-x="1300"
    />
  </n-space>

  <n-drawer :show="showConfig" :width="700" @update:show="onConfigUpdateShow">
    <n-drawer-content :title="`配置 [ ${formValue.attrName??''} ] ( ${formValue.attrComment??''} )`" closable>
      <config-form ref="formRef" v-model="formValue" :data="data" />
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

  <n-drawer v-model:show="showGeneralConfig" :width="700">
    <n-drawer-content title="通用配置" closable>
      <table-general-config-form ref="tableFormRef" v-model="modelValue.general" :data="data" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="jsx">
import axios from 'axios'
import {NButton, NIcon, NPopconfirm, useMessage} from 'naive-ui'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import {Add, Cog} from '@vicons/ionicons5'
import {createSwitchForTable, createTitleWithTooltip} from '@/utils/VueUtils.jsx'
import ConfigForm from '@/components/ConfigForm.vue'
import {options} from '@/utils/Constants.js'
import TableGeneralConfigForm from '@/components/TableGeneralConfigForm.vue'

const modelValue = defineModel()
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

const optionMap = options.reduce((map, option) => {
  map[option.value] = option.label
  return map
}, {})

const showConfig = ref(false)
const showGeneralConfig = ref(false)

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

const handlegeneralConfig = () => {
  showGeneralConfig.value = true
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
  const res = await axios.get('/api/columns', {params: {tableName: modelValue.value.general.tableName}})
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
  modelValue.value.data = data.value
})
</script>

<style scoped>

</style>
