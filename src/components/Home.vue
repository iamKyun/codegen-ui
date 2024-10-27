<template>
  <div class="main">
    <n-flex justify="center" align="center" vertical gap="large">
      <n-card class="card" :bordered="false">
        <template #header>
          {{ curStepText }}
        </template>
        <select-mode v-show="curStep === 'selectMode'" v-model="selectedMode" />
        <select-table v-if="curStep === 'selectMainTable'" :multiple="false" v-model="selectedMainTables" />
        <select-table v-if="curStep === 'selectSubTable'" :multiple="true" v-model="selectedSubTables" />
        <config-main-table v-if="curStep === 'configMainTable'" :tableName="selectedMainTables[0]" />
      </n-card>
      <n-flex justify="center" align="center" gap="middle">
        <n-button type="primary" @click="nextStep" :disabled="curStepCount>=steps.length-1">下一步</n-button>
        <n-button @click="previousStep" :disabled="curStepCount<1">上一步</n-button>
      </n-flex>
    </n-flex>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import SelectMode from '@/components/SelectMode.vue'
import {useMessage} from 'naive-ui'
import SelectTable from '@/components/SelectTable.vue'
import ConfigMainTable from '@/components/ConfigMainTable.vue'

const message = useMessage()
const curStep = ref('selectMode')
const curStepCount = ref(0)
const stepText = {
  selectMode: '选择模式',
  selectMainTable: '选择主表',
  selectSubTables: '选择子表',
  configMainTable: '主表属性配置',
}
const modeSteps = {
  'single': ['selectMode', 'selectMainTable', 'configMainTable'],
  'oneToMany': ['selectMode', 'selectMainTable', 'selectSubTables', 'configMainTable'],
  'entity': ['selectMode', 'selectMainTable'],
}
const steps = ref(modeSteps.single)
const curStepText = computed(() => stepText[curStep.value])

// 各阶段数据
const selectedMode = ref('single')
const selectedMainTables = ref([])
const selectedSubTables = ref([])

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
      break
    case 'configMainTable':
      if (!selectedSubTables.value.length) {
        message.error('请选择子表')
        return
      }
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
  width: 100vw;
  background: #f3f3f3;
}

.card {
  height: calc(100vh - 100px);
  width: 80vw;
  margin: 20px 0;
}
</style>
