import axios from 'axios'

let tables = []

export async function getTables() {
  if (tables.length > 0) {
    console.log('table cached')
    return tables
  }
  const response = await axios.get('/api/tables')
  tables = response.data // 缓存请求结果
  return tables
}

export async function getTableColumns(tableName) {
  return await axios.get('/api/columns', {
    params: {tableName: tableName},
  })
}

export async function generate(data) {
  return await axios.get('/api/generate', {
    data,
  })
}

export function getTableComment(tableName) {
  if (tables.length > 0) {
    console.log('tables not empty')
    return tables.find(item => item.tableName === tableName).tableComment
  }
  console.log('tables empty')
  return null
}
