import {User, Class, StuClass, College, Role} from '../model';
import _ from 'lodash'
import Sequelize from 'sequelize';
//TODO 制作班级详情
//返回学生班级列表 只有学生的班级信息
class StuClassModel {
  async getList({classId = '', account = '', realName = '', phoneNumber = '', roleId = '', roleName = '', collegeId, collegeName}) {
    const where = _.pickBy({classId, toggle}, _.identity);
    const userWhere = _.pickBy({account, realName, phoneNumber}, _.identity);
    const roleWhere = _.pickBy({roleId, roleName}, _.identity);
    const collegeWhere = _.pickBy({collegeId, collegeName});
    try {
      const stuClassList = await StuClass.findAll({
        where,
        raw: true,
        include: [
          {model: User, attributes: [], as: 'user', where: userWhere},
          {model: Role, attributes: [], as: 'role', where: roleWhere},
          {model: College, attributes: [], as: 'college', where: collegeWhere},
          {model: Class, attributes: [], as: 'class'}
        ],
        attributes: [
          Sequelize.col('role.roleName'),
          Sequelize.col('user.roleId'),
          Sequelize.col('user.account'),
          Sequelize.col('user.realName'),
          Sequelize.col('user.phoneNumber'),
          Sequelize.col('collegeId'),
        ]
      })
    } catch (e) {

    }
  }

  async getListByClassId({classId = ''}) {
    if (!_.isEmpty(_.omitBy({classId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const stuClassList = await StuClass.findAll({
        where: {classId},
        raw: true,
        include: [
          {model: User, as: 'user', attributes: [], include: {model: Role, attributes: [], as: 'role'}},
          {model: Class, attributes: [], as: 'class'}
        ],
        attributes: [
          'id',
          'classId',
          'userId',
          Sequelize.col('user.roleId'),
          Sequelize.col('user.account'),
          Sequelize.col('user.realName'),
          Sequelize.col('user.phoneNumber'),
          Sequelize.col('user.role.roleName'),
          Sequelize.col('class.className'),
          Sequelize.col('class.session')
        ],
        order: [[Sequelize.col('user.account')]]
      });
      return {code: 0, data: stuClassList}
    } catch (e) {
      console.log(e)
    }

  }

  async getInfoByUserId({userId = '', className = '', session = '', collegeName = ''}) {
    return StuClass.findOne({
      raw: true,
      where: {userId},
      include: [{model: Class, attributes: [], where: {className, session}, as: 'class', include: [{model: College, attributes: [], where: {collegeName}, as: 'college'}]}],
      attributes: [
        'classId',
        Sequelize.col('class.className'),
        Sequelize.col('class.session'),
        Sequelize.col('class.collegeId'),
        Sequelize.col('class.college.collegeName')
      ]
    });
  }

  async insertByUser({userId = '', classId = ''}) {
    try {
      await StuClass.create({userId, classId});
      return {code: 0, message: '保存成功'}
    } catch (e) {
      console.log(e)
    }
  }
}

export default new StuClassModel()
