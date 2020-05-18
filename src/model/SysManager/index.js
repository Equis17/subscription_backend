import {SysManager, Role} from '../model';
import _ from 'lodash'
import Sequelize from 'sequelize';

class SysManagerModel {
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
      const sysManagerList = await SysManager.findAll({
        where,
        include: [{model: Role, attributes: [], as: 'role'}],
        raw: true,
        attributes: ['id', 'roleId', Sequelize.col('role.roleName'), 'account', 'realName', 'phoneNumber', 'toggle']
      });
      return {code: 0, data: sysManagerList}
    } catch (e) {
      console.log('MethodError: <SysManager.getList>');
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
      await SysManager.create({roleId, account, realName, phoneNumber, password, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <SysManagerModel.insert>');
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
      await SysManager.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <SysManagerModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', roleId = '', account = '', realName = '', phoneNumber = '', password = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({id, roleId, account, realName, phoneNumber, password, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await SysManager.update(
        {roleId, account, realName, phoneNumber, password, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <SysManagerModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

}

export default new SysManagerModel()
