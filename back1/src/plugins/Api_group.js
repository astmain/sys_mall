import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import 'reflect-metadata';
const list_version = ['common', 'v1', 'v2', 'test'];
export function Api_group(version, name) {
    return function (target) {
        const controller_path = version === 'common' ? target.name : `${version}/${target.name}`;
        const v_name = `${version}${name}`;
        const decorators = applyDecorators(Controller(controller_path), ApiTags(v_name));
        return decorators(target);
    };
}
//# sourceMappingURL=Api_group.js.map