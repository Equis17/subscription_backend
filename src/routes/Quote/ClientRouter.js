import Router from 'koa-router'
import quoteController from '../../controller/Quote'

const router = new Router();
router.prefix('/api/client/quote');


router.get('/getList', quoteController.getQuotedList);
router.post('/update/:id', quoteController.updateQuote);
router.post('/add', quoteController.addQuote);
router.post('/cancel', quoteController.cancel);

export default router;
