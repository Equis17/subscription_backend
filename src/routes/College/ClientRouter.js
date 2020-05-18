import Router from 'koa-router'
import collegeController from '../../controller/College'

const router = new Router();

router.prefix('/api/client/college');

router.get('/getList', collegeController.getList);
router.post('/add', collegeController.add);
router.post('/delete/:id', collegeController.delete);
router.post('/update/:id', collegeController.update);

export default router;
