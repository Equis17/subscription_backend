import sysManagerModel from '../../model/SysManager'
import sequelize from 'sequelize';

const Op = sequelize.Op;

class SysManagerController {
  constructor(props) {
  }

  async getList(ctx) {
    const {roleId, account = '', realName = '', phoneNumber = '', toggle} = ctx.query;

    ctx.body = await sysManagerModel.getList({
      roleId,
      toggle,
      account: {[Op.like]: `%${account}%`},
      realName: {[Op.like]: `%${realName}%`},
      phoneNumber: {[Op.like]: `%${phoneNumber}%`}
    })
  }

  async add(ctx) {
    const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await sysManagerModel.insert({roleId, account, password, realName, phoneNumber, toggle})
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await sysManagerModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {roleId, account, password, realName, phoneNumber, toggle} = ctx.request.body;
    ctx.body = await sysManagerModel.update({id, roleId, account, password, realName, phoneNumber, toggle})
  }
}

export default new SysManagerController();
