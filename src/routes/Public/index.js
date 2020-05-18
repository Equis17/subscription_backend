import Router from 'koa-router'
import publicController from '../../controller/Public'
import LoginController from '../../controller/Login'
import roleController from '../../controller/Role';

const router = new Router();
router.prefix('/api/public');

router.get('/getPublicKey', publicController.getPublicKey);
router.post('/decrypt', publicController.decrypt);
router.get('/getCaptcha', publicController.getCaptcha);
router.post('/login', LoginController.login);
router.get('/getRoleList', roleController.getList);
router.get('/getExcel/:auth',publicController.createExcel);
router.get('/getExcelDetail/:auth',publicController.createExcelDetail);

router.get('/test',publicController.test);
export default router;
