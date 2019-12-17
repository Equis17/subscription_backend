import {Course, User, College} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

class CourseModel {
  /**
   * @param {string} userId
   * @param {string} collegeId
   * @param {string} courseName
   * @param {string} courseTime
   * @param {string} collegeIds
   * @param {string} sessions
   * @return {Object}
   */
  async getList({userId = '', collegeId = '', courseName = '', courseTime = '', collegeIds = '', sessions = ''}) {
    const where = _.pickBy({userId, collegeId, courseName, courseTime, collegeIds, sessions}, _.identity);
    try {
      const courseList = await Course.findAll({
        where,
        include: [
          {model: User, attributes: [],as:'user'},
          {model: College, attributes: [],as:'college'}
        ],
        raw: true,
        attributes: [
          'id',
          'userId',
          'collegeId',
          'courseName',
          'courseTime',
          'collegeIds',
          'sessions',
          Sequelize.col('user.account'),
          Sequelize.col('user.realName'),
          Sequelize.col('user.phoneNumber'),
          Sequelize.col('college.collegeName')
        ]
      });
      return {code: 0, data: courseList}
    } catch (e) {
      console.log('MethodError: <CourseModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} userId
   * @param {string} collegeId
   * @param {string} courseName
   * @param {string} courseTime
   * @param {string} collegeIds
   * @param {string} sessions
   * @return {Object}
   */
  async insert({userId = '', collegeId = '', courseName = '', courseTime = '', collegeIds = '', sessions = ''}) {
    if (!_.isEmpty(_.omitBy({userId, collegeId, courseName, courseTime, collegeIds, sessions}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Course.create({userId, collegeId, courseName, courseTime, collegeIds, sessions});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <CourseModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @return {Object}
   * */
  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Course.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <CourseModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} userId
   * @param {string} collegeId
   * @param {string} courseName
   * @param {string} courseTime
   * @param {string} collegeIds
   * @param {string} sessions
   * @return {Object}
   */
  async update({id = '', userId = '', collegeId = '', courseName = '', courseTime = '', collegeIds = '', sessions = ''}) {
    if (!_.isEmpty(_.omitBy({id, userId, collegeId, courseName, courseTime, collegeIds, sessions}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Course.update(
        {userId, collegeId, courseName, courseTime, collegeIds, sessions},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <CourseModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new CourseModel()

