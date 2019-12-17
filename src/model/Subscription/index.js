import {Assign, BookList, Subscription} from '../model';
import _ from 'lodash';

class SubscriptionModel {

  async getList({subscriptionName = '', status = ''}) {
    let where = _.pickBy({subscriptionName, status}, _.identity);
    try {
      const subscriptionList = await Subscription.findAll({raw: true, where});
      return {code: 0, data: subscriptionList}
    } catch (e) {

    }
  }

  async getListByAssigner({assignId = ''}) {
    try {
      const classIds = await Assign.findAll({
        raw: true,
        where: {assignId, status: 1},
        attributes: ['classId']
      });
      const classList = [...new Set(classIds.map(i => i.classId))];
      const bookLists = await BookList.findAll({
        raw: true,
        where: {toggle: 1},
        attributes: ['classIds', 'subscriptionId']
      });

      const subscriptionIds = bookLists.filter(list => list.classIds.split(',').
        some(id => classList.includes(parseInt(id, 10))));
      const subscriptionList = await Promise.all(subscriptionIds.map(async item => await Subscription.findOne({raw: true, where: {id: item.subscriptionId}})))
      return {code: 0, data: subscriptionList}
    } catch (e) {
      console.log(e)
    }
  }

  async insert({subscriptionName = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({subscriptionName, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Subscription.create({subscriptionName, status});
      return {code: 0, message: '添加成功'}
    } catch (e) {

    }
  }

  async delete({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Subscription.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', subscriptionName = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({id, subscriptionName, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Subscription.update(
        {subscriptionName, status},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new SubscriptionModel()
