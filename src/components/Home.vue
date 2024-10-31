<template>
  <n-layout class="main">
    <n-layout-header bordered>
      <n-flex justify="space-between" align="center">
        <n-h2>{{ curStepText }}</n-h2>
        <n-flex justify="center" align="center" gap="middle">
          <n-button type="primary" @click="nextStep" :disabled="curStepCount>=steps.length-1">下一步</n-button>
          <n-button @click="previousStep" :disabled="curStepCount<1">上一步</n-button>
        </n-flex>
      </n-flex>
    </n-layout-header>
    <n-layout-content bordered content-style="padding: 20px;">
      <select-mode v-show="curStep === 'selectMode'" v-model="selectedMode" />
      <select-table v-if="curStep === 'selectMainTable'" :multiple="false" v-model="selectedMainTables" />
      <select-table v-if="curStep === 'selectSubTable'" :multiple="true" v-model="selectedSubTables" />
      <!--        <config-main-table v-if="curStep === 'configMainTable'" v-model="mainTableConfig" />-->
      <config-page v-if="curStep === 'configMainTable'" v-model="pageConfig" />
      <config-sort v-if="curStep === 'configMainTableOrder'" v-model="mainTableOrderConfig" />
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import {ref} from 'vue'
import SelectMode from '@/components/SelectMode.vue'
import {useMessage} from 'naive-ui'
import SelectTable from '@/components/SelectTable.vue'
import ConfigSort from '@/components/ConfigSort.vue'
import ConfigPage from '@/components/ConfigPage.vue'

const message = useMessage()
const curStep = ref('selectMode')
const curStepCount = ref(0)
const stepText = {
  selectMode: '选择模式',
  selectMainTable: '选择主表',
  selectSubTables: '选择子表',
  configMainTable: '主表配置',
  configMainTableOrder: '页面字段顺序调整',
}
const modeSteps = {
  'single': ['selectMode', 'selectMainTable', 'configMainTable', 'configMainTableOrder'],
  'oneToMany': ['selectMode', 'selectMainTable', 'selectSubTables', 'configMainTable'],
  'entity': ['selectMode', 'selectMainTable'],
}
const steps = ref(modeSteps.single)
const curStepText = computed(() => stepText[curStep.value])

// 各阶段数据
const selectedMode = ref('single')
const selectedMainTables = ref([])
const selectedSubTables = ref([])
const mainTableConfig = ref({})
const pageConfig = ref({})
const mainTableOrderConfig = ref({})

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
      mainTableConfig.value = {general: {tableName: selectedMainTables.value[0]}}
      pageConfig.value = {tableName: selectedMainTables.value[0]}
      break
    case 'configMainTable':
      console.log(mainTableConfig.value)
      const orderConfig = {
        search: [],
        table: [],
        form: [],
      }

      mainTableConfig.value.data.forEach(item => {
        const {attrName, attrComment, isShowOnTable, isSearch, isShowOnForm} = item

        if (isSearch) {
          orderConfig.search.push({attrName, attrComment})
        }

        if (isShowOnTable) {
          orderConfig.table.push({attrName, attrComment})
        }

        if (isShowOnForm) {
          orderConfig.form.push({attrName, attrComment})
        }
      })

      mainTableOrderConfig.value = orderConfig
      break
    case 'configMainTableOrder':
      break
  }
  if (curStepCount.value < steps.value.length) {
    curStep.value = steps.value[++curStepCount.value]
  }
}

const previousStep = () => {
  curStep.value = steps.value[--curStepCount.value]
}

</script>

<style scoped>
.main {
  height: 100vh;
  padding: 20px;
}
</style>
