import RouterModel from '../../model/Router'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode'

const Op = Sequelize.Op;

class RouterController {
  constructor() {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '暂无权限访问该接口'}
    } else {
      const {routerName = '', routerUrl = '', toggle} = ctx.query;
      ctx.body = await RouterModel.getList({
        routerName: {[Op.like]: `%${routerName}%`},
        routerUrl: {[Op.like]: `%${routerUrl}%`},
        toggle
      })
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '暂无权限访问该接口'}
    } else {
      const {routerName, routerUrl, toggle} = ctx.request.body;
      ctx.body = await RouterModel.insert({routerName, routerUrl, toggle});
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '暂无权限访问该接口'}
    } else {
      const {id} = ctx.params;
      ctx.body = await RouterModel.deleteById({id});
    }
  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '暂无权限访问该接口'}
    } else {
      const {id} = ctx.params;
      const {routerName, routerUrl, toggle} = ctx.request.body;
      ctx.body = await RouterModel.update({id, routerName, routerUrl, toggle});
    }
  }
}

export default new RouterController();
