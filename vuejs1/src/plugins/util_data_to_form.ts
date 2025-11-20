/**
 * 根据 temp1 的 key 结构，从 data1 中提取对应的数据
 * @param temp1 - 模板对象，定义需要提取的 key 结构
 * @param data1 - 数据源对象，包含实际数据
 * @returns 返回新对象，只包含 temp1 中存在的 key 对应的 data1 的值
 */
export function util_data_to_form(temp1: any, data1: any): any {
  // 如果 temp1 或 data1 不是对象，直接返回 data1
  if (typeof temp1 !== "object" || temp1 === null || typeof data1 !== "object" || data1 === null) {
    return data1
  }

  // 如果 temp1 是数组，返回 data1（如果 data1 也是数组的话）
  if (Array.isArray(temp1)) {
    return Array.isArray(data1) ? data1 : temp1
  }

  // 创建新对象
  const ccc: any = {}

  // 遍历 temp1 的所有 key
  for (const key in temp1) {
    if (temp1.hasOwnProperty(key)) {
      // 如果 data1 中存在该 key
      if (data1.hasOwnProperty(key)) {
        // 如果 temp1[key] 是对象且不是数组，递归处理
        if (typeof temp1[key] === "object" && temp1[key] !== null && !Array.isArray(temp1[key])) {
          ccc[key] = util_data_to_form(temp1[key], data1[key])
        } else {
          // 否则直接赋值
          ccc[key] = data1[key]
        }
      } else {
        // 如果 data1 中不存在该 key，使用 temp1 的默认值
        ccc[key] = temp1[key]
      }
    }
  }

  return ccc
}

// // 使用示例：
// const ccc = util_data_to_form(temp1, data1)
// console.log(ccc)
