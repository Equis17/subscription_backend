import Router from 'koa-router';
import sysManagerController from '../../controller/SysManager';

const router = new Router();

router.prefix('/api/sys/sysManager');

router.get('/getList', sysManagerController.getList);
router.post('/add', sysManagerController.add);
router.post('/delete/:id', sysManagerController.delete);
router.post('/update/:id', sysManagerController.update);

export default router;
