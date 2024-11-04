<template>
  <n-drawer v-model:show="model" :width="502" placement="left" :mask-closable="false">
    <n-drawer-content title="属性配置">
      <attribute-config-form ref="attributeConfig"
                             v-model="editAttr"
                             :attrs="attrs" />

      <template #footer>
        <n-space>
          <n-button @click="model = false">取消</n-button>
          <n-button type="primary" @click="confirm">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import {NButton} from 'naive-ui'
import AttributeConfigForm from '@/components/attr/AttributeConfigForm.vue'
import {useMessage} from 'naive-ui'

const model = defineModel()
const props = defineProps({
  attrs: Array,
  data: Object,
})
const emit = defineEmits(['confirm'])
const editAttr = ref({})
const attributeConfig = ref()
const message = useMessage()

watch(model, (val) => {
  console.log(val)
  if (val) {
    console.log(props.data)
    editAttr.value = {...props.data}
  }
})

const confirm = () => {
  attributeConfig.value.validate((errors) => {
    console.log(editAttr.value)
    if (!errors) {
      model.value = false
      emit('confirm', editAttr.value)
    } else {
      console.log(errors)
      message.error('请按规则完成配置')
    }
  })

}
</script>

<style scoped>

</style>
