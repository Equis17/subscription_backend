import Router from 'koa-router'
import sellerController from '../../controller/Seller'

const router = new Router();

router.prefix('/api/sys/seller');

router.get('/getList', sellerController.getList);
router.get('/getSelectList', sellerController.getSelectList);
router.post('/add', sellerController.add);
router.post('/delete/:id', sellerController.delete);
router.post('/update/:id', sellerController.update);

export default router;
