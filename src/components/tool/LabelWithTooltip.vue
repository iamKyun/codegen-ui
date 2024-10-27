<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div style="display: flex; align-items: center;justify-content: flex-end; cursor: help;">
        <span>{{ label }}</span>
        <n-icon style="margin-left: 2px; color: #bbb;">
          <HelpCircleOutline />
        </n-icon>
      </div>
    </template>
    {{ tooltip }}
  </n-tooltip>
</template>

<script setup>
import {defineProps} from 'vue'
import {NIcon, NTooltip} from 'naive-ui'
import {HelpCircleOutline} from '@vicons/ionicons5'

const props = defineProps({
  label: String,
  tooltip: String,
})
</script>
