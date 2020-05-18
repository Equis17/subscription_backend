import {Role} from '../model'
import _ from 'lodash'

class RoleModel {

  async getList({roleName = '', toggle = ''}) {
    const where = _.pickBy({roleName, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const roleList = await Role.findAll({where, raw: true});
      return {code: 0, data: roleList}
    } catch (e) {
      console.log(e);
      console.log('MethodError: <RoleModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} roleName
   * @param {string} toggle
   * @return {Object}
   * */
  async insert({roleName = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({roleName, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Role.create({roleName, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <RoleModel.insert>');
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
      await Role.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <RoleModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }


  /**
   * @param {string} id
   * @param {string} roleName
   * @param {string} toggle
   * @return {Object}
   * */
  async update({id = '', roleName = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({roleName, id, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Role.update(
        {roleName, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <RoleModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new RoleModel()
