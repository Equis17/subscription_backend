import {College} from '../model'
import _ from 'lodash'

class CollegeModel {

  /**
   * @param {string} collegeName
   * @param {string} toggle
   * @return {Object}
   */
  async getList({collegeName = '', toggle = ''}) {
    const where = _.pickBy({collegeName, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const collegeList = await College.findAll({where,raw:true});
      return {code: 0, data: collegeList}
    } catch (e) {
      console.log('MethodError: <CollegeModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} collegeName
   * @param {string} toggle
   * @return {Object}
   */
  async insert({collegeName = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({collegeName, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await College.create({collegeName, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <CollegeModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @return {Object}
   */
  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await College.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <CollegeModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} collegeName
   * @param {string} toggle
   * @return {Object}
   */
  async update({id = '', collegeName = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({collegeName, id, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await College.update(
        {collegeName, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <CollegeModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new CollegeModel()
