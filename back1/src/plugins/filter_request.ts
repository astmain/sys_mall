import { Request, Response, NextFunction } from 'express'
import { INestApplication } from '@nestjs/common'
import * as express from 'express'

// 自定义
import { Color } from './Color'

export async function filter_request(app: INestApplication) {
  app.use(filter_request_func)
}

function filter_request_func(req: Request, res: Response, next: NextFunction) {
  const fullUrl = req.originalUrl
  const method = req.method // 获取请求方法
  console.log(Color.purple + `filter_request: ===================== [${method}] ${fullUrl} =====================`, Color.reset)
  next()
}
