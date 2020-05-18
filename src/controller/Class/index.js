import classModel from '../../model/Class'
import stuClassModel from '../../model/StuClass'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = sequelize.Op;

class ClassController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2, 3].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {collegeId, className = '', session = '', toggle} = ctx.query;
      ctx.body = await classModel.getList({
        collegeId,
        toggle,
        session: {[Op.like]: `%${session}%`},
        className: {[Op.like]: `%${className}%`}
      });
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {collegeId, className, session, toggle} = ctx.request.body;
      ctx.body = await classModel.insert({collegeId, className, session, toggle});
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await classModel.deleteById({id});
    }
  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {collegeId, className, session, toggle} = ctx.request.body;
      ctx.body = await classModel.update({id, collegeId, session, className, toggle})
    }

  }

  async getListByClassId(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {classId} = ctx.params;
      ctx.body = await stuClassModel.getListByClassId({classId})
    }
  }

  async getUserClassList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await classModel.getUserClassList();
    }
  }

  async getAssignerList(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 6) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await classModel.getAssignerClassList({assignId});
    }
  }

  async insertByUser(ctx) {
    const {_auth: roleId, _uid: userId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {classId} = ctx.request.body;
      ctx.body = await stuClassModel.insertByUser({userId, classId})
    }
  }
}

export default new ClassController();
