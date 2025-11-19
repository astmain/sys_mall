import { DataSource } from 'typeorm';
import { sys_menu } from './entity/sys_menu';
import { sys_user } from './entity/sys_user';
import { sys_depart } from './entity/sys_depart';
export const db1_connect = new DataSource({
    type: 'postgres',
    url: 'postgresql://root:123456@103.119.2.223:2006/back?schema=public',
    entities: [sys_menu, sys_user, sys_depart],
    extra: { timezone: 'Asia/Shanghai' },
    synchronize: true,
    logging: false,
});
export const db1 = db1_connect.manager;
async function test1() {
    if (!db1_connect.isInitialized) {
        await db1_connect.initialize();
    }
    const list = await db1_connect.getRepository(sys_depart).createQueryBuilder().select('id').addSelect('name').addSelect('parent_id').where('parent_id = :parent_id', { parent_id: 'depart_1' }).getRawMany();
    console.log(`list---`, list);
    await db1_connect.destroy();
}
test1().catch(console.error);
//# sourceMappingURL=db1.js.map