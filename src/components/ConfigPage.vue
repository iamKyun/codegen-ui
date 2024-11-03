<template>
  <n-flex :wrap="false">
    <n-card class="attr-config" title="待选属性">
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
            :group="{ name: 'attr', pull: 'clone', put: false }"
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
        :group="{ name: 'attr', pull: 'false', put: true }"
        class="flex-1"
        default-value="table"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <template #suffix>
        <n-space>
          <n-button type="primary" @click="()=>config('general',null)">
            <template #icon>
              <n-icon>
                <Add />
              </n-icon>
            </template>
            增加子表
          </n-button>
          <n-button type="info" @click="()=>config('general',null)">
            <template #icon>
              <n-icon>
                <Cog />
              </n-icon>
            </template>
            基础配置
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
                  group="attr"
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
                  <n-flex class="search-form-item w-full h-full"
                          :class="{
                              'full': !!element.displayFull,
                              'editing': configType === 'search' && element.id===editingId,
                       }"
                  >
                    <n-flex :wrap="false" align="center" justify="flex-start" class="w-full h-full">
                      <n-flex :wrap="false" align="center" justify="space-between"  class="w-20 h-full">
                        <span>{{ element.label }}</span>
                        <span> :</span>
                      </n-flex>
                      <div class="flex-1">
                        <n-input v-if="element.type==='input'" placeholder="文本搜索" size="medium" disabled />
                        <n-space v-if="element.type==='number' && !!element.rangeSearch" justify="center" :wrap="false">
                          <n-input-number disabled placeholder="" />
                          <span>~</span>
                          <n-input-number disabled placeholder="" />
                        </n-space>
                        <n-input-number v-if="element.type==='number' && !element.rangeSearch"
                                        disabled
                                        placeholder="数字搜索" />
                        <n-date-picker v-if="element.type==='date'"
                                       disabled
                                       :type="element.rangeSearch?'datetimerange':'date'" />
                        <div v-if="element.type==='radio' || element.type==='dictRadio'">
                          <n-radio v-for="i in exampleOptions" :key="i.value" :value="i.value" disabled>
                            {{ i.label }}
                          </n-radio>
                        </div>
                        <n-select v-if="element.type==='select' || element.type==='dictSelect'"
                                  value-field="key"
                                  label-field="value"
                                  placeholder="下拉选择"
                                  disabled />
                      </div>
                    </n-flex>
                    <div class="operations">
                      <n-space>
                        <n-button text type="info" class="btn" @click="config('search',element)">
                          配置
                        </n-button>
                        <n-button text type="error" class="btn" @click="handleRemoveConfig('search',element.id)">
                          删除
                        </n-button>
                      </n-space>
                    </div>
                  </n-flex>
                </template>
              </draggable>
            </n-card>
            <n-scrollbar x-scrollable style="max-width: calc(100vw - 690px)">
              <table class="table-config">
                <thead class="table-config-thead">
                <draggable v-model="configs.table"
                           group="attr"
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
                    <th class="table-config-th attr"
                        :class="{ 'editing': configType === 'table' && element.id===editingId, }"
                        scope="col">
                      <div>
                        <span>{{ element.label }}</span>
                        <div class="operations">
                          <n-space>
                            <n-button text type="info" class="btn" @click="config('table',element)">
                              配置
                            </n-button>
                            <n-button text type="error" class="btn" @click="handleRemoveConfig('table',element.id)">
                              删除
                            </n-button>
                          </n-space>
                        </div>
                      </div>
                    </th>
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
                class="flex flex-wrap content-start pr-4 pt-5 min-h-96"
                v-model="configs.form"
                group="attr"
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
                <n-flex class="search-form-item w-full h-full"
                        :class="{
                              'full': !!element.displayFull,
                              'editing': configType === 'form' && element.id===editingId,
                       }"
                >
                  <n-flex :wrap="false" align="start" class="w-full h-full">
                    <n-flex :wrap="false" align="center" justify="space-between"  class="w-20 h-full pt-1.5">
                      <span>{{ element.label }}</span>
                      <span> :</span>
                    </n-flex>
                    <div class="flex-1">
                      <n-input v-if="['input','textarea'].includes(element.type)" :type="element.type==='input'?'input':'textarea'" placeholder="文本输入" size="medium" disabled />
                      <n-input-number v-if="element.type==='number'"
                                      disabled
                                      placeholder="数字输入" />
                      <n-date-picker v-if="element.type==='date'"
                                     disabled />
                      <div v-if="element.type==='radio' || element.type==='dictRadio'" class="pt-1.5">
                        <n-radio v-for="i in exampleOptions" :key="i.value" :value="i.value" disabled>
                          {{ i.label }}
                        </n-radio>
                      </div>
                      <n-select v-if="element.type==='select' || element.type==='dictSelect'"
                                value-field="key"
                                label-field="value"
                                placeholder="下拉选择"
                                disabled />
                      <n-upload
                          v-if="element.type==='attachment'"
                          disabled
                          :file-list="[{ id: 'url-test', name: '附件', url: 'https://www.baidu.com/', status: 'finished' }]"
                      >
                        <n-button>上传文件</n-button>
                      </n-upload>
                    </div>
                  </n-flex>
                  <div class="operations">
                    <n-space>
                      <n-button text type="info" class="btn" @click="config('form',element)">
                        配置
                      </n-button>
                      <n-button text type="error" class="btn" @click="handleRemoveConfig('form',element.id)">
                        删除
                      </n-button>
                    </n-space>
                  </div>
                </n-flex>
              </template>
            </draggable>
          </n-scrollbar>
        </n-card>
      </n-tab-pane>
    </n-tabs>
    <n-card class="attr-config" :title="configTitle" ref="attrConfig">
      <n-scrollbar style="max-height: calc(100vh - 200px);padding-right: 16px;">
        <general-config-form ref="generalConfigForm"
                             v-show="configType === 'general'"
                             v-model="configs.general"
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
  <n-drawer v-model:show="showAttrEdit" :width="502" placement="left" :mask-closable="false">
    <n-drawer-content title="属性配置">
      <attribute-config-form ref="attributeConfig"
                             v-model="editAttr"
                             :attrs="attrs" />

      <template #footer>
        <n-space>
          <n-button @click="showAttrEdit = false">取消</n-button>
          <n-button type="primary" @click="onEditAttrOk">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import {NButton, NIcon, useMessage} from 'naive-ui'
