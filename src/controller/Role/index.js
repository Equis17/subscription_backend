import RoleModel from '../../model/Role'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode'

const Op = Sequelize.Op;

class RoleController {
  constructor() {
  }

  async getList(ctx) {
    const {roleName = '', toggle} = ctx.query;
    ctx.body = await RoleModel.getList({roleName: {[Op.like]: `%${roleName}%`}, toggle});
  }

  async add(ctx) {
    const {roleName, toggle} = ctx.request.body;
    ctx.body = await RoleModel.insert({roleName, toggle});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await RoleModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {roleName, toggle} = ctx.request.body;
    ctx.body = await RoleModel.update({id, roleName, toggle});
  }
}

export default new RoleController();
