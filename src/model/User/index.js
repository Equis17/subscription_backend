import {User, Role, StuClass, Class, College} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

class UserModel {
  /**
   * @param {string} roleId
   * @param {string} account
   * @param {string} realName
   * @param {string} phoneNumber
   * @param {string} toggle
   * @return {Object}
   * */
  async getList({roleId = '', account = '', realName = '', phoneNumber = '', toggle = ''}) {
    const where = _.pickBy({roleId, account, realName, phoneNumber, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const userList = await User.findAll({
        where,
        include: [{model: Role, attributes: [], as: 'role'}],
        raw: true,
        attributes: ['id', 'roleId', Sequelize.col('role.roleName'), 'account', 'realName', 'phoneNumber', 'toggle']
      });
      return {code: 0, data: userList}
    } catch (e) {
      console.log('MethodError: <UserModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} roleId
   * @param {string} account
   * @param {string} realName
   * @param {string} phoneNumber
   * @param {string} password
   * @param {string} toggle
   * @return {Object}
   * */
  async insert({roleId = '', account = '', realName = '', phoneNumber = '', password = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({roleId, account, realName, phoneNumber, password, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await User.create({roleId, account, realName, phoneNumber, password, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log(e);
      console.log('MethodError: <UserModel.insert>');
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
      await User.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <UserModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} roleId
   * @param {string} account
   * @param {string} realName
   * @param {string} phoneNumber
   * @param {string} password
   * @param {string} toggle
   * @return {Object}
   * */
  async update({id = '', roleId = '', account = '', realName = '', phoneNumber = '', password = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({id, roleId, account, realName, phoneNumber, password, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await User.update(
        {roleId, account, realName, phoneNumber, password, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <UserModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getTeacherList() {
    try {
      const teacherList = await User.findAll({
        where: {
          roleId: '3',
          toggle: '1'
        },
        include: [{model: Role, attributes: [], as: 'role'}],
        raw: true,
        attributes: ['id', 'roleId', Sequelize.col('role.roleName'), 'account', 'realName', 'phoneNumber', 'toggle']
      });
      return {code: 0, data: teacherList}
    } catch (e) {
      console.log('MethodError: <UserModel.getTeacherList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async getAssignUserList(toggle = '') {
    try {
      const assignList = await User.findAll({
        raw: true,
        where: {
          roleId: toggle ? '6' : '3'
        },
        attributes: [
          'id',
          'account',
          'realName'
        ]
      });
      return {code: 0, data: assignList}
    } catch (e) {
      console.log('MethodError: <UserModel.getAssignList>');

      return {code: 9999, message: '系统内部错误'}
    }
  }

  async getUserInfo({roleId = '', account = ''}) {
    try {
      const userInfo = await User.findOne({
        raw: true,
        where: {roleId, account},
        include: [
          {model: Role, attributes: [], as: 'role'}
        ],
        attributes: [
          'id',
          'account',
          'realName',
          'phoneNumber',
          Sequelize.col('role.roleName')
        ]
      });

      const classInfo = userInfo
        ? await StuClass.findOne(
          {
            raw: true,
            where: {userId: userInfo.id},
            include: [
              {
                model: Class,
                attributes: [],
                as: 'class',
                include: [
                  {model: College, attributes: [], as: 'college'}
                ]
              }
            ],
            attributes: [
              Sequelize.col('class.className'),
              Sequelize.col('class.session'),
              Sequelize.col('class.college.collegeName')
            ]
          })
        : {};

      return {code: 0, data: {...userInfo, ...classInfo}}
    } catch (e) {
      console.log(e)
    }
  }

}

export default new UserModel()
