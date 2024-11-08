<template>
  <n-modal v-model:show="show" title="准备生成！" preset="dialog" closable content-class="pt-4" style="min-width: 600px;">
    <n-form :model="pathConfig" label-placement="top" label-width="120" :rules="rules" ref="pathConfigForm">
      <n-form-item label="模块名" path="module">
        <n-input v-model:value="pathConfig.module" placeholder="请输入模块名" />
      </n-form-item>
      <n-form-item label="包路径" path="package">
        <n-input v-model:value="pathConfig.package" placeholder="请输入包路径" />
      </n-form-item>
      <n-form-item label="Vue文件路径" path="vuePath">
        <n-input v-model:value="pathConfig.vuePath" placeholder="请输入Vue文件路径" />
      </n-form-item>
    </n-form>
    <n-h2>生成路径预览</n-h2>
    <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item label="Java包路径">
          {{ `${pathConfig.package}.${pathConfig.module??''}` }}
        </n-descriptions-item>
        <n-descriptions-item label="Vue文件路径">
          {{ `${pathConfig.vuePath}/${pathConfig.module??''}` }}
        </n-descriptions-item>
      </n-descriptions>
    <template #action>
      <n-button type="primary" @click="generateOk" :loading="generating">生成</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import {generate} from '@/utils/Apis'
const show = defineModel('show')
const pageConfig = defineModel('config')
const emit = defineEmits(['generate'])
const generating = ref(false)
const pathConfigForm = ref()
// 生成代码配置
const pathConfig = ref(
  JSON.parse(localStorage.getItem('pathConfig')) || {
    module: null,
    package: 'com.gzcss.com.gzcss.zbpt.modules',
    vuePath: 'src/views',
  }
)

const rules = {
  module: [{ required: true, message: '请输入模块名' }],
  package: [{ required: true, message: '请输入包路径' }],
  vuePath: [{ required: true, message: '请输入Vue文件路径' }],
}

const generateOk = () => {
  console.log('generate');
  
  pathConfigForm.value.validate((errors) => {
    if (errors) {
      return
    }
    localStorage.setItem('pathConfig', JSON.stringify(pathConfig.value))
    generating.value = true
    const data = {
      ...pageConfig.value,
      pathConfig: pathConfig.value,
    }

    generate(data)
      .then(res => {
        message.success('生成成功')
      })
      .catch(err => {
        message.error('生成失败')
      })
      .finally(() => {
        generating.value = false
      })
  })
}
</script>

<style scoped>
 
</style>
