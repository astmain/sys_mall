import { createRouter, createWebHistory } from "vue-router"

// ==================== 后台管理 ====================
export const view_admin = [
  { name: "个人中心", path: "/user_center", component: () => import("../layout/user_center.vue") },

  // 首页
  { name: "首页", path: "/home", component: () => import("../views/home/home.vue") },
  { name: "用户管理", path: "/user", component: () => import("../views/user/user.vue") },

]

// ==================== 商城界面 ====================
export const view_shop = [

  { name: "markdown", path: "/markdown", component: () => import("@/layout/markdown/markdown.vue") },
  { name: "模型商城", path: "/model_shop", component: () => import("../views/model_shop/model_shop.vue") },
  { name: "打印商城", path: "/print_shop", component: () => import("../views/print_shop/print_shop.vue") },

  // { name: "购物车", path: "/cart", component: () => import("@/view_shop/cart/cart.tsx") },
]

// ==================== 路由配置 ====================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", name: "login", component: () => import("../layout/login.vue") },
    {
      path: "/",
      component: () => import("../layout/layout.vue"),
      children: [...view_admin, ...view_shop],
    },
    { path: "/:pathMatch(.*)*", name: "page404", component: () => import("../layout/page404.vue") }, // 404页面路由 - 必须放在最后，用于捕获所有未匹配的路径
  ],
})

// ==================== 路由守卫 ====================
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !localStorage.getItem("token")) {
    next("/login")
  } else {
    next()
  }
})

export default router
