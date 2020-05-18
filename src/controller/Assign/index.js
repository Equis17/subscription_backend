import assignModel from '../../model/Assign'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = sequelize.Op;

class AssignController {
  constructor() {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {className = '', assignName = '', userName = ''} = ctx.query;
      ctx.body = await assignModel.getList({
        className: {[Op.like]: `%${className}%`},
        assignName: {[Op.like]: `%${assignName}%`},
        userName: {[Op.like]: `%${userName}%`}
      })
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {userId, classId, status, assignId} = ctx.request.body;
      ctx.body = await assignModel.insert({userId, classId, status, assignId});
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await assignModel.deleteById({id})
    }

  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {userId, classId, status, assignId} = ctx.request.body;
      ctx.body = await assignModel.update({id, userId, classId, status, assignId});
    }
  }
}

export default new AssignController()