import {Add, Cog, CreateOutline, DocumentTextOutline, Trash} from '@vicons/ionicons5'
import axios from 'axios'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import draggable from 'vuedraggable'
import GeneralConfigForm from '@/components/config/GeneralConfigForm.vue'
import FormConfigForm from '@/components/config/FormConfigForm.vue'
import TableConfigForm from '@/components/config/TableConfigForm.vue'
import SearchConfigForm from '@/components/config/SearchConfigForm.vue'
import AttributeConfigForm from '@/components/config/AttributeConfigForm.vue'

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
})

const searchConfig = ref({})
const tableConfig = ref({})
const formConfig = ref({})
const exampleOptions = [
  {value: '1', label: '选项一'},
  {value: '2', label: '选项二'},
]

const configType = ref('general')
const editingId = ref(null)
const configTitle = computed(() => {
  switch (configType.value) {
    case 'general':
      return '基础配置'
    case 'search':
      return '搜索项配置'
    case 'table':
      return '列表项配置'
    case 'form':
      return '表单项配置'
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

const attributeConfig = ref()
const showAttrEdit = ref(false)
const editAttr = ref(null)
const handleConfigAttr = (row) => {
  showAttrEdit.value = true
  if (row) {
    editAttr.value = {...row}
  } else {
    editAttr.value = {
      from: 'add',
    }
  }
}

const handleRemoveAttr = (id) => {
  const index = attrs.value.findIndex(item => item.id === id)
  attrs.value.splice(index, 1)
}

const onEditAttrOk = () => {
  attributeConfig.value.validate((errors) => {
    console.log(editAttr.value)
    if (!errors) {
      if (!editAttr.value.id) {
        attrs.value.push({id: uuidv4(), ...editAttr.value})
      } else {
        const index = attrs.value.findIndex(item => item.id === editAttr.value.id)
        attrs.value.splice(index, 1, {...editAttr.value})
      }
      showAttrEdit.value = false
    } else {
      console.log(errors)
      message.error('请按规则完成配置')
    }
  })
}

const handleRemoveConfig = (type, id) => {
  const index = configs.value[type].findIndex(item => item.id === id)
  configs.value[type].search.splice(index, 1)
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
      isShowAction: true,
    },
    search: [],
    table: [],
    form: [],
  }
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

.search-form-item {
  flex: 0 0 calc(50% - 10px);
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  cursor: move;
  border: 1px dashed #ffff;
  position: relative;
}

.search-form-item .operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  border: 1px dashed #ffff;
  padding: 0 3px;
}

.search-form-item .operations {
  visibility: hidden;
}

.search-form-item:hover .operations {
  border: 1px dashed #ccc;
  border-bottom-color: #ffff;
  visibility: visible;
}

.search-form-item:hover {
  border: 1px dashed #ccc;
}

.search-form-item.full {
  flex: 0 0 100%;
}

.search-form-item.editing {
  border: 1px dashed #d93636;
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
  margin-top: 30px;
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

</style>
