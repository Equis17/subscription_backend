import Router from 'koa-router';
import bookListController from '../../controller/BookList'

const router = new Router();

router.prefix('/api/sys/bookList');

router.get('/getList', bookListController.getList);
router.post('/add', bookListController.add);
router.post('/delete/:id', bookListController.delete);
router.post('/update/:id', bookListController.update);

export default router;
