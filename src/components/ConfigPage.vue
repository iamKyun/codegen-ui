<template>
  <n-layout has-sider bordered>
    <n-layout-sider bordered
                    :native-scrollbar="false"
                    content-class="field-container"
                    content-style="width: 240px;">
      <n-card title="待选属性" size="small" :bordered="false">
        <n-scrollbar style="max-height: calc(100vh - 200px);padding-right: 16px;">
          <draggable
              :list="attrs"
              :group="{ name: 'attr', pull: 'clone', put: false }"
              :clone="clone"
              @change="log"
              item-key="id"
          >
            <template #item="{ element }">
              <div class="field-item">
                <n-flex justify="space-between" align="center">
                  <span>{{ element.attrName }}</span>
                  <div>
                    <n-tooltip v-if="element.from === 'add'">
                      <template #trigger>
                        <n-button text size="large">
                          <template #icon>
                            <n-icon>
                              <TrashBinOutline />
                            </n-icon>
                          </template>
                          来自手动添加
                        </n-button>
                      </template>
                    </n-tooltip>

                    <n-tooltip>
                      <template #trigger>
                        <n-icon size="large" style="cursor: help;">
                          <DocumentTextOutline />
                        </n-icon>
                      </template>
                      <span>{{ element.attrComment }}</span>
                    </n-tooltip>
                  </div>
                </n-flex>
              </div>
            </template>
          </draggable>
        </n-scrollbar>
      </n-card>
    </n-layout-sider>
    <n-layout-content content-style="padding:0 20px;">
      <n-flex :wrap="false">
        <n-tabs
          :group="{ name: 'attr', pull: 'false', put: true }"
          class="card-tabs"
          default-value="table"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <template #suffix>
            <n-space>
              <n-button type="primary">
                <template #icon>
                  <n-icon>
                    <Add />
                  </n-icon>
                </template>
                添加字段
              </n-button>
              <n-button type="info">
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
            <div class="page-config">
              <n-card title="搜索条件">
                <draggable
                    class="search-form"
                    v-model="searchForm"
                    group="attr"
                    :component-data="{ tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                    @start="drag = true"
                    @end="drag = false"
                    :animation="200"
                    :disabled="false"
                    ghostClass="ghost"
                    item-key="id"
                >
                  <template #item="{ element }">
                    <div class="search-form-item" :class="{'full': !!element.displayFull}">
                      <div>
                        <span>{{ element.attrName }} :</span>
                        <div class="operations">
                          <n-space>
                            <n-button text type="info" class="btn" @click="config('search',element)">
                              配置
                            </n-button>
                            <n-button text type="error" class="btn">
                              删除
                            </n-button>
                          </n-space>
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>
              </n-card>

              <table class="table-config">
                <thead class="table-config-thead">
                <draggable v-model="table"
                           group="attr"
                           tag="tr"
                           :component-data="{ tag: 'tr', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                           @start="drag = true"
                           @end="drag = false"
                           :animation="200"
                           :disabled="false"
                           ghostClass="ghost"
                           item-key="id">
                  <template #header v-if="configs.general.isShowNum">
                    <th class="table-config-th num" scope="col">
                      <span>序号</span>
                    </th>
                  </template>
                  <template #item="{ element }">
                    <th class="table-config-th attr" scope="col">
                      <div>
                        <span>{{ element.attrName }}</span>
                        <div class="operations">
                          <n-space>
                            <n-button text type="info" class="btn" @click="config('table',element)">
                              配置
                            </n-button>
                            <n-button text type="error" class="btn">
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
                <tr class="table-config-tr" v-for="(item,index) in 3">
                  <td class="table-config-td" v-if="configs.general.isShowNum">{{ index + 1 }}</td>
                  <td class="table-config-td" v-for="header in table" :key="header.id"> {{ header.attrName }}内容</td>
                  <td class="table-config-td">
                    <n-space>
                      <n-button text type="info" class="btn">
                        编辑
                      </n-button>
                      <n-button text type="error" class="btn">
                        删除
                      </n-button>
                    </n-space>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </n-tab-pane>
          <n-tab-pane name="form" tab="表单配置">
          </n-tab-pane>
        </n-tabs>
        <div class="attr-config">
          <n-card title="通用配置" v-show="configType === 'general'">
            <general-config ref="generalConfig" v-model="configs.general" :table-columns="tableColumns" />
          </n-card>
          <n-card title="搜索项配置" v-show="configType === 'search'">
            <search-config ref="searchConfig" v-model="configs.search" :table-columns="tableColumns" />
          </n-card>
          <n-card title="列表项配置" v-show="configType === 'table'">
            <table-config ref="tableConfig" v-model="configs.table" :table-columns="tableColumns" />
          </n-card>
          <n-card title="表单项配置" v-show="configType === 'form'">
            <form-config ref="formConfig" v-model="configs.form" :table-columns="tableColumns" />
          </n-card>
        </div>
      </n-flex>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import {NButton, NIcon} from 'naive-ui'
import {Add, Cog, DocumentTextOutline, TrashBinOutline} from '@vicons/ionicons5'
import axios from 'axios'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import draggable from 'vuedraggable'
import GeneralConfig from '@/components/GeneralConfig.vue'
import FormConfig from '@/components/FormConfig.vue'
import TableConfig from '@/components/TableConfig.vue'
import SearchConfig from '@/components/SearchConfig.vue'

const modelValue = defineModel()

const drag = ref(false)

const tableColumns = ref([])
const attrs = ref([])
const configs = ref({
  general: {},
})

const configType = ref('general')

const searchForm = ref([
  {id: uuidv4(), attrName: 'id1'},
  {id: uuidv4(), attrName: 'id2'},
  {id: uuidv4(), attrName: 'id3'},
  {id: uuidv4(), attrName: 'id4'}])

const table = ref([
  {id: uuidv4(), attrName: 'id1'},
  {id: uuidv4(), attrName: 'id2'}])

const config = (type, item) => {
  configType.value = type
}

const log = (event) => {
  console.log(event)
}

const clone = (item) => {
  console.log({...item})
  return {
    ...item,
  }
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

.search-form {
  display: flex;
  flex-wrap: wrap;
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
  flex: 0 0 100%; /* 每个元素占一半宽度 */
}

.page-config {
  flex: 1;
}

.attr-config {
  flex: 0 0 400px;
}

.table-config {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  text-align: left;
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
  width: 40px;
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
}

.table-config-th:hover {
  background-color: #89b8e8;
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
