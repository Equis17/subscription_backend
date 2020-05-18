import Router from 'koa-router'
import quoteController from '../../controller/Quote'

const router = new Router();
router.prefix('/api/sys/quote');

router.get('/getList', quoteController.getList);
router.post('/add', quoteController.add);
router.post('/delete/:id', quoteController.delete);
router.post('/update/:id', quoteController.update);
router.post('/sub', quoteController.sub);


export default router;
