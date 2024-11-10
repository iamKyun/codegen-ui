<template>
  <n-modal
    v-model:show="show"
    title="准备生成！"
    preset="dialog"
    closable
    content-class="pt-2"
    style="min-width: 600px"
  >
    <n-form
      :model="extraConfig"
      label-placement="left"
      label-width="120"
      :rules="rules"
      ref="extraConfigForm"
    >
      <n-form-item label="模块名" path="module">
        <n-input
          v-model:value="extraConfig.module"
          placeholder="请输入模块名"
        />
      </n-form-item>
      <n-form-item path="moduleCn">
        <template #label>
          <label-with-tooltip
            label="模块中文标题"
            tooltip="页面的标题和一些注释的标题，不填则取主表的名称"
          />
        </template>
        <n-input
          v-model:value="extraConfig.moduleCn"
          placeholder="请输入模块中文标题"
        />
      </n-form-item>
      <n-form-item label="Java包路径" path="packagePath">
        <n-input
          v-model:value="extraConfig.packagePath"
          placeholder="请输入包路径"
        />
      </n-form-item>
      <n-form-item label="Vue文件路径" path="vuePath">
        <n-input
          v-model:value="extraConfig.vuePath"
          placeholder="请输入Vue文件路径"
        />
      </n-form-item>
    </n-form>
    <n-h3>生成路径预览</n-h3>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item label="Java包路径">
        {{ `${extraConfig.packagePath}.${extraConfig.module ?? ""}` }}
      </n-descriptions-item>
      <n-descriptions-item label="Vue文件路径">
        {{ `${extraConfig.vuePath}/${extraConfig.module ?? ""}` }}
      </n-descriptions-item>
    </n-descriptions>
    <template #action>
      <n-button type="primary" @click="generateOk" :loading="generating"
        >生成</n-button
      >
    </template>
  </n-modal>
</template>

<script setup>
import { download, generate } from "@/utils/Apis";

const message = useMessage();
const show = defineModel("show");
const pageConfig = defineModel("config");
const emit = defineEmits(["generate"]);
const generating = ref(false);
const extraConfigForm = ref();
// 生成代码配置
const extraConfig = ref(
  JSON.parse(localStorage.getItem("extraConfig")) || {
    module: null,
    packagePath: "com.gzcss.com.gzcss.zbpt.modules",
    vuePath: "src/views",
  }
);

const rules = {
  module: [{ required: true, message: "请输入模块名" }],
  packagePath: [{ required: true, message: "请输入包路径" }],
  vuePath: [{ required: true, message: "请输入Vue文件路径" }],
};

const generateOk = () => {
  console.log("generate");

  extraConfigForm.value.validate((errors) => {
    if (errors) {
      return;
    }
    localStorage.setItem("extraConfig", JSON.stringify(extraConfig.value));
    generating.value = true;
    const data = {
      ...pageConfig.value,
      extra: extraConfig.value,
    };

    generate(data)
      .then((res) => {
        if (res.data.message) {
          message.error(res.data.message);
        } else {
          message.success("生成成功");
          download(res.data.zip);
        }
      })
      .catch((err) => {
        message.error("生成失败");
      })
      .finally(() => {
        generating.value = false;
      });
  });
};
</script>

<style scoped></style>
