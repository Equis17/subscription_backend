import userModel from '../../model/User'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import sysManagerModel from '../../model/SysManager';

const Op = Sequelize.Op;

class UserManageController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (authId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {roleId, account = '', realName = '', phoneNumber = '', toggle} = ctx.query;
      ctx.body = await userModel.getList({
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
      ctx.body = await userModel.insert({roleId, account, password, realName, phoneNumber, toggle})
    }
  }

  async delete(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await userModel.deleteById({id})
    }
  }

  async update(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (authId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
      ctx.body = await userModel.update({id, roleId, account, password, realName, phoneNumber, toggle});
    }
  }

  async getTeacherList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (authId !== 1) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await userModel.getTeacherList();
    }
  }

  async getAssignUserList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {toggle} = ctx.query;
      ctx.body = await userModel.getAssignUserList(toggle);
    }
  }

  async getInfo(ctx) {
    const {_auth: roleId, _id: account} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await userModel.getUserInfo({roleId, account})
    }
  }

  async getAssignList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {account = '', realName = '', phoneNumber = '', toggle} = ctx.query;
      ctx.body = await userModel.getList({
        roleId: '6',
        toggle,
        account: {[Op.like]: `%${account}%`},
        realName: {[Op.like]: `%${realName}%`},
        phoneNumber: {[Op.like]: `%${phoneNumber}%`}
      })
    }
  }

  async addAssign(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {account, password, realName, phoneNumber, toggle} = ctx.request.body;
      ctx.body = await userModel.insert({roleId: '6', account, password, realName, phoneNumber, toggle})

    }
  }


  async updateAssign(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {account, password, realName, phoneNumber, toggle} = ctx.request.body;
      ctx.body = await userModel.update({id, roleId: '6', account, password, realName, phoneNumber, toggle});
    }
  }

  async editInfo(ctx) {
    const {_auth: authId, _uid: userId, _id: account} = JWTDecode(ctx.header.authorization);
    if (authId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {password, phoneNumber} = ctx.request.body;
      ctx.body = await userModel.editUserInfo({account, userId, password, phoneNumber})
    }
  }
}

export default new UserManageController();
