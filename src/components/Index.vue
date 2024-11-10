<template>
  <n-layout class="main">
    <n-layout-header bordered>
      <n-flex justify="space-between" align="center">
        <n-h2>{{ curStepText }}</n-h2>
        <n-flex justify="center" align="center" gap="middle">
          <n-button type="info" @click="editConfigShow = true">
            <template #icon>
              <n-icon>
                <DocumentTextOutline />
              </n-icon>
            </template>
            编辑配置
          </n-button>
          <n-divider vertical />
          <n-button @click="previousStep" :disabled="curStepCount < 1"
            >上一步</n-button
          >

          <n-button
            type="primary"
            @click="nextStep"
            v-show="curStep !== 'configPage'"
            :disabled="curStepCount >= steps.length - 1"
            >下一步</n-button
          >
          <n-button
            type="primary"
            @click="generateConfigShow = true"
            v-show="curStep === 'configPage'"
            >生成代码</n-button
          >
        </n-flex>
      </n-flex>
    </n-layout-header>
    <n-layout-content bordered content-style="padding: 10px;">
      <select-mode v-show="curStep === 'selectMode'" v-model="selectedMode" />
      <select-table
        v-if="curStep === 'selectMainTable'"
        :multiple="false"
        v-model="selectedMainTables"
      />
      <config-page v-if="curStep === 'configPage'" v-model="pageConfig" />
    </n-layout-content>
    <generate-config-modal
      v-model:show="generateConfigShow"
      v-model:config="pageConfig"
    />
    <edit-config-modal
      v-model="editConfigShow"
      :config="pageConfig"
      @confirm="applyConfig"
    />
  </n-layout>
</template>

<script setup>
import { ref } from "vue";
import SelectMode from "@/components/SelectMode.vue";
import { useMessage } from "naive-ui";
import SelectTable from "@/components/SelectTable.vue";
import ConfigPage from "@/components/ConfigPage.vue";
import GenerateConfigModal from "@/components/config/GenerateConfigModal.vue";
import { DocumentTextOutline } from "@vicons/ionicons5";
const message = useMessage();
const curStep = ref("selectMode");
const curStepCount = ref(0);
const stepText = {
  selectMode: "选择模式",
  selectMainTable: "选择主表",
  configPage: "页面配置",
};
const modeSteps = {
  design: ["selectMode", "selectMainTable", "configPage"],
  entity: ["selectMode", "selectMainTable"],
};
const steps = ref(modeSteps.design);
const curStepText = computed(() => stepText[curStep.value]);
// 生成代码弹窗
const generateConfigShow = ref(false);
// 各阶段数据
const selectedMode = ref("design");
const selectedMainTables = ref([]);
const pageConfig = ref({});

const editConfigShow = ref(false);

const applyConfig = (newConfigJson) => {
  // 解析并验证配置
  if (!newConfigJson?.general?.tableName) {
    message.error("配置格式错误，请检查JSON格式");
    return;
  }

  // 确保基础配置项存在
  const defaultFields = ["search", "table", "form", "subTables"];
  defaultFields.forEach((field) => {
    newConfigJson[field] = newConfigJson[field] || [];
  });

  // 为所有配置项补充ID
  const addIds = (items) => {
    items?.forEach((item) => {
      item.id = item.id ?? uuidv4();
    });
  };

  // 处理主要配置项
  defaultFields.forEach((field) => addIds(newConfigJson[field]));

  // 处理子表配置
  newConfigJson.subTables?.forEach((subTable) => {
    subTable.id = subTable.id ?? uuidv4();
    addIds(subTable.table);
    addIds(subTable.form);
  });

  // 更新配置并关闭弹窗
  pageConfig.value = newConfigJson;
  message.success("配置已更新");
  // 这里要强制刷新config-page组件，触发onMounted
  curStep.value = null;
  nextTick(() => {
    curStep.value = "configPage";
  });
  editConfigShow.value = false;
  curStepCount.value = 2;
};

const nextStep = () => {
  switch (curStep.value) {
    case "selectMode":
      if (!selectedMode.value) {
        message.error("请选择模式");
        return;
      }
      steps.value = modeSteps[selectedMode.value];
      console.log(steps.value);
      break;
    case "selectMainTable":
      if (!selectedMainTables.value.length) {
        message.error("请选择主表");
        return;
      }
      pageConfig.value = {
        general: { tableName: selectedMainTables.value[0] },
        search: [],
        table: [],
        form: [],
        subTables: [],
      };
      break;
  }
  if (curStepCount.value < steps.value.length) {
    curStep.value = steps.value[++curStepCount.value];
  }
};

const previousStep = () => {
  curStep.value = steps.value[--curStepCount.value];
};

onMounted(() => {
  window.$message = useMessage();
});
</script>

<style scoped>
.main {
  height: 100vh;
  padding: 16px 20px;
}
</style>
