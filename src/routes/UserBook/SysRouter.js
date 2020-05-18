import Router from 'koa-router'
import userBookController from '../../controller/UserBook'

const router = new Router();

router.prefix('/api/sys/userBook');

router.get('/getList', userBookController.getList);
router.post('/add', userBookController.add);
router.post('/delete/:id', userBookController.delete);
router.post('/update/:id', userBookController.update);
router.get('/getBookListByUserId/:userId', userBookController.getBookListByUserId);
router.post('/updateDetail/:id', userBookController.updateDetail);
export default router;
