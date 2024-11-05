<template>
  <n-flex :wrap="false">
    <n-card class="attr-config">
      <template #header>
        <div>待选属性</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-tag>{{ configs.general.tableName }}</n-tag>
          </template>
          表名
        </n-tooltip>
      </template>
      <template #header-extra>
        <n-button size="small" type="primary" @click="()=>handleConfigAttr(null)">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          添加字段
        </n-button>
      </template>
      <n-scrollbar style="max-height: calc(100vh - 200px);padding-right: 16px;">
        <draggable
            :list="attrs"
            :group="{ name: 'main', pull: 'clone', put: false }"
            :clone="clone"
            item-key="id"
        >
          <template #item="{ element }">
            <div class="field-item">
              <n-flex justify="space-between" align="center">
                <n-space align="center">
                  <n-tooltip>
                    <template #trigger>
                      <n-flex align="center">
                        <n-icon size="large" style="cursor: help;">
                          <DocumentTextOutline />
                        </n-icon>
                      </n-flex>
                    </template>
                    {{ element.attrComment }}
                  </n-tooltip>
                  <span>{{ element.attrName }}</span>
                </n-space>
                <n-space justify="center" align="center">
                  <n-popconfirm
                      @positive-click="handleRemoveAttr(element.id)"
                      v-if="element.from === 'add'"
                  >
                    <template #trigger>
                      <n-button text type="error">
                        <template #icon>
                          <n-icon>
                            <Trash />
                          </n-icon>
                        </template>
                      </n-button>
                    </template>
                    确认删除？
                  </n-popconfirm>

                  <n-button text type="warning" @click="()=>handleConfigAttr(element)">
                    <template #icon>
                      <n-icon>
                        <CreateOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-space>
              </n-flex>
            </div>
          </template>
        </draggable>
      </n-scrollbar>
    </n-card>
    <n-tabs
        class="flex-1"
        default-value="table"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <template #suffix>
        <n-space>
          <n-button type="primary" @click="addSubTableShow=true">
            <template #icon>
              <n-icon>
                <Add />
              </n-icon>
            </template>
            增加子表
          </n-button>
          <n-button type="info" @click="config('general',null)">
            <template #icon>
              <n-icon>
                <Cog />
              </n-icon>
            </template>
            通用配置
          </n-button>
        </n-space>
      </template>
      <n-tab-pane name="table" tab="列表配置">
        <n-scrollbar style="max-height: calc(100vh - 200px);">
          <n-flex>
            <n-card title="搜索条件">
              <draggable
                  class="flex flex-wrap"
                  v-model="configs.search"
                  group="main"
                  :component-data="{ tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                  @start="drag = true"
                  @end="drag = false"
                  :animation="200"
                  :disabled="false"
                  ghostClass="ghost"
                  item-key="id"
                  @change="(evt)=>onCloneAttr('search', evt)"
              >
                <template #item="{ element }">
                  <search-drag-item :element="element"
                                    config-type="search"
                                    :editing-id="editingId"
                                    @config="config('search',element)"
                                    @remove="handleRemoveConfig('search',element.id)" />
                </template>
              </draggable>
            </n-card>
            <n-space class="table-config-header">
              <n-button disabled type="info">新增</n-button>
              <n-button disabled type="error">批量删除</n-button>
            </n-space>
            <n-scrollbar x-scrollable style="max-width: calc(100vw - 690px)">
              <table class="table-config">
                <thead class="table-config-thead">
                <draggable v-model="configs.table"
                           group="main"
                           tag="tr"
                           :component-data="{ tag: 'tr', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                           @start="drag = true"
                           @end="drag = false"
                           :animation="200"
                           :disabled="false"
                           ghostClass="ghost"
                           item-key="id"
                           @change="(evt)=>onCloneAttr('table',evt)"
                >
                  <template #header v-if="configs.general.isShowNum">
                    <th class="table-config-th num" scope="col">
                      <span>序号</span>
                    </th>
                  </template>
                  <template #item="{ element }">
                    <table-drag-item :element="element"
                                     config-type="table"
                                     :editing-id="editingId"
                                     @config="config('table',element)"
                                     @remove="handleRemoveConfig('table',element.id)" />
                  </template>
                  <template #footer>
                    <th class="table-config-th action" scope="col">
                      <span>操作</span>
                    </th>
                  </template>
                </draggable>
                </thead>
                <tbody>
                <tr class="table-config-tr" v-for="(item,index) in 1">
                  <td class="table-config-td" v-if="configs.general.isShowNum">{{ index + 1 }}</td>
                  <td class="table-config-td" v-for="header in configs.table" :key="header.id"> {{
                      header.label
                    }}内容
                  </td>
                  <td class="table-config-td">
                    <n-space>
                      <n-button text type="info" class="btn" disabled>
                        编辑
                      </n-button>
                      <n-button text type="error" class="btn" disabled>
                        删除
                      </n-button>
                    </n-space>
                  </td>
                </tr>
                </tbody>
              </table>
            </n-scrollbar>
            <n-pagination :page="1" :page-count="10" />
          </n-flex>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="form" tab="表单配置">
        <n-card content-style="padding: 0;">
          <n-scrollbar style="max-height: calc(100vh - 200px);">
            <draggable
                class="flex flex-wrap content-start pr-4 pt-5 min-h-52"
                v-model="configs.form"
                group="main"
                :component-data="{ tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                @start="drag = true"
                @end="drag = false"
                :animation="200"
                :disabled="false"
                ghostClass="ghost"
                item-key="id"
                @change="(evt)=>onCloneAttr('form', evt)"
            >
              <template #item="{ element }">
                <form-drag-item :element="element"
                                config-type="form"
                                :editing-id="editingId"
                                @config="config('form',element)"
                                @remove="handleRemoveConfig('form',element.id)" />
              </template>
            </draggable>
            <div class="sub-table" v-for="(item,index) in configs.subTables" :key="index">
              <n-space class="table-config-header">
                <n-button disabled type="info">新增</n-button>
                <n-button disabled type="error">批量删除</n-button>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-tag>{{ item.general.tableName }}</n-tag>
                  </template>
                  表名
                </n-tooltip>
              </n-space>
              <n-scrollbar x-scrollable style="max-width: calc(100vw - 690px)">
                <table class="table-config">
                  <thead class="table-config-thead">
                  <draggable v-model="item.table"
                             :group="`subTable-${item.table}`"
                             tag="tr"
                             :component-data="{ tag: 'tr', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                             @start="drag = true"
                             @end="drag = false"
                             :animation="200"
                             :disabled="false"
                             ghostClass="ghost"
                             item-key="id"
                             @change="(evt)=>onCloneAttr('table',evt)"
                  >
                    <template #header v-if="item.general.isShowNum">
                      <th class="table-config-th num" scope="col">
                        <span>序号</span>
                      </th>
                    </template>
                    <template #item="{ element }">
                      <table-drag-item :element="element"
                                       config-type="table"
                                       :editing-id="editingId"
                                       @config="config('table',element)"
                                       @remove="handleRemoveConfig('table',element.id)" />
                    </template>
                    <template #footer>
                      <th class="table-config-th action" scope="col">
                        <span>操作</span>
                      </th>
                    </template>
                  </draggable>
                  </thead>
                  <tbody>
                  <tr class="table-config-tr" v-for="(_,index) in 1">
                    <td class="table-config-td" v-if="item.general.isShowNum">{{ index + 1 }}</td>
                    <td class="table-config-td" v-for="header in item.table" :key="header.id"> {{
                        header.label
                      }}内容
                    </td>
                    <td class="table-config-td">
                      <n-space>
                        <n-button text type="info" class="btn" disabled>
                          编辑
                        </n-button>
                        <n-button text type="error" class="btn" disabled>
                          删除
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </n-scrollbar>
              <div class="operations">
                <n-space>
                  <n-button text type="info" class="btn" @click="config('subTablesGeneral',item)">
                    配置
                  </n-button>
                  <n-button text type="error" class="btn" @click="handleRemoveConfig('subTables',item.id)">
                    删除
                  </n-button>
                </n-space>
              </div>
            </div>
          </n-scrollbar>
        </n-card>
      </n-tab-pane>
    </n-tabs>
    <n-card class="attr-config" :title="configTitle" ref="attrConfig">
      <n-scrollbar style="max-height: calc(100vh - 200px);padding-right: 16px;">
        <general-config-form ref="generalConfigForm"
                             v-show="configType === 'general' || configType === 'subTablesGeneral'"
                             :table-name="generalConfigTableName"
                             v-model="generalConfig"
                             :table-columns="tableColumns" />
        <search-config-form ref="searchConfigForm"
                            v-show="configType === 'search'"
                            v-model="searchConfig" />
        <table-config-form ref="tableConfigForm"
                           v-show="configType === 'table'"
                           v-model="tableConfig"
                           :table-columns="tableColumns" />
        <form-config-form ref="formConfigForm"
                          v-show="configType === 'form'"
                          v-model="formConfig"
                          :table-columns="tableColumns" />
      </n-scrollbar>
    </n-card>
  </n-flex>
  <attribute-config-drawer v-model="showAttrEdit" :attrs="attrs" :data="editAttr" @confirm="onEditAttrOk" />
  <add-sub-table-drawer v-model:show="addSubTableShow" v-model:tables="subTables" @confirm="addSubTable" />
