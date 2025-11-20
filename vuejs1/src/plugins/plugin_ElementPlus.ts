import "element-plus/dist/index.css"
import ElementPlus from "element-plus"

export async function plugin_ElementPlus({ app }: { app: any }) {
  app.use(ElementPlus, { size: "small" })
  return { ElementPlus }
}
