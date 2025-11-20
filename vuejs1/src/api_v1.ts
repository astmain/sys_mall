import { axios_api } from "./plugins/axios_api"


// 类型_文件详情
export interface info_file {
  url: string
  file_name: string
}

// 类型_材料
export interface info_print_card {
  card_id: string
  user_id: string
  checked: boolean
  count: number
  product_id: string
  length: number
  width: number
  height: number //
  surface_area: number
  volume: number
  complexity: number
  structural_strength: number
  num_faces: number
  points: number
  min_thickness: number
  thickness_proportion: number
  // 文件
  url: string
  url_screenshot: string
  fileNameOriginal: string
  size: number
  size_format: string
  // 材料
  arg_material: { id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }
  arg_polish: { id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }
  arg_nut: Array<{ id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }>
}
export const dict_info = []

// 类型定义
type remove_ids_user_type = { ids: string[] }

export let api_v1 = {
  auth: {
    find_menu_tree_by_user_id: () => axios_api.post("/v1/auth/find_menu_tree_by_user_id"),
    find_depart_by_user_id: () => axios_api.post("/v1/auth/find_depart_by_user_id"),
    find_list_user: (form: { depart_id: string }) => axios_api.post("/v1/auth/find_list_user", form),
  },

  dict: {
    save_dict: (form: { parent_id?: string; id?: string; name: string; code: string; remark: string; status: boolean; sort: number }) => axios_api.post("/v1/dict/save_dict", form),
    remove_dict_ids: (form: { ids: string[] }) => axios_api.post("/v1/dict/remove_dict_ids", form),
    find_list_dict: (form: { parent_id?: string }) => axios_api.post("/v1/dict/find_list_dict", form),
  },

  depart: {
    create_depart_role_menu: (form: { parent_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/v1/depart/create_depart_role_menu", form),
    edit_depart_role_menu: (form: { depart_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/v1/depart/edit_depart_role_menu", form),
    find_depart_role: (form: { depart_id: string }) => axios_api.post("/v1/depart/find_depart_role", form),
    update_depart_role_menu: (form: { role_id: string; nodes_id: string[] }) => axios_api.post("/v1/depart/update_depart_role_menu", form),
    create_depart_menu: (form: { depart_parent_id: string; depart_name: string; role_name: string; menu_button_ids: string[] }) => axios_api.post("/v1/depart/create_depart_menu", form),
    create_list_depart_role_menu: (form: { depart_parent_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/v1/depart/create_list_depart_role_menu", form),
    delete_depart_role_ids: (form: { ids: string[] }) => axios_api.post("/v1/depart/delete_depart_role_ids", form),
    update_list_depart_role_menu: (form: { depart_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/v1/depart/update_list_depart_role_menu", form),
  },

  menu: {
    find_tree_menu: () => axios_api.post("/v1/menu/find_tree_menu"),
  },

  user: {
    find_one_user: (form: { user_id: string }) => axios_api.post("/v1/user/find_one_user", form),
    find_tree_depart: () => axios_api.post("/v1/user/find_tree_depart"),
    find_list_user: (form: { depart_id: string }) => axios_api.post("/v1/user/find_list_user", form),
    save_user: (form: { user_id: string; name: string; phone: string; gender: string; remark: string; role_ids: string[] }) => axios_api.post("/v1/user/save_user", form),
    remove_ids_user: (form: remove_ids_user_type) => axios_api.post("/v1/user/remove_ids_user", form),
    update_user_info: (form: { id: string; name: string; gender: string; avatar: string }) => axios_api.post("/v1/user/update_user_info", form),
  },

  product: {
    find_list_product_public: (form: { title: string }) => axios_api.post("/v1/product/find_list_product_public", form),
    find_list_product_admin: (form: { title: string; is_admin: boolean; type_check: string }) => axios_api.post("/v1/product/find_list_product_admin", form),
    find_one_product: (form: { product_id: string }) => axios_api.post("/v1/product/find_one_product", form),
    remove_product_ids: (form: { ids: string[] }) => axios_api.post("/v1/product/remove_product_ids", form),
    publish_product: (form: { product_id: string; is_publish: boolean }) => axios_api.post("/v1/product/publish_product", form),
    check_product: (form: { product_id: string; type_check: string; type_check_remark: string }) => axios_api.post("/v1/product/check_product", form),
    save_product: (form: {
      product_id?: string
      user_id: string
      title: string
      remark: string
      is_publish: boolean
      price_type: string
      type_product: string
      arg_product_model: {
        price_free: number
        price_personal: number
        price_company: number
        price_extend: number
        is_plugin: boolean
        is_plugin_remark: string
        list_main_img: info_file[]
        list_wireframe: info_file[]
        list_video: info_file[]
        list_extend: info_file[]
      }
    }) => axios_api.post("/v1/product/save_product", form),
  },
  print_product_upload: {
    find_list_print_product_upload: (form: { user_id: string }) => axios_api.post("/v1/print_product_upload/find_list_print_product_upload", form),
    find_one_print_product_upload: (form: { product_id: string }) => axios_api.post("/v1/print_product_upload/find_one_print_product_upload", form),
    save_print_product_upload: (form: {
      product_id: string
      user_id: string
      fileNameOriginal: string
      size_format: string
      size: number
      url: string
      url_screenshot: string
      length: number
      width: number
      height: number
      surface_area: number
      volume: number
      complexity: number
      structural_strength: number
      num_faces: number
      points: number
      min_thickness: number
      thickness_proportion: number
    }) => axios_api.post("/v1/print_product_upload/save_print_product_upload", form),
    remove_ids_print_product_upload: (form: { ids: string[] }) => axios_api.post("/v1/print_product_upload/remove_ids_print_product_upload", form),
  },

  shop_cart: {
    save_shop_cart: (form: { card_id?: string; user_id: string; price_type: string; count: number; product_id: string }) => axios_api.post("/v1/shop_cart/save_shop_cart", form),
    find_list_shop_cart: (form: { user_id: string }) => axios_api.post("/v1/shop_cart/find_list_shop_cart", form),
    remove_shop_cart_ids: (form: { ids: string[] }) => axios_api.post("/v1/shop_cart/remove_shop_cart_ids", form),
    compute_price_shop_cart: (form: { checked_items: { card_id: string; count: number }[] }) => axios_api.post("/v1/shop_cart/compute_price_shop_cart", form),
  },

  shop_order: {
    create_shop_order: (form: { user_id: string; card_ids: string[]; type_order: string }) => axios_api.post("/v1/shop_order/create_shop_order", form),
    remove_shop_order_ids: (form: { ids: string[] }) => axios_api.post("/v1/shop_order/remove_shop_order_ids", form),
    find_list_shop_order: (form: { user_id: string; status: string; type_order: string }) => axios_api.post("/v1/shop_order/find_list_shop_order", form),
  },
  pay: {
    pay_method_make_url_qr: (form: { order_id: string; pay_method: string; price_total: number }) => axios_api.get("/v1/pay/pay_method_make_url_qr", { params: form }),
    pay_callback: (form: { order_id: string; pay_method: string; price_total: number }) => axios_api.get("/v1/pay/pay_callback", { params: form }),
    find_one_shop_order: (form: { order_id: string }) => axios_api.post("/v1/pay/find_one_shop_order", form),
  },
  user_address_take: {
    find_one_user_address_take: (form: { user_id: string }) => axios_api.post("/v1/user_address_take/find_one_user_address_take", form),
    save_user_address_take: (form: { id: string; user_id: string; name: string; phone: string; region: any; street: string; is_default: boolean; type_tag: string }) => axios_api.post("/v1/user_address_take/save_user_address_take", form),
    remove_ids_user_address_take: (form: { ids: string[] }) => axios_api.post("/v1/user_address_take/remove_ids_user_address_take", form),
  },

  print_card: {
    find_list_print_cart: (form: { user_id: string }) => axios_api.post("/v1/print_card/find_list_print_cart", form),
    remove_card_print_ids: (form: { ids: string[] }) => axios_api.post("/v1/print_card/remove_card_print_ids", form),
    save_print_cart: (form: info_print_card) => axios_api.post("/v1/print_card/save_print_cart", form),
  },
  arg_print_material: {
    find_list_arg_print_material: () => axios_api.post("/v1/arg_print_material/find_list_arg_print_material"),
  },
}
