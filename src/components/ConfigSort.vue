<template>
  <n-flex justify="space-around" size="large">
    <div>
      <h3>搜索排序</h3>
      <draggable
          v-model="modelValue.search"
          group="search"
          item-key="attrName">
        <template #item="{element}">
          <div class="sec">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div size="large"> {{ element.attrName }}</div>
              </template>
              {{ element.attrComment }}
            </n-tooltip>
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <h3>列表排序</h3>
      <draggable
          v-model="modelValue.table"
          group="table"
          item-key="attrName">
        <template #item="{element}">
          <div class="sec">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div size="large"> {{ element.attrName }}</div>
              </template>
              {{ element.attrComment }}
            </n-tooltip>
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <h3>表单排序</h3>
      <draggable
          v-model="modelValue.form"
          group="form"
          item-key="attrName">
        <template #item="{element}">
          <div class="sec">
            <n-tooltip trigger="hover" placement="left">
              <template #trigger>
                <div size="large"> {{ element.attrName }}</div>
              </template>
              {{ element.attrComment }}
            </n-tooltip>
          </div>
        </template>
      </draggable>
    </div>
  </n-flex>
</template>

<script setup>
import draggable from 'vuedraggable'

const modelValue = defineModel()

console.log(modelValue)
</script>

<style scoped>
.sec {
  height: 26px;
  border: 1px solid #ccc;
  padding: 3px 10px;
  cursor: move;
  border-radius: 3px;
}
</style>
