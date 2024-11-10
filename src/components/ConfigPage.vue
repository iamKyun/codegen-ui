<template>
  <n-flex :wrap="false">
    <n-card class="attr-config" title="可用组件">
      <n-scrollbar style="max-height: calc(100vh - 200px)">
        <n-collapse v-model:expanded-names="collapseValue">
          <n-collapse-item title="查询组件" name="1">
            <search-draggable-element />
          </n-collapse-item>
          <n-collapse-item title="表单组件" name="2">
            <form-draggable-element />
          </n-collapse-item>
        </n-collapse>
      </n-scrollbar>
    </n-card>
    <n-tabs
      class="flex-1"
      default-value="table"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      @update:value="handleTabChange"
    >
      <template #suffix>
        <n-space>
          <n-button type="primary" @click="addSubTableShow = true">
            <template #icon>
              <n-icon>
                <Add />
              </n-icon>
            </template>
            添加子表
          </n-button>
          <n-button type="info" @click="config('general')">
            <template #icon>
              <n-icon>
                <Cog />
              </n-icon>
            </template>
            主表配置
          </n-button>
        </n-space>
      </template>
      <n-tab-pane name="table" tab="列表配置">
        <n-scrollbar style="max-height: calc(100vh - 200px)">
          <n-flex>
            <n-card title="搜索条件">
              <draggable
                class="flex flex-wrap draggable-area"
                v-model="configs.search"
                group="search"
                :component-data="{
                  tag: 'ul',
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null,
                }"
                @start="drag = true"
                @end="drag = false"
                :animation="200"
                :disabled="false"
                ghostClass="ghost"
                item-key="id"
              >
                <template #item="{ element }">
                  <search-drag-item
                    :element="element"
                    config-type="search"
                    :editing-id="editingId"
                    @config="config('search', element)"
                    @remove="handleRemoveConfig('search', element.id)"
                  />
                </template>
              </draggable>
            </n-card>
            <n-space class="table-config-header" style="top: 26px">
              <n-button type="info" @click="handleAddAttr(configs.table)"
                >添加列</n-button
              >
            </n-space>
            <n-scrollbar
              x-scrollable
              class="pb-3"
              style="max-width: calc(100vw - 690px)"
            >
              <table class="table-config">
                <thead class="table-config-thead">
                  <draggable
                    v-model="configs.table"
                    group="table"
                    tag="tr"
                    :component-data="{
                      tag: 'tr',
                      type: 'transition-group',
                      name: !drag ? 'flip-list' : null,
                    }"
                    @start="drag = true"
                    @end="drag = false"
                    :animation="200"
                    :disabled="false"
                    ghostClass="ghost"
                    item-key="id"
                  >
                    <template
                      #header
                      v-if="configs.general.isShowNum !== false"
                    >
                      <th
                        class="table-config-th num"
                        :class="{ freeze: configs.general.isFixedNum }"
                        scope="col"
                      >
                        <span>序号</span>
                      </th>
                    </template>
                    <template #item="{ element }">
                      <table-drag-item
                        :element="element"
                        config-type="table"
                        :editing-id="editingId"
                        @config="config('table', element)"
                        @remove="handleRemoveConfig('table', element.id)"
                      />
                    </template>
                    <template #footer>
                      <th
                        class="table-config-th action"
                        :class="{ freeze: configs.general.isFixedAction }"
                        scope="col"
                      >
                        <span>操作</span>
                      </th>
                    </template>
                  </draggable>
                </thead>
                <tbody>
                  <tr class="table-config-tr" v-for="(item, index) in 1">
                    <td
                      class="table-config-td num"
                      :class="{ freeze: configs.general.isFixedNum }"
                      v-if="configs.general.isShowNum !== false"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      class="table-config-td"
                      v-for="header in configs.table"
                      :key="header.id"
                    >
                      {{ header.label }}内容
                    </td>
                    <td
                      class="table-config-td action"
                      :class="{ freeze: configs.general.isFixedAction }"
                    >
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
          <n-scrollbar style="max-height: calc(100vh - 200px)">
            <draggable
              class="flex flex-wrap content-start pr-4 pt-5 min-h-52"
              v-model="configs.form"
              group="form"
              :component-data="{
                tag: 'ul',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null,
              }"
              @start="drag = true"
              @end="drag = false"
              :animation="200"
              :disabled="false"
              ghostClass="ghost"
              item-key="id"
            >
              <template #item="{ element }">
                <form-drag-item
                  :element="element"
                  config-type="form"
                  :editing-id="editingId"
                  @config="config('form', element)"
                  @remove="handleRemoveConfig('form', element.id)"
                />
              </template>
            </draggable>
            <div
              class="sub-table"
              v-for="(item, index) in configs.subTables"
              :key="index"
              :class="{
                editing:
                  configType === 'subTablesGeneral' && editingId === item.id,
              }"
            >
              <n-space class="table-config-header" style="top: 18px">
                <n-button type="info" @click="handleAddAttr(item.table)"
                  >添加列</n-button
                >
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-tag size="small" :bordered="false" type="success" round>
                      {{ item.general.tableName }}
                    </n-tag>
                  </template>
                  表名[{{ item.general.tableComment }}]
                </n-tooltip>
              </n-space>
              <n-scrollbar
                x-scrollable
                class="pb-3"
                style="max-width: calc(100vw - 690px)"
              >
                <table class="table-config">
                  <thead class="table-config-thead">
                    <draggable
                      v-model="item.table"
                      :group="`subTable-${item.general.tableName}`"
                      tag="tr"
                      :component-data="{
                        tag: 'tr',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null,
                      }"
                      @start="drag = true"
                      @end="drag = false"
                      :animation="200"
                      :disabled="false"
                      ghostClass="ghost"
                      item-key="id"
                    >
                      <template #header v-if="item.general.isShowNum !== false">
                        <th
                          class="table-config-th num"
                          :class="{ freeze: item.general.isFixedNum }"
                          scope="col"
                        >
                          <span>序号</span>
                        </th>
                      </template>
                      <template #item="{ element }">
                        <table-drag-item
                          :element="element"
                          config-type="table"
                          :editing-id="editingId"
                          @config="
                            config(
                              'subTablesTable',
                              element,
                              item.general.tableName
                            )
                          "
                          @remove="handleRemoveConfig('table', element.id)"
                        />
                      </template>
                      <template #footer>
                        <th
                          class="table-config-th action"
                          :class="{ freeze: item.general.isFixedAction }"
                          scope="col"
                        >
                          <span>操作</span>
                        </th>
                      </template>
                    </draggable>
                  </thead>
                  <tbody>
                    <tr class="table-config-tr" v-for="(_, index) in 1">
                      <td
                        class="table-config-td"
                        :class="{ freeze: item.general.isFixedNum }"
                        v-if="item.general.isShowNum !== false"
                      >
                        {{ index + 1 }}
                      </td>
                      <td
                        class="table-config-td"
                        v-for="header in item.table"
                        :key="header.id"
                      >
                        {{ header.label }}内容
                      </td>
                      <td
                        class="table-config-td"
                        :class="{ freeze: item.general.isFixedAction }"
                      >
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
              <div class="table-operations">
                <n-space>
                  <n-button
                    text
                    type="info"
                    class="btn"
                    @click="
                      config('subTablesGeneral', item, item.general.tableName)
                    "
                  >
                    子表配置
                  </n-button>
                  <n-button
                    text
                    type="error"
                    class="btn"
                    @click="
                      handleRemoveConfig(
                        'subTablesTable',
                        item.id,
                        item.general.tableName
                      )
                    "
                  >
                    删除
                  </n-button>
                </n-space>
              </div>
            </div>
          </n-scrollbar>
        </n-card>
      </n-tab-pane>
      <n-tab-pane name="subform" tab="子表单配置" v-if="subTables.length > 0">
        <n-card content-style="padding: 0;">
          <div v-if="subTablesFormTableName">
            <div class="m-4 inline-block">
              <n-h4 class="my-2" prefix="bar">
                <n-text type="primary">
                  {{ subTablesFormTableName }}
                </n-text>
              </n-h4>
            </div>
            <n-scrollbar style="max-height: calc(100vh - 250px)">
              <draggable
                class="flex flex-wrap content-start pr-4 pt-5 min-h-52"
                v-model="subTablesForm"
                group="form"
                :component-data="{
                  tag: 'ul',
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null,
                }"
                @start="drag = true"
                @end="drag = false"
                :animation="200"
                :disabled="false"
                ghostClass="ghost"
                item-key="id"
              >
                <template #item="{ element }">
                  <form-drag-item
                    :element="element"
                    config-type="form"
                    :editing-id="editingId"
                    @config="config('subTablesForm', element)"
                    @remove="handleRemoveConfig('subTablesForm', element.id)"
                  />
                </template>
              </draggable>
            </n-scrollbar>
          </div>
          <n-alert v-else title="提示" type="info">
            在【表单配置】中的子表列表点击【子表配置】进行子表单配置
          </n-alert>
        </n-card>
      </n-tab-pane>
    </n-tabs>
    <general-config-form
      ref="generalConfigForm"
      v-show="configType === 'general' || configType === 'subTablesGeneral'"
      v-model="generalConfig"
      :config-type="configType"
      :table-name="editingTableName"
      :table-columns="tableColumns"
    />
    <search-config-form
      ref="searchConfigForm"
      v-show="configType === 'search'"
      v-model="searchConfig"
      :config-type="configType"
      :table-name="editingTableName"
      :table-columns="tableColumns"
    />
    <table-config-form
      ref="tableConfigForm"
      v-show="configType === 'table' || configType === 'subTablesTable'"
      v-model="tableConfig"
      :config-type="configType"
      :table-name="editingTableName"
      :table-columns="tableColumns"
    />
    <form-config-form
      ref="formConfigForm"
      v-show="configType === 'form' || configType === 'subTablesForm'"
      v-model="formConfig"
      :config-type="configType"
      :table-name="editingTableName"
      :table-columns="tableColumns"
    />
  </n-flex>
  <add-sub-table-drawer
    v-model:show="addSubTableShow"
    v-model:tables="subTables"
    @confirm="addSubTable"
  />
