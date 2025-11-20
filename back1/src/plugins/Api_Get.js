import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Get, applyDecorators } from '@nestjs/common';
export function Api_Get(label, description, Res_type) {
    return function (target, propertyKey, descriptor) {
        const decorators = applyDecorators(ApiOkResponse({ description: '操作成功', type: Res_type }), Get(propertyKey), ApiOperation({
            summary: label,
            description: `<h3 style="color: rgb(73, 204, 144) ;">[${label}]</h3>${description || ''}`,
        }));
        return decorators(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=Api_Get.js.map