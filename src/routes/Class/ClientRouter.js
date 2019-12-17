import Router from 'koa-router'
import classController from '../../controller/Class'

const router = new Router();

router.prefix('/api/client/classManage');
router.get('/getAssignerClassList',classController.getAssignerList);
router.get('/getUserClassList', classController.getUserClassList);

export default router;