</template>

<script setup>
import { NButton, NIcon, useMessage } from "naive-ui";
import { Add, Cog } from "@vicons/ionicons5";
import { uuidv4 } from "@/utils/StringUtils.js";
import draggable from "vuedraggable";
import GeneralConfigForm from "@/components/config/GeneralConfigForm.vue";
import FormConfigForm from "@/components/form/FormConfigForm.vue";
import TableConfigForm from "@/components/table/TableConfigForm.vue";
import SearchConfigForm from "@/components/search/SearchConfigForm.vue";
import AddSubTableDrawer from "@/components/config/AddSubTableDrawer.vue";
import SearchDragItem from "@/components/search/SearchDragItem.vue";
import TableDragItem from "@/components/table/TableDragItem.vue";
import FormDragItem from "@/components/form/FormDragItem.vue";
import SearchDraggableElement from "@/components/element/SearchDraggableElement.vue";
import FormDraggableElement from "@/components/element/FormDraggableElement.vue";
import { getTableColumns } from "@/utils/Apis.js";

const configs = defineModel();
const drag = ref(false);

const editingTableName = ref();
const tableColumnsList = ref([]);
const tableColumns = ref([]);

const generalConfig = ref({});
const searchConfig = ref({});
const tableConfig = ref({});
const formConfig = ref({});

