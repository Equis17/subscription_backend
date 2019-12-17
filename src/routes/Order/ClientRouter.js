import Router from 'koa-router'
import orderController from '../../controller/Order'

const router = new Router();

router.prefix('/api/client/order');

router.post('/addToOrder', orderController.addToOrder);
router.post('/update/:id', orderController.updateBySeller);
router.post('/delete/:id', orderController.deleteBySeller);
router.get('/getList', orderController.getListById);
router.get('/getUserList', orderController.getListByUser);

export default router;
