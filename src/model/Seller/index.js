import {Seller, Role} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

class SellerModel {
  /**
   * @param {string} sellerName
   * @param {string} source
   * @param {string} phoneNumber
   * @param {string} email
   * @param {string} address
   * @param {string} toggle
   * @return {Object}
   * */
  async getList({sellerName = '', source = '', phoneNumber = '', email = '', address = '', toggle = ''}) {
    const where = _.pickBy({sellerName, source, phoneNumber, email, address, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const sellerList = await Seller.findAll({
        where,
        raw: true,
        include: [{model: Role, attributes: [], as: 'role'}],
        attributes: [
          'id',
          'sellerName',
          'phoneNumber',
          Sequelize.col('role.roleName'),
          'source',
          'email',
          'address',
          'toggle'
        ]
      });
      return {code: 0, data: sellerList}
    } catch (e) {
      console.log('MethodError: <SellerModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async insert({sellerName = '', source = '', phoneNumber = '', email = '', password = '', address = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({sellerName, source, phoneNumber, email, address, toggle, password}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Seller.create({sellerName, source, phoneNumber, email, address, toggle, password, roleId: 5});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <SellerModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Seller.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <SellerModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', sellerName = '', source = '', phoneNumber = '', email = '', address = '', toggle = '', password = ''}) {
    if (!_.isEmpty(_.omitBy({id, sellerName, source, phoneNumber, email, address, toggle, password}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Seller.update(
        {id, sellerName, source, phoneNumber, email, address, toggle, password, roleId: 5},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <SellerModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getSelectList() {
    try {
      const selectList = await Seller.findAll({
        raw: true,
        where: {toggle: 1},
        attributes: [
          'id',
          'source',
          'phoneNumber',
          'sellerName'
        ]
      });
      return {code: 0, data: selectList}
    } catch (e) {
      console.log(e)
    }
  }
}

export default new SellerModel()
