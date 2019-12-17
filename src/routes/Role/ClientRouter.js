import Router from 'koa-router'
import roleController from '../../controller/Role'

const router = new Router();

router.prefix('/api/public');

router.get('/getRoleType', roleController.getList);


export default router;
