<template>
  <n-input
    placeholder="搜索"
    style="margin-bottom: 6px; width: 500px"
    v-model:value="searchText"
    clearable
  >
    <template #suffix>
      <n-icon :component="Search" />
    </template>
  </n-input>
  <n-data-table
    :checked-row-keys="model"
    :columns="columns"
    :data="computedData"
    :pagination="false"
    :row-key="(row) => row.tableName"
    :row-props="rowProps"
    max-height="calc(100vh - 250px)"
  />
</template>

<script setup>
import { Search } from "@vicons/ionicons5";
import { getTables } from "@/utils/Apis.js";

const props = defineProps({ multiple: { type: Boolean, default: false } });
const model = defineModel();
const searchText = ref();
const data = ref([]);
const computedData = computed(() => {
  if (!searchText.value || searchText.value.trim() === "") {
    return data.value;
  }
  return data.value.filter(
    (item) =>
      item.tableName.includes(searchText.value) ||
      (item.tableComment && item.tableComment.includes(searchText.value))
  );
});
const columns = [
  {
    type: "selection",
    multiple: props.multiple,
  },
  {
    title: "表名",
    key: "tableName",
  },
  {
    title: "备注",
    key: "tableComment",
  },
];
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      const tableName = row.tableName;
      if (props.multiple) {
        const arr = model.value;
        const index = arr.indexOf(tableName);
        if (index > -1) {
          arr.splice(index, 1);
        } else {
          arr.push(tableName);
        }
        model.value = arr;
      } else {
        model.value = [row.tableName];
      }
    },
  };
};

onMounted(async () => {
  data.value = (await getTables()).data;
});
</script>

<style scoped></style>
