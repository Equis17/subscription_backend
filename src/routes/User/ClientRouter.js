import Router from 'koa-router';
import userManageController from '../../controller/UserManage';

const router = new Router();

router.prefix('/api/client/userManage');

router.get('/getInfo', userManageController.getInfo);

export default router;
