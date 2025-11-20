// pinia状态持久化
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

export async function plugin_pinia({ app }: { app: any }) {

    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)

}
