import Router from 'koa-router'
import publicController from '../../controller/Public'
import LoginController from '../../controller/Login'
import routerController from '../../controller/Router';

const router = new Router();
router.prefix('/api/public');

router.get('/getPublicKey', publicController.getPublicKey);
router.post('/decrypt', publicController.decrypt);
router.get('/getCaptcha', publicController.getCaptcha);
router.post('/login', LoginController.login);

export default router;
