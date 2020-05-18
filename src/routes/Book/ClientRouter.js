import Router from 'koa-router';
import bookController from '../../controller/Book'

const router = new Router();

router.prefix('/api/client/book');

router.get('/getUserBook', bookController.getUserBook);
router.post('/applyBook', bookController.applyBook);

export default router;
