import Router from 'koa-router';
import userManageController from '../../controller/UserManage';

const router = new Router();

router.prefix('/api/sys/userManage');

router.get('/getList', userManageController.getList);
router.get('/getTeacherList', userManageController.getTeacherList);
router.get('/getAssignUserList', userManageController.getAssignUserList);
router.get('/getAssignerList', userManageController.getAssignList);
router.post('/add', userManageController.add);
router.post('/addAssigner', userManageController.addAssign);
router.post('/delete/:id', userManageController.delete);
router.post('/update/:id', userManageController.update);
router.post('/updateAssigner/:id', userManageController.updateAssign);

export default router;
