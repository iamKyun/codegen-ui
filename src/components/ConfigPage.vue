<template>
  <n-layout has-sider bordered content-style="height: calc(100vh - 140px)">
    <n-layout-sider bordered
                    :native-scrollbar="false"
                    content-class="field-container"
                    content-style="width: 240px;padding-right:20px;">
      <draggable
          class="dragArea list-group"
          :list="attrs"
          :group="{ name: 'people', pull: 'clone', put: false }"
          @change="log"
          item-key="id"
      >
        <template #item="{ element }">
          <div class="field-item">
            {{ element.attrName }}
          </div>
        </template>
      </draggable>
    </n-layout-sider>
    <n-layout-content content-style="padding:0 20px;">
      <n-tabs
          class="card-tabs"
          default-value="table"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
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
          <draggable
              :list="searchForm"
              group="{ name: 'attributes', pull: false, put: true }"
              class="search-form"
              item-key="id"
          >
            <template #item="{ element }">
              <div class="search-item">
                <span v-if="element">{{ element.attrName }}</span>
              </div>
            </template>
          </draggable>
        </n-tab-pane>
        <n-tab-pane name="form" tab="表单配置">
        </n-tab-pane>
      </n-tabs>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import {NButton, NIcon} from 'naive-ui'
import {Add, Cog} from '@vicons/ionicons5'
import axios from 'axios'
import {toCamelCase, uuidv4} from '@/utils/StringUtils.js'
import draggable from 'vuedraggable'

const modelValue = defineModel()
const attrs = ref([])
const searchForm = ref([
  {id: uuidv4(), attrName: 'id1'},
  {id: uuidv4(), attrName: 'id2'},
  {id: uuidv4(), attrName: 'id3'},
  {id: uuidv4(), attrName: 'id4'}])

const log = (event) => {
  console.log(log)
}
onMounted(async() => {
  const res = await axios.get('/api/columns', {params: {tableName: modelValue.value.tableName}})
  const columns = res.data
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
})
</script>

<style scoped>
.field-item {
  height: 40px;
  line-height: 40px;
  border: 1px solid #eee;
  margin-bottom: 5px;
  padding: 0 5px;
  cursor: move;
}

.search-form {

}

.search-item {
  display: inline-block;
  width: 100px;
  border: 1px solid #ccc;
  margin: 3px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