</template>

<script setup>
import {NButton, NIcon, useMessage} from 'naive-ui'
import {Add, Cog, CreateOutline, DocumentTextOutline, Trash} from '@vicons/ionicons5'
import axios from 'axios'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import draggable from 'vuedraggable'
import GeneralConfigForm from '@/components/config/GeneralConfigForm.vue'
import FormConfigForm from '@/components/form/FormConfigForm.vue'
import TableConfigForm from '@/components/table/TableConfigForm.vue'
import SearchConfigForm from '@/components/search/SearchConfigForm.vue'
import AddSubTableDrawer from '@/components/config/AddSubTableDrawer.vue'
import AttributeConfigDrawer from '@/components/attr/AttributeConfigDrawer.vue'
import SearchDragItem from '@/components/search/SearchDragItem.vue'
import TableDragItem from '@/components/table/TableDragItem.vue'
import FormDragItem from '@/components/form/FormDragItem.vue'

const modelValue = defineModel()
const message = useMessage()
const drag = ref(false)

const tableColumns = ref([])
const attrs = ref([])

const configs = ref({
  general: {},
  search: [],
  table: [],
  form: [],
  subTables: [],
})

const generalConfigTableName = ref('')
const generalConfig = ref({})
const searchConfig = ref({})
const tableConfig = ref({})
const formConfig = ref({})

