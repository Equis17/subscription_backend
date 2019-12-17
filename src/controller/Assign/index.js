import assignModel from '../../model/Assign'
import sequelize from 'sequelize';
import bookListModel from '../../model/BookList';
import JWTDecode from 'jwt-decode';
import xlsx from 'node-xlsx'
const Op = sequelize.Op;

class AssignController {
  constructor() {
  }

  async getList(ctx) {
    const {className = '', assignName = '', userName = ''} = ctx.query;
    ctx.body = await assignModel.getList({
      className: {[Op.like]: `%${className}%`},
      assignName: {[Op.like]: `%${assignName}%`},
      userName: {[Op.like]: `%${userName}%`}
    })
  }

  async add(ctx) {
    const {userId, classId, status, assignId} = ctx.request.body;
    ctx.body = await assignModel.insert({userId, classId, status, assignId});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await assignModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {userId, classId, status, assignId} = ctx.request.body;
    ctx.body = await assignModel.update({id, userId, classId, status, assignId});
  }


}

export default new AssignController()
