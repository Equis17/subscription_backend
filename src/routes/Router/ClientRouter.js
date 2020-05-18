import Router from 'koa-router'
import routerController from '../../controller/Router';

const router = new Router();

router.prefix('/api/client/router');

router.get('/getList', routerController.getList);
router.post('/add', routerController.add);
router.post('/delete/:id', routerController.delete);
router.post('/update/:id', routerController.update);

export default router;
