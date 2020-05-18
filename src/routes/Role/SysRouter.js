import Router from 'koa-router'
import roleController from '../../controller/Role'

const router = new Router();
router.prefix('/api/sys/role');

router.get('/getList', roleController.getList);
router.post('/add', roleController.add);
router.post('/delete/:id', roleController.delete);
router.post('/update/:id', roleController.update);


export default router;
