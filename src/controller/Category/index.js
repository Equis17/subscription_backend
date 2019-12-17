import categoryModel from '../../model/Category'
import JWTDecode from 'jwt-decode';

class CategoryController {
  constructor(props) {
  }

  async getList(ctx) {
    ctx.body = await categoryModel.getList();
  }

  async add(ctx) {
    const {routerList = [], roleId} = ctx.request.body;
    ctx.body = await categoryModel.insert({routerIds: routerList.toString(), roleId})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {roleId, routerList = []} = ctx.request.body;
    ctx.body = await categoryModel.update({id, routerIds: routerList.toString(), roleId})
  }

  async getUserList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    ctx.body = await categoryModel.getCategoryList({roleId});
  }
}

export default new CategoryController();
