import Router from 'koa-router';
import bookListController from '../../controller/BookList'

const router = new Router();

router.prefix('/api/client/bookList');

router.get('/getUserBookList', bookListController.getBookListInfo);
router.get('/getAssignerBookListWithClass',bookListController.getAssignerBookListWithClass);
router.post('/edit/:id', bookListController.edit);
router.get('/getToSubList', bookListController.getToSubList);
router.get('/getAssignerBookList', bookListController.getAssignerBookList);

export default router;
