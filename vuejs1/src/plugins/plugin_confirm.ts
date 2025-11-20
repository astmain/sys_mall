import { ElMessageBox } from "element-plus"
/** 
 * 删除数据时确定
 * 示例: if (!(await plugin_confirm())) return
 * @returns 
 */


export async function plugin_confirm() {
  return new Promise(async (resolve) => {
    try {
      let confirm = await ElMessageBox.confirm("确定删除吗", "删除提示", { cancelButtonText: "取消", confirmButtonText: "删除" })
      if (confirm != "confirm") return resolve(false)
      return resolve(true)
    } catch (error) {
      return resolve(false)
    }
  })
}




