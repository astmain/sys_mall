/**
 * 全局设置element-plus的全局样式
 * 解决 某些页面中全局css无法使用的问题
 */

export async function plugin_ElementPlusCss({ app }: { app: any }) {
  const style = document.createElement("style")
  style.textContent = `
    // .el-switch {
    //   --el-switch-on-color: #409eff !important;
    //   --el-switch-off-color: #9ca3af !important;
    // }



    // .el-radio__inner {
    //   display: none !important; /* 使圆点消失 */
    // }


  `
  document.head.appendChild(style)
}
