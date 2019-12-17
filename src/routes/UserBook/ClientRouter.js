import Router from 'koa-router'
import userBookController from '../../controller/UserBook'

const router = new Router();

router.prefix('/api/client/userBook');

router.get('/getList', userBookController.getUserBookList);
router.post('/handle', userBookController.handleUserBook);
router.get('/getUserBook', userBookController.getUserBook);

export default router;
