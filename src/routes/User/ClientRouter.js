import Router from 'koa-router';
import userManageController from '../../controller/UserManage';

const router = new Router();

router.prefix('/api/client/user');

router.get('/getInfo', userManageController.getInfo);
router.post('/editInfo',userManageController.editInfo);

export default router;
