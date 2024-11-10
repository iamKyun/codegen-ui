<template>
  <n-flex
    class="search-form-item w-full h-full"
    :class="{
      full: !!element.displayFull,
      editing: configType === 'search' && element.id === editingId,
    }"
    @click="config"
  >
    <n-flex
      :wrap="false"
      align="center"
      justify="flex-start"
      class="content w-full h-full"
    >
      <n-flex
        :wrap="false"
        align="center"
        justify="space-between"
        class="w-20 h-full"
      >
        <span>{{ element.label }}</span>
        <span> :</span>
      </n-flex>
      <div class="flex-1">
        <n-input
          v-if="element.type === 'text'"
          placeholder="文本搜索"
          size="medium"
          disabled
        />
        <n-space
          v-if="element.type === 'number' && element.rangeSearch !== false"
          justify="center"
          :wrap="false"
        >
          <n-input-number disabled placeholder="" />
          <span>~</span>
          <n-input-number disabled placeholder="" />
        </n-space>
        <n-input-number
          v-if="element.type === 'number' && !(element.rangeSearch !== false)"
          disabled
          placeholder="数字搜索"
        />
        <n-date-picker
          v-if="element.type === 'date'"
          disabled
          :type="element.rangeSearch !== false ? 'datetimerange' : 'date'"
        />
        <div v-if="element.type === 'radio'">
          <n-radio
            v-for="i in exampleOptions"
            :key="i.value"
            :value="i.value"
            disabled
          >
            {{ i.label }}
          </n-radio>
        </div>
        <n-select
          v-if="element.type === 'select'"
          value-field="key"
          label-field="value"
          placeholder="下拉选择"
          disabled
        />
      </div>
    </n-flex>
    <div class="operations">
      <n-space>
        <n-button text type="info" class="btn" @click="config"> 配置 </n-button>
        <n-button text type="error" class="btn" @click="handleRemoveConfig">
          删除
        </n-button>
      </n-space>
    </div>
    <div class="overlay"></div>
  </n-flex>
</template>

<script setup>
import { NButton } from "naive-ui";
import { exampleOptions } from "@/utils/Constants.js";

const props = defineProps({
  element: Object,
  configType: String,
  editingId: String,
});
const emit = defineEmits(["config", "remove"]);

function config() {
  emit("config");
}

function handleRemoveConfig() {
  emit("remove");
}
</script>

<style scoped>
.search-form-item {
  flex: 0 0 calc(50% - 10px);
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
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

.content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0); /* 半透明蒙版 */
  pointer-events: auto;
}
</style>
