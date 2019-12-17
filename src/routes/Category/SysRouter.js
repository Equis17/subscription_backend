import Router from 'koa-router'
import categoryController from '../../controller/Category'

const router = new Router();

router.prefix('/api/sys/category');

router.get('/getList', categoryController.getList);
router.post('/update/:id', categoryController.update);
router.post('/add', categoryController.add);


export default router;
