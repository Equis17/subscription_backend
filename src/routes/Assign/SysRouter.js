import Router from 'koa-router';
import assignController from '../../controller/Assign'

const router = new Router();

router.prefix('/api/sys/assign');

router.get('/getList', assignController.getList);
router.post('/add', assignController.add);
router.post('/delete/:id', assignController.delete);
router.post('/update/:id', assignController.update);

export default router;
