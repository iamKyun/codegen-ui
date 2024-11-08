<template>
  <n-layout class="main">
    <n-layout-header bordered>
      <n-flex justify="space-between" align="center">
        <n-h2>{{ curStepText }}</n-h2>
        <n-flex justify="center" align="center" gap="middle">
          <n-button type="primary" @click="nextStep" v-show="curStep !== 'configPage'"
            :disabled="curStepCount >= steps.length - 1">下一步</n-button>
          <n-button type="primary" @click="generate" v-show="curStep === 'configPage'"
            @loading="generating">生成代码</n-button>
          <n-button @click="previousStep" :disabled="curStepCount < 1">上一步</n-button>
        </n-flex>
      </n-flex>
    </n-layout-header>
    <n-layout-content bordered content-style="padding: 10px;">
      <select-mode v-show="curStep === 'selectMode'" v-model="selectedMode" />
      <select-table v-if="curStep === 'selectMainTable'" :multiple="false" v-model="selectedMainTables" />
      <config-page v-if="curStep === 'configPage'" v-model="pageConfig" />
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { ref } from 'vue'
import SelectMode from '@/components/SelectMode.vue'
import { useMessage } from 'naive-ui'
import SelectTable from '@/components/SelectTable.vue'
import ConfigPage from '@/components/ConfigPage.vue'

const message = useMessage()
const curStep = ref('selectMode')
const curStepCount = ref(0)
const stepText = {
  selectMode: '选择模式',
  selectMainTable: '选择主表',
  configPage: '页面配置',
}
const modeSteps = {
  'design': ['selectMode', 'selectMainTable', 'configPage'],
  'entity': ['selectMode', 'selectMainTable',],
}
const steps = ref(modeSteps.design)
const curStepText = computed(() => stepText[curStep.value])
const generating = ref(false)

// 各阶段数据
const selectedMode = ref('design')
const selectedMainTables = ref([])
const mainTableConfig = ref({})
const pageConfig = ref({})

const nextStep = () => {
  switch (curStep.value) {
    case 'selectMode':
      if (!selectedMode.value) {
        message.error('请选择模式')
        return
      }
      steps.value = modeSteps[selectedMode.value]
      console.log(steps.value)
      break
    case 'selectMainTable':
      if (!selectedMainTables.value.length) {
        message.error('请选择主表')
        return
      }
      mainTableConfig.value = { general: { tableName: selectedMainTables.value[0] } }
      pageConfig.value = {
        general: { tableName: selectedMainTables.value[0] },
        search: [],
        table: [],
        form: [],
        subTables: [],
      }
      break
    case 'configPage':
      console.log(mainTableConfig.value)
      const orderConfig = {
        search: [],
        table: [],
        form: [],
      }

      mainTableConfig.value.data.forEach(item => {
        const { attrName, attrComment, isShowOnTable, isSearch, isShowOnForm } = item

        if (isSearch) {
          orderConfig.search.push({ attrName, attrComment })
        }

        if (isShowOnTable) {
          orderConfig.table.push({ attrName, attrComment })
        }

        if (isShowOnForm) {
          orderConfig.form.push({ attrName, attrComment })
        }
      })

      break
  }
  if (curStepCount.value < steps.value.length) {
    curStep.value = steps.value[++curStepCount.value]
  }
}

const previousStep = () => {
  curStep.value = steps.value[--curStepCount.value]
}

const generate = () => {
  console.log('页面配置:', pageConfig.value)
  generating.value = true
  generate(pageConfig.value)
    .then(res => {
      message.success('生成成功')
    })
    .catch(err => {
      message.error('生成失败')
    })
    .finally(() => {
      generating.value = false
    })
}


</script>

<style scoped>
.main {
  height: 100vh;
  padding: 16px 20px;
}
</style>