const configType = ref('general')
const editingId = ref(null)
const configTitle = computed(() => {
  switch (configType.value) {
    case 'general':
      return '通用配置'
    case 'search':
      return '搜索项配置'
    case 'table':
      return '列表项配置'
    case 'form':
      return '表单项配置'
    case 'subTablesGeneral':
      return '子表通用配置'
  }
})

const config = (type, item) => {
  configType.value = type
  if (type === 'search') {
    searchConfig.value = item
  } else if (type === 'table') {
    tableConfig.value = item
  } else if (type === 'form') {
    formConfig.value = item
  } else if (type === 'subTablesGeneral') {
    generalConfig.value = item.general
    generalConfigTableName.value = item.general.tableName
  } else if (type === 'general') {
    generalConfig.value = configs.value.general
  }
  if (item) {
    editingId.value = item.id
  } else {
    editingId.value = null
  }
  console.log('config', type, item)
}

const onCloneAttr = (type, event) => {
  if (event.added && event.added.element) {
  }
  console.log(event)
}

const clone = (item) => {
  console.log(item)
  return {
    ...item,
    id: uuidv4(),
    label: item.attrComment,
  }
}

const showAttrEdit = ref(false)
const editAttr = ref(null)
const handleConfigAttr = (row) => {
  if (row) {
    editAttr.value = {...row}
  } else {
    editAttr.value = {
      from: 'add',
    }
  }
  showAttrEdit.value = true
}

