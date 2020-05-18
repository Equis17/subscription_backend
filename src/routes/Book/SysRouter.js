import Router from 'koa-router';
import bookController from '../../controller/Book'

const router = new Router();

router.prefix('/api/sys/book');

router.get('/getList', bookController.getList);
router.get('/getBookQuoteList', bookController.getBookQuoteList);
router.post('/add', bookController.add);
router.post('/delete/:id', bookController.delete);
router.post('/update/:id', bookController.update);

export default router;
