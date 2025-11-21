import { defineStore } from "pinia"

export const use_BUS = defineStore("localStorage_BUS", {
  state: () => ({
    count: 0,
    user: { id: "", name: "", phone: "", gender: "未知", avatar: "" },
    control_button: { show: true, top: 500, left: 100 },
    web_type: "admin",
    role_menu_tree: [] as any[],

    depart_tree: [] as any[],
    VITE_url_app_run: "",

    VITE_url_app_list: [] as any[],
    token: "",
    url_api_curr: { name: "3004", url: "http://127.0.0.1:3004", remark: "" },
    url_api_list: [
      { name: "3000", url: "http://127.0.0.1:3000", remark: "" },
      { name: "3001", url: "http://127.0.0.1:3001", remark: "" },
      { name: "3002", url: "http://127.0.0.1:3002", remark: "" },
      { name: "3004", url: "http://127.0.0.1:3004", remark: "" },
      { name: "8001", url: "http://127.0.0.1:8001/api", remark: "" },
      { name: "server.oss", url: "https://server.oss.yun3d.com", remark: "" },
    ],
    // 全局api
    func: {
      tree_left_click: () => { },
      find_tree_depart: () => { },
    },
  }),
  persist: [
    { pick: ["count", "user", "control_button", "role_menu_tree", "web_type", "VITE_url_app_run", "VITE_url_app_list", "token", "url_api_curr"], storage: localStorage },

    {
      key: "token",
      pick: ["token"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["token"], deserialize: (value: any) => value["token"] },
    },

    {
      key: "token",
      pick: ["token"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["token"], deserialize: (value: any) => value["token"] },
    },
    {
      key: "VITE_url_app_run",
      pick: ["VITE_url_app_run"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["VITE_url_app_run"], deserialize: (value: any) => value["VITE_url_app_run"] },
    },
  ],
})

export const BUS = use_BUS()

//@ts-ignore
window.BUS = BUS



