import sysManagerModel from '../../model/SysManager'
import sequelize from 'sequelize';
import categoryModel from '../../model/Category';
import JWTDecode from 'jwt-decode';

const Op = sequelize.Op;

class SysManagerController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {roleId, account = '', realName = '', phoneNumber = '', toggle} = ctx.query;
      ctx.body = await sysManagerModel.getList({
        roleId,
        toggle,
        account: {[Op.like]: `%${account}%`},
        realName: {[Op.like]: `%${realName}%`},
        phoneNumber: {[Op.like]: `%${phoneNumber}%`}
      })
    }
  }

  async add(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (authId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
      ctx.body = await sysManagerModel.insert({roleId, account, password, realName, phoneNumber, toggle})
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await sysManagerModel.deleteById({id});
    }
  }

  async update(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (authId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
      ctx.body = await sysManagerModel.update({id, roleId, account, password, realName, phoneNumber, toggle})
    }
  }

}

export default new SysManagerController();
