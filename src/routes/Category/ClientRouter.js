import Router from 'koa-router'
import categoryController from '../../controller/Category'

const router = new Router();

router.prefix('/api/client/category');

router.get('/getList', categoryController.getUserList);

export default router;
