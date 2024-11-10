<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="编辑配置"
    size="huge"
    style="width: 80vw"
  >
    <n-space vertical>
      <json-editor-vue
        ref="jsonEditor"
        v-model="jsonData"
        mode="text"
        style="height: 50vh"
      />
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleConfirm">确认</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMessage } from "naive-ui";
import JsonEditorVue from "json-editor-vue";

const message = useMessage();
const show = defineModel();
const jsonData = ref({});
const jsonEditor = ref();
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["confirm"]);

// 监听 show 和 config 的变化
watch([show, () => props.config], ([newShow]) => {
  if (newShow) {
    jsonData.value = props.config;
  }
});

const handleConfirm = () => {
  const error = jsonEditor.value.jsonEditor.validate();
  if (error) {
    message.error("配置格式错误，请检查JSON格式");
    return;
  }
  if (typeof jsonData.value === "string") {
    jsonData.value = JSON.parse(jsonData.value);
  }
  emit("confirm", jsonData.value);
};

const handleCancel = () => {
  show.value = false;
};
</script>
