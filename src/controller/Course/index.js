import courseModel from '../../model/Course';
import courseBookModel from '../../model/CourseBook'
import sequelize from 'sequelize';

const Op = sequelize.Op;

class CourseController {
  constructor(props) {
  }

  async getList(ctx) {
    const {userId, collegeId, courseName = '', courseTime = '', collegeIds = '', sessions = ''} = ctx.query;
    ctx.body = await courseModel.getList({
      userId,
      collegeId,
      courseName: {[Op.like]: `%${courseName}%`},
      courseTime: {[Op.like]: `%${courseTime}%`},
      collegeIds: {[Op.like]: `%${collegeIds}%`},
      sessions: {[Op.like]: `%${sessions}%`}
    })
  }

  async add(ctx) {
    const {userId, collegeId, courseName, courseTime, collegeIds, sessions} = ctx.request.body;
    ctx.body = await courseModel.insert({userId, collegeId, courseName, courseTime, collegeIds, sessions});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await courseModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {collegeId, userId, courseName, courseTime, collegeIds, sessions} = ctx.request.body;
    ctx.body = await courseModel.update({id, collegeId, userId, courseName, courseTime, collegeIds, sessions});
  }

  async getDetailList(ctx) {
    const {id} = ctx.params;
    ctx.body = await courseBookModel.getCourseBookByCourseId({id});
  }

  async updateDetail(ctx) {
    const {id} = ctx.params;
    const {courseBookList = []} = ctx.request.body;

    ctx.body = await courseBookModel.updateCourseBookByCourseId({id, courseBookList})
  }

  async deleteDetail(ctx) {
    const {id} = ctx.params;
    ctx.body = await courseBookModel.deleteById({id})
  }
}

export default new CourseController();
