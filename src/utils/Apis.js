import axios from "axios";

// 创建 axios 实例
const instance = axios.create();

// 响应拦截器
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理错误响应
    const errorMsg = error.response?.data || error.message || "请求失败";
    window.$message.error(errorMsg);
    return Promise.reject(error);
  }
);

export function getTables() {
  return instance.get("/api/tables");
}

export function getTable(tableName) {
  return instance.get("/api/table", {
    params: { tableName: tableName },
  });
}

export function getTableColumns(tableName) {
  return instance.get("/api/columns", {
    params: { tableName: tableName },
  });
}

export function generate(data) {
  return instance.post("/api/generate", data);
}

export function download(zip) {
  window.open(`/api/download?zip=${zip}`);
}
