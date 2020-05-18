import Router from 'koa-router'
import classController from '../../controller/Class'

const router = new Router();

router.prefix('/api/sys/classManage');

router.get('/getList', classController.getList);
router.post('/add', classController.add);
router.post('/delete/:id', classController.delete);
router.post('/update/:id', classController.update);
router.get('/getListByClassId/:classId', classController.getListByClassId);
export default router;
