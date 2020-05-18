import Router from 'koa-router'
import subscriptionController from '../../controller/Subscription'

const router = new Router();

router.prefix('/api/client/subscription');

router.get('/getList', subscriptionController.getListByAssigner);

export default router;
