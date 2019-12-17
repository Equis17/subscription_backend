import {Assign, Class, College, User} from '../model';
import _ from 'lodash'
import Sequelize from 'sequelize';

class AssignModel {

  async getList({className, assignName, userName}) {
    const where = _.pickBy({realName: userName}, _.identity);
    const classWhere = _.pickBy({className}, _.identity);
    const assignWhere = _.pickBy({realName: assignName}, _.identity);
    try {
      const assignList = await User.findAll({
        raw: true,
        where,
        include: [
          {
            model: Assign, attributes: [], right: true, include: [
              {model: User, attributes: [], as: 'user', where: assignWhere},
              {model: Class, attributes: [], as: 'class', where: classWhere, include: {model: College,attributes:[],as:'college'}}
            ]
          },
        ],
        attributes: [
          Sequelize.col('assigns.id'),
          'account',
          'realName',
          'phoneNumber',
          Sequelize.col('assigns.classId'),
          Sequelize.col('assigns.class.className'),
          Sequelize.col('assigns.class.college.collegeName'),
          Sequelize.col('assigns.class.session'),
          Sequelize.col('assigns.status'),
          Sequelize.col('assigns.assignId'),
          Sequelize.col('assigns.userId'),
          [Sequelize.col('assigns.user.account'), 'assignAccount'],
          [Sequelize.col('assigns.user.realName'), 'assignRealName'],
          [Sequelize.col('assigns.user.phoneNumber'), 'assignPhoneNumber'],
        ]
      });
      return {code: 0, data: assignList}
    } catch (e) {
      console.log('MethodError: <AssignModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async insert({userId = '', classId = '', status = '', assignId = ''}) {
    if (!_.isEmpty(_.omitBy({userId, classId, status, assignId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Assign.create({userId, classId, status, assignId})
    } catch (e) {
      console.log('MethodError: <AssignModel.insert>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Assign.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <AssignModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', userId = '', classId = '', status = '', assignId = ''}) {
    if (!_.isEmpty(_.omitBy({id, userId, classId, status, assignId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Assign.update(
        {userId, classId, status, assignId},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <AssignModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

}

export default new AssignModel()
