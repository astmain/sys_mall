import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import dayjs from 'dayjs'

export interface Response<T> {
  code: number
  result: T
  msg: string
  timestamp: string
}

/**
 * 将 Date 对象或 ISO 字符串格式化为 YYYY-MM-DD HH:mm:ss SSS 格式
 * @param date Date 对象或 ISO 字符串
 * @returns 格式化后的时间字符串
 */
export function format_date_time(date: Date | string): string {
  const dayjs_obj = dayjs(date)

  if (!dayjs_obj.isValid()) {
    return date.toString() // 如果日期无效，返回原字符串
  }

  return dayjs_obj.format('YYYY-MM-DD HH:mm:ss.SSS')
}

/**
 * 递归格式化对象中的所有时间字段
 * @param obj 要格式化的对象
 * @returns 格式化后的对象
 */
export function format_object_dates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (obj instanceof Date) {
    return format_date_time(obj)
  }

  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
    // 检查是否为 ISO 日期字符串
    return format_date_time(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => format_object_dates(item))
  }

  if (typeof obj === 'object') {
    const formatted_obj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'at_created' || key === 'at_updated') {
          formatted_obj[key] = format_date_time(obj[key])
        } else {
          formatted_obj[key] = format_object_dates(obj[key])
        }
      }
    }
    return formatted_obj
  }

  return obj
}

@Injectable()
export class filter_response_func<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 格式化响应数据中的时间字段
        const formatted_data = format_object_dates(data)
        // console.log(`formatted_data:`, formatted_data)
        const res_response = { code: formatted_data?.code, msg: formatted_data?.msg, result: formatted_data?.result, timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS') }
        // console.log(`filter_response:`,  JSON.stringify(res_response,null,2))
        return res_response
      })
    )
  }
}

export async function filter_response(app) {
  app.useGlobalInterceptors(new filter_response_func())
}
