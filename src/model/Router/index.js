import {Router} from '../model'
import _ from 'lodash'

class RouterModel {
  async getList({routerName = '', routerUrl = '', toggle = ''}) {
    const where = _.pickBy({routerName, routerUrl, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const routerList = await Router.findAll({where, raw: true});
      return {code: 0, data: routerList}
    } catch (e) {
      console.log('MethodError: <RouterModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async insert({routerName = '', routerUrl = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({routerName, routerUrl, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Router.create({routerName, routerUrl, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <RouterModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Router.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <RouterModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', routerName = '', routerUrl = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({routerName, routerUrl, toggle, id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Router.update(
        {routerName, routerUrl, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <RouterModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new RouterModel()
