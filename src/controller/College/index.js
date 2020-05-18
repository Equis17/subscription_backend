import CollegeModel from '../../model/College'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import categoryModel from '../../model/Category';

const Op = Sequelize.Op;

class CollegeController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2, 3].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {collegeName = '', toggle} = ctx.query;
      ctx.body = await CollegeModel.getList({collegeName: {[Op.like]: `%${collegeName}%`}, toggle})
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {collegeName, toggle} = ctx.request.body;
      ctx.body = await CollegeModel.insert({collegeName, toggle});
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await CollegeModel.deleteById({id});
    }
  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {collegeName, toggle} = ctx.request.body;
      ctx.body = await CollegeModel.update({id, collegeName, toggle})
    }
  }
}

export default new CollegeController();
