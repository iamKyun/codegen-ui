<template>
  <draggable
      :sort="false"
      :list="elements"
      :group="{ name: 'main', pull: 'clone', put: false, sort:false }"
      :clone="clone"
      item-key="id"
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
import datePic from '@/assets/element/date.png'
import inputPic from '@/assets/element/input.png'
import numberPic from '@/assets/element/number.png'
import radioPic from '@/assets/element/radio-group.png'
import selectPic from '@/assets/element/select.png'

const elements = [
  {label: '文本框', value: 'input', pic: inputPic},
  {label: '数字框', value: 'number', pic: numberPic},
  {label: '日期选择', value: 'date', pic: datePic},
  {label: '单选按钮', value: 'radio', pic: radioPic},
  {label: '下拉选择', value: 'select', pic: selectPic},
]

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
