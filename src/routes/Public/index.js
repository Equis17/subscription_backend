import Router from 'koa-router'
import publicController from '../../controller/Public'
import LoginController from '../../controller/Login'

const router = new Router();
router.prefix('/api/public');

router.get('/getPublicKey', publicController.getPublicKey);
router.post('/decrypt', publicController.decrypt);
router.get('/getCaptcha', publicController.getCaptcha);
router.post('/login', LoginController.login);
router.get('/getExcel/:auth',publicController.createExcel);

export default router;