const configType = ref("general");
const editingId = ref(null);
const subTablesFormTableName = ref(null);
const subTablesForm = ref([]);
// 同步更改
watch(
  subTablesForm,
  (val) => {
    configs.value.subTables.find(
      (i) => i.general.tableName === subTablesFormTableName.value
    ).form = val;
  },
  { deep: true }
);
// 同步更改
watch(
  generalConfig,
  (val) => {
    if (configType.value === "general") {
      configs.value.general = val;
    } else if (configType.value === "subTablesGeneral") {
      const subTable = configs.value.subTables.find(
        (i) => i.general.tableName === subTablesFormTableName.value
      );
      if (subTable) {
        subTable.general = val;
      }
    }
  },
  { deep: true }
);

const config = (type, item = null, table = null) => {
  configType.value = type;
  if (type === "search") {
    searchConfig.value = item;
  } else if (type === "table" || type === "subTablesTable") {
    tableConfig.value = item;
  } else if (type === "form" || type === "subTablesForm") {
    formConfig.value = item;
  } else if (type === "subTablesGeneral") {
    generalConfig.value = item.general;
    subTablesForm.value = item.form;
    subTablesFormTableName.value = item.general.tableName;
  } else if (type === "general") {
    generalConfig.value = configs.value.general;
  }
  if (table) {
    editingTableName.value = table;
  } else {
    editingTableName.value = configs.value.general.tableName;
  }
  tableColumns.value = tableColumnsList.value.find(
    (i) => i.tableName === editingTableName.value
  ).columns;
  if (item) {
    editingId.value = item.id;
  } else {
    editingId.value = null;
  }
  console.log("config", type, item, editingId.value);
};

const handleRemoveConfig = (type, id, tableName = null) => {
  if (type === "subTablesTable") {
    const arr = configs.value.subTables.find(
      (t) => t.general.tableName === tableName
    ).table;
    const index = arr.findIndex((item) => item.id === id);
    arr.splice(index, 1);
  } else if (type === "subTablesForm") {
    const arr = configs.value.subTables.find(
      (t) => t.general.tableName === tableName
    ).form;
    const index = arr.findIndex((item) => item.id === id);
    arr.splice(index, 1);
  } else {
    const index = configs.value[type].findIndex((item) => item.id === id);
    configs.value[type].splice(index, 1);
  }
};

