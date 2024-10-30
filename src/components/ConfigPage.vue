<template>
  <n-layout has-sider bordered content-style="height: calc(100vh - 140px)">
    <n-layout-sider bordered :native-scrollbar="false" content-style="width: 200px;">
      <div v-for="(item, index) in 500" :key="index">
        海淀桥
      </div>
    </n-layout-sider>
    <n-layout-content content-style="padding:0 20px;">
      <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <template #suffix>
          <n-button type="info">
            <template #icon>
              <n-icon>
                <Cog />
              </n-icon>
            </template>
            通用配置
          </n-button>
        </template>
        <n-tab-pane name="signin" tab="列表配置">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong>
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="表单配置">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="重复密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong>
            注册
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-layout-content>
  </n-layout>
</template>

<script setup>

import {NButton, NIcon} from 'naive-ui'
import {Cog} from '@vicons/ionicons5'
</script>

<style scoped>

</style>
