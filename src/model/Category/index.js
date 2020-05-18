import {Category, Role, Router} from '../model';
import _ from 'lodash'
import Sequelize from 'sequelize';

class CategoryModel {
  /**
   * @return {Object}
   */
  async getList() {
    try {
      const categoryList = await Category.findAll({
        include: [{model: Role, attributes: [], as: 'role'}],
        raw: true,
        attributes: ['id', 'roleId', 'role.roleName', 'role.toggle', 'routerIds']
      });
      return {code: 0, data: categoryList}
    } catch (e) {
      console.log('MethodError: <CategoryModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} roleId
   * @param {string} routerIds
   * @return {Object}
   */
  async insert({roleId = '', routerIds = ''}) {
    if (!_.isEmpty(_.omitBy({roleId, routerIds}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Category.create({roleId, routerIds});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <CategoryModel.insert>');
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
      await Category.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <CategoryModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} roleId
   * @param {string} routerIds
   * @return {Object}
   */
  async update({id = '', roleId = '', routerIds = ''}) {
    if (!_.isEmpty(_.omitBy({roleId, id, routerIds}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Category.update(
        {roleId, routerIds},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <CategoryModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getCategoryList({roleId = ''}) {
    try {
      //获取路由表
      const routerList = await Router.findAll({
        where: {toggle: '1'},
        raw: true,
        attributes: ['id', 'routerName', 'routerUrl']
      });

      //获取用户菜单
      const category = await Category.findOne({
        where: {roleId},
        raw: true,
        attributes: ['routerIds']
      });
      const categoryIds = category.routerIds.split(',');
      return {code: 0, data: routerList.filter(router => categoryIds.includes(router.id.toString()))}
    } catch (e) {
      console.log(e)
    }
  }
}

export default new CategoryModel()
