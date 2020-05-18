import Router from 'koa-router'
import orderController from '../../controller/Order'

const router = new Router();

router.prefix('/api/sys/order');

router.get('/getList', orderController.getList);
router.post('/add', orderController.add);
router.post('/delete/:id', orderController.delete);
router.post('/update/:id', orderController.update);


export default router;