const handleRemoveAttr = (id) => {
  const index = attrs.value.findIndex(item => item.id === id)
  attrs.value.splice(index, 1)
}

const onEditAttrOk = (attr) => {
  console.log(attr)
  if (!attr.id) {
    attrs.value.push({id: uuidv4(), ...attr})
  } else {
    const index = attrs.value.findIndex(item => item.id === attr.id)
    attrs.value.splice(index, 1, {...attr})
  }
}

const handleRemoveConfig = (type, id) => {
  const index = configs.value[type].findIndex(item => item.id === id)
  configs.value[type].splice(index, 1)
}

const subTables = ref([])
const addSubTableShow = ref(false)

const addSubTable = () => {
  console.log(subTables.value)
  configs.value.subTables = configs.value.subTables.filter(item => subTables.value.includes(item.tableName))
  subTables.value.forEach(table => {
    if (!configs.value.subTables.find(item => item.tableName === table)) {
      configs.value.subTables.push({
        id: uuidv4(),
        general: {
          tableName: table,
          isShowNum: true,
        },
        table: [],
        form: [],
      })
    }
  })
}
onMounted(async() => {
  const res = await axios.get('/api/columns', {params: {tableName: modelValue.value.tableName}})
  const columns = res.data
  tableColumns.value = [...columns]
  console.log(columns)
  attrs.value = columns.map(item => {
    return {
      id: uuidv4(),
      attrName: toCamelCase(item.columnName),
      columnName: item.columnName,
      attrComment: item.columnComment,
      javaType: item.javaType,
      from: 'table',
    }
  })

  configs.value = {
    general: {
      tableName: modelValue.value.tableName,
      isShowNum: true,
    },
    search: [],
    table: [],
    form: [],
    subTables: [],
  }
  generalConfig.value = configs.value.general

})
</script>

<style>
.field-item {
  height: 40px;
  line-height: 40px;
  border: 1px solid #eee;
  margin-bottom: 5px;
  padding: 0 5px;
  cursor: move;
}

.ghost {
  opacity: 0.2;
  background: #e0e0e0;
  border: 1px dot-dash #aaa;
}

.attr-config {
  width: 300px;
  flex-shrink: 0;
}

.table-config {
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  text-align: left;
  min-width: 100%;
}

.table-config-th .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  padding: 0 3px;
}

.table-config-th .operations {
  visibility: hidden;
}

.table-config-th:hover .operations {
  border: 1px dashed #ccc;
  border-bottom: none;
  visibility: visible;
}

.table-config-th.attr {
  cursor: move;
}

.table-config-th.num {
  width: 56px;
}

.table-config-th.action {
  width: 120px;
}

.table-config-thead {
  background-color: #89b8e8;
  color: white;
}

.table-config-th {
  padding: 12px;
  border: 1px solid #ddd;
  font-weight: bold;
  transition: background-color 0.3s;
  position: relative;
  min-width: 120px;
}

.table-config-th:hover {
  background-color: #89b8e8;
}

.table-config-th.editing {
  background-color: #9db8d3;
}

.table-config-td {
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  transition: background-color 0.3s;
}

.table-config-tr:nth-child(even) .table-config-td {
  background-color: #f3f3f3; /* 隔行背景色 */
}

.table-config-tr:hover .table-config-td {
  background-color: #f3f3f3;
}

.sub-table{
  margin: 15px 5px;
  padding: 5px;
  border: 1px dashed #ffff;
  position: relative;
  box-sizing: border-box;
}

.sub-table:hover {
  border: 1px dashed #ccc;
}

.sub-table .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  border: 1px dashed #ffff;
  padding: 0 3px;
}

.sub-table .operations {
  visibility: hidden;
}

.sub-table:hover .operations {
  border: 1px dashed #ccc;
  border-bottom-color: #ffff;
  visibility: visible;
}

.table-config-header {
  position: relative;
  top: 16px;
}

</style>