const subTables = ref([]);
const addSubTableShow = ref(false);

const addSubTable = () => {
  console.log(subTables.value);
  configs.value.subTables = configs.value.subTables.filter((item) =>
    subTables.value.includes(item.tableName)
  );
  tableColumnsList.value = tableColumnsList.value.filter(
    (item) => !subTables.value.includes(item.tableName)
  );
  subTables.value.forEach((table) => {
    if (!configs.value.subTables.find((item) => item.tableName === table)) {
      configs.value.subTables.push({
        id: uuidv4(),
        general: {
          tableName: table,
          isShowNum: true,
        },
        table: [],
        form: [],
      });
    }
    getTableColumns(table).then((res) => {
      const columns = res.data;
      tableColumnsList.value.push({ tableName: table, columns });
    });
  });
};

const handleAddAttr = (table) => {
  table.push({
    id: uuidv4(),
    type: "text",
    label: "属性名" + Math.floor(Math.random() * 1000),
    attrName: "attrName" + Math.floor(Math.random() * 1000),
  });
};

const collapseValue = ref(["1"]);
const handleTabChange = (tab) => {
  if (tab === "table") {
    collapseValue.value = ["1"];
  } else {
    collapseValue.value = ["2"];
  }
};

onMounted(() => {
  const tableName = configs.value.general.tableName;
  tableColumnsList.value = [];
  getTableColumns(tableName).then((res) => {
    tableColumnsList.value.push({
      tableName: tableName,
      columns: [...res.data],
    });
  });
  if (configs.value.subTables.length > 0) {
    configs.value.subTables.forEach((item) => {
      getTableColumns(item.general.tableName).then((res) => {
        tableColumnsList.value.push({
          tableName: item.general.tableName,
          columns: [...res.data],
        });
      });
    });
    subTables.value = configs.value.subTables.map(
      (item) => item.general.tableName
    );
  }
  editingTableName.value = tableName;
  generalConfig.value = configs.value.general;
});
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
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 25px;
  text-align: left;
  min-width: 100%;
  table-layout: fixed;
  outline: #ccc solid 1px;
}

.table-config tr,
.table-config td,
.table-config th {
  outline: #ddd solid 1px;
  border: 1px solid #ddd;
}
.table-config-th.num {
  width: 56px;
}

.table-config-th.action {
  width: 120px;
}

.table-config-th.freeze {
  background: #89b8e8;
}

.table-config-th.freeze,
.table-config-td.freeze {
  position: sticky;
  z-index: 2;
}

.table-config-th.num.freeze,
.table-config-td.num.freeze {
  left: 0;
}

.table-config-th.action.freeze,
.table-config-td.action.freeze {
  right: 0;
}

.table-config-thead {
  background-color: #89b8e8;
  color: white;
}

.table-config-th {
  padding: 12px;
  font-weight: bold;
  transition: background-color 0.3s;
  position: relative;
  min-width: 120px;
  z-index: 1;
}

.table-config-th:hover {
  background-color: #89b8e8;
}

.table-config-th.editing {
  background-color: #d897a3;
}

.table-config-td {
  padding: 12px;
  background-color: #ffffff;
  transition: background-color 0.3s;
  z-index: 98;
}

.table-config-tr:nth-child(even) .table-config-td {
  background-color: #f3f3f3; /* 隔行背景色 */
}

.table-config-tr:hover .table-config-td {
  background-color: #f3f3f3;
}

.sub-table {
  margin: 30px 5px;
  padding: 5px;
  border: 1px dashed #ffff;
  position: relative;
}

.sub-table.editing {
  border: 1px dashed #d897a3;
}

.sub-table:hover {
  border: 1px dashed #ccc;
}

.sub-table .table-operations {
  position: absolute;
  right: 0;
  top: 1px;
  transform: translateY(-100%);
  border: 1px dashed #ffff;
  padding: 0 3px;
}

.sub-table .table-operations {
  visibility: hidden;
}

.sub-table:hover .table-operations {
  border: 1px dashed #ccc;
  border-bottom-color: #ffff;
  visibility: visible;
}

.table-config-header {
  width: fit-content;
  position: relative;
  z-index: 100;
}

.draggable-area {
  min-height: 52px;
}
</style>
