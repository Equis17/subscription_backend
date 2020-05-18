import Router from 'koa-router'
import subscriptionController from '../../controller/Subscription'

const router = new Router();

router.prefix('/api/sys/subscription');

router.get('/getList', subscriptionController.getList);

router.post('/add', subscriptionController.add);
router.post('/delete/:id', subscriptionController.delete);
router.post('/update/:id', subscriptionController.update);

export default router;
