import classModel from '../../model/Class'
import stuClassModel from '../../model/StuClass'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = sequelize.Op;

class ClassController {
  constructor(props) {
  }

  async getList(ctx) {
    const {collegeId, className = '', session = '', toggle} = ctx.query;
    ctx.body = await classModel.getList({
      collegeId,
      toggle,
      session: {[Op.like]: `%${session}%`},
      className: {[Op.like]: `%${className}%`}
    });
  }

  async add(ctx) {
    const {collegeId, className, session, toggle} = ctx.request.body;
    ctx.body = await classModel.insert({collegeId, className, session, toggle});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await classModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {collegeId, className, session, toggle} = ctx.request.body;
    ctx.body = await classModel.update({id, collegeId, session, className, toggle})
  }

  async getListByClassId(ctx) {
    const {classId} = ctx.params;
    ctx.body = await stuClassModel.getListByClassId({classId})
  }

  async getUserClassList(ctx) {
    ctx.body = await classModel.getUserClassList();
  }
  async getAssignerList(ctx){
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    ctx.body=await classModel.getAssignerClassList({assignId});
  }
}

export default new ClassController();
