<template>
  <div class="option-group">
    <div
        v-for="option in modeOptions"
        :key="option.value"
        :class="['option-item', { 'selected': model === option.value }]"
        @click="selectMode(option.value)"
    >
      <div class="option-text">{{ option.label }}</div>
      <img :src="option.src" :alt="option.label" class="option-image" />
    </div>
  </div>
</template>

<script setup>
import pic1 from '@/assets/1.png';
import pic2 from '@/assets/2.png';
import pic3 from '@/assets/3.png';

const model = defineModel()

const modeOptions = [
  {value: 'single', label: '单表', src: pic1},
  {value: 'oneToMany', label: '一对多', src: pic2},
  {value: 'entity', label: '仅实体类', src: pic3},
]

function selectMode(value) {
  model.value = value
}
</script>

<style scoped>

.option-group {
  display: flex;
  gap: 16px;
}

.option-item {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.option-item:hover {
  border-color: #42b983;
}

.option-item.selected {
  border-color: #42b983;
  background-color: #f0f9f5;
}

.option-text {
  margin-bottom: 8px;
  font-weight: bold;
  text-align: center;
}

.option-image {
  width: 130px;
  height: 130px;
  object-fit: cover;
}
</style>
