// 本地存储模块
// 获取
export const getItem = (name) => {
  const data = window.localStorage.getItem(name)
  // 把JSON.parse放到try-catch中因为data可能不是JSON格式的字符串
  try { // 尝试把data转为javaScript对象
    return JSON.parse(data)
  } catch (err) {
    // data不是JSON格式字符串，直接原样返回
    return data
  }
}
// 存储
export const setItem = (name, value) => {
  // 如果value是对象，就把value转换为JSON格式的字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}
// 删除
export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}
