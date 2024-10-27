export function insertRandomUnderscores(str) {
  const numUnderscores = Math.floor(Math.random() * 2) + 1 // 随机生成1或2个下划线
  const positions = new Set()

  // 随机选择插入位置，确保不在首尾，并且不连续
  while (positions.size < numUnderscores) {
    const pos = Math.floor(Math.random() * (str.length - 2)) + 1 // 确保不在首尾

    // 如果位置不与已有的位置连续，才添加
    if (![...positions].some(
        existingPos => Math.abs(existingPos - pos) === 1)) {
      positions.add(pos)
    }
  }

  let result = ''
  let lastPos = 0;

  // 将下划线插入指定位置
  [...positions].sort((a, b) => a - b).forEach(pos => {
    result += str.slice(lastPos, pos) + '_'
    lastPos = pos
  })

  // 加上最后一段字符串
  result += str.slice(lastPos)
  return result
}

export function toCamelCase(str) {
  return str.toLowerCase() // 先将整个字符串转为小写
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) // 转换下划线后的字母为大写
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
