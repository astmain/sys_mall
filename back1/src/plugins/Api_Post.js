import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Post, applyDecorators } from '@nestjs/common';
export function Api_Post(label, description, Res_type) {
    return function (target, propertyKey, descriptor) {
        const decorators = applyDecorators(ApiOkResponse({ description: '操作成功', type: Res_type }), Post(propertyKey), ApiOperation({
            summary: label,
            description: `<h3 style="color: rgb(73, 204, 144) ;">[${label}]</h3>${description || ''}`,
        }));
        return decorators(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=Api_Post.js.map