import userModel from '../../model/User'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = Sequelize.Op;

class UserManageController {
  constructor(props) {
  }

  async getList(ctx) {
    const {roleId, account = '', realName = '', phoneNumber = '', toggle} = ctx.query;
    ctx.body = await userModel.getList({
      roleId,
      toggle,
      account: {[Op.like]: `%${account}%`},
      realName: {[Op.like]: `%${realName}%`},
      phoneNumber: {[Op.like]: `%${phoneNumber}%`}
    })
  }

  async add(ctx) {
    const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await userModel.insert({roleId, account, password, realName, phoneNumber, toggle})
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await userModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await userModel.update({id, roleId, account, password, realName, phoneNumber, toggle});
  }

  async getTeacherList(ctx) {
    ctx.body = await userModel.getTeacherList();
  }

  async getAssignUserList(ctx) {
    const {toggle} = ctx.query;
    ctx.body = await userModel.getAssignUserList(toggle);
  }

  async getInfo(ctx) {
    const {_auth: roleId, _id: account} = JWTDecode(ctx.header.authorization);
    ctx.body = await userModel.getUserInfo({roleId, account})
  }

  async getAssignList(ctx) {
    const {account = '', realName = '', phoneNumber = '', toggle} = ctx.query;
    ctx.body = await userModel.getList({
      roleId: '6',
      toggle,
      account: {[Op.like]: `%${account}%`},
      realName: {[Op.like]: `%${realName}%`},
      phoneNumber: {[Op.like]: `%${phoneNumber}%`}
    })
  }

  async addAssign(ctx) {
    const {account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await userModel.insert({roleId: '6', account, password, realName, phoneNumber, toggle})
  }


  async updateAssign(ctx) {
    const {id} = ctx.params;
    const {account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await userModel.update({id, roleId: '6', account, password, realName, phoneNumber, toggle});
  }

}

export default new UserManageController();
