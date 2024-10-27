// src/mock/index.js
import Mock from 'mockjs'
import {insertRandomUnderscores} from '@/utils/StringUtils.js'

Mock.mock('/api/tables', 'get', (options) => {
  const mock = Mock.mock({
    'data|100-200': [
      {
        'tableName': '@word()',
        'tableComment': '@city',
      },
    ],
  })
  return mock.data
})

Mock.mock(/\/api\/columns\?tableName=.*/, 'get', (options) => {
  const mock = Mock.mock({
    'data|10-20': [
      {
        'columnName': '@word(10, 15)',
        'columnComment': '@city',
        'javaType': '@pick(["java.lang.Integer", "java.lang.Long", "java.lang.Short", "java.lang.Byte", "java.lang.Double", "java.lang.Float", "java.lang.Float", "java.math.BigDecimal", "java.lang.String", "java.lang.Boolean", "java.util.Date", "byte[]", "java.sql.Clob", "java.sql.Blob"])',
      },
    ],
  })
  return mock.data.map(item => ({ ...item, columnName: insertRandomUnderscores(item.columnName.toUpperCase()) }))
})

// 模拟延迟响应
Mock.setup({
  timeout: '100-300',
})


