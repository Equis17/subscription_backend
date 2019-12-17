import CollegeModel from '../../model/College'
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

class CollegeController {
  constructor(props) {
  }

  async getList(ctx) {
    const {collegeName = '', toggle} = ctx.query;
    ctx.body = await CollegeModel.getList({collegeName: {[Op.like]: `%${collegeName}%`}, toggle})
  }

  async add(ctx) {
    const {collegeName, toggle} = ctx.request.body;
    ctx.body = await CollegeModel.insert({collegeName, toggle});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await CollegeModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {collegeName, toggle} = ctx.request.body;
    ctx.body=await CollegeModel.update({id,collegeName,toggle})
  }
}

export default new CollegeController();
