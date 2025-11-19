//跨域配置
export async function filter_cors(app) {
  //
  // const config = {
  //     origin: true,
  //     methods: 'GET,PUT,POST',
  //     allowedHeaders: 'Content-Type,Authorization',
  //     exposedHeaders: 'Content-Range,X-Content-Range',
  //     credentials: true,
  //     maxAge: 3600,
  // }

  // const config = {
  //   origin: "*",
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept, token', // 允许 token 头
  //   exposedHeaders: 'Content-Range,X-Content-Range',
  //   credentials: true, // 允许携带凭证（如 cookies, authorization headers）
  //   maxAge: 3600,
  // }

  // ⚠️ 最宽松的CORS配置 —— 仅用于开发环境！
  const config = {
    origin: '*', // 允许所有来源
    methods: '*', // 允许所有HTTP方法
    allowedHeaders: '*', // 允许所有请求头
    exposedHeaders: '*', // 暴露所有响应头
    credentials: false, // 注意：当 origin 为 '*' 时，credentials 必须为 false
  }

  app.enableCors(config)
}
