
// 获取对象的所有可访问属性(相当域copy)
export function util_obj_copy(obj: any): Record<string, any> {
    const result: Record<string, any> = {}

    // 获取自有属性
    Object.getOwnPropertyNames(obj).forEach((key) => {
        try {
            result[key] = obj[key]
        } catch (e) {
            result[key] = "[无法访问]"
        }
    })

    // 获取原型链上的属性
    let proto = Object.getPrototypeOf(obj)
    while (proto && proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (!(key in result)) {
                try {
                    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
                    if (descriptor && descriptor.get) {
                        // 如果是 getter，尝试调用
                        try {
                            result[key] = descriptor.get.call(obj)
                        } catch (e) {
                            result[key] = "[getter]"
                        }
                    } else {
                        result[key] = obj[key]
                    }
                } catch (e) {
                    result[key] = "[无法访问]"
                }
            }
        })
        proto = Object.getPrototypeOf(proto)
    }

    return result
}

