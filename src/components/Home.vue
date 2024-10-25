<template>
  <n-flex justify="center" align="center" class="main" vertical gap="large">
    <n-card :bordered="false" style="width: 1200px;height: 800px">
      <template #header>
        {{ curStepText }}
      </template>
      <div v-show="curStep === 0">
        <n-radio-group v-model:value="mode" name="mode">
          <n-space>
            <n-radio v-for="m in modes" :key="m.value" :value="m.value">
              {{ m.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
      <div v-show="curStep === 1">

      </div>
    </n-card>
    <n-flex justify="center" align="center" gap="middle">
      <n-button type="primary" @click="nextStep" :disabled="curStep>=maxStep">下一步</n-button>
      <n-button @click="previousStep" :disabled="curStep<1">上一步</n-button>
    </n-flex>
  </n-flex>
  <n-button>123</n-button>
</template>

<script setup>
import {ref} from 'vue'

const curStep = ref(0)
const maxStep = 3
const stepText = ['选择模式', '选择数据表', '选择模式3', '选择模式4']
const curStepText = computed(() => stepText[curStep.value])
const mode = ref('single')
const modes = [
  {value: 'single', label: '单表'},
  {value: 'oneToMany', label: '一对多'},
  {value: 'entity', label: '仅实体类'},
]
const nextStep = () => {
  curStep.value++
  if (curStep.value >= maxStep) {
    curStep.value = maxStep
  }
}
const previousStep = () => {
  curStep.value--
}
</script>


<style scoped>
.main {
  height: 100vh;
  width: 100vw;
  background: #f3f3f3;
}
</style>
