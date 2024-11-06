<template>
  <draggable
      :sort="false"
      :list="formElements"
      :group="{ name: 'form', pull: 'clone', put: false, sort:false }"
      :clone="clone"
      item-key="type"
      class="element-selection"
  >
    <template #item="{ element }">
      <div class="element-slot">
        <img :src="element.pic" :alt="element.label" class="element-img" />
        <span>{{ element.label }}</span>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'
import {uuidv4} from '@/utils/StringUtils.js'
import {formElements} from '@/utils/Constants.js'

const clone = (item) => {
  console.log(item)
  return {
    id: uuidv4(),
    label: item.label,
    type: item.value,
  }
}
</script>

<style scoped>
.element-selection{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.element-slot {
  border: 1px solid #bbb;
  padding: 4px 6px;
  flex: 0 0 calc(50% - 10px);
  box-sizing: border-box;
  height: 38px;
  line-height: 30px;
  cursor: move;
  border-radius: 3px;
  background: #f9f9f9;
}

.element-img {
  margin-right: 6px;
  display: inline-block;
  max-height: 100%;
  width: auto;
  object-fit: cover;
}
</style>
