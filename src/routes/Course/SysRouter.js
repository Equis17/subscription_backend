import Router from 'koa-router'
import courseController from '../../controller/Course'

const router = new Router();

router.prefix('/api/sys/course');

router.get('/getList', courseController.getList);
router.post('/add', courseController.add);
router.post('/delete/:id', courseController.delete);
router.post('/update/:id', courseController.update);

router.get('/detail/getList/:id', courseController.getDetailList);
router.post('/detail/update/:id', courseController.updateDetail);
router.get('/detail/delete/:id', courseController.deleteDetail);


export default router;
