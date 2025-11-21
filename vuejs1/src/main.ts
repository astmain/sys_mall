import { app } from "./layout/App.ts"
import { plugin_ElementPlus } from "./plugins/plugin_ElementPlus.ts"
import { plugin_ElementPlusCss } from "./plugins/plugin_ElementPlusCss.ts"
import { plugin_pinia } from "./plugins/plugin_pinia.ts"
import { plugin_UnoCss } from "./plugins/plugin_UnoCss.ts"
import router from "./router"

// 1111
import VueCropper from "vue-cropper"
import 'vue-cropper/dist/index.css'
// import "vue-cropper/dist/index.css"

async function main() {
  // await plugin_ElementPlus({ app });
  await plugin_ElementPlusCss({ app })
  await plugin_pinia({ app })
  await plugin_UnoCss({ app })
  app.use(router)
  app.use(VueCropper)
  app.mount("#app")
}
main()



// 我想使用components/icon/love.svg     使用方式 <div class="icon-love"></div>
