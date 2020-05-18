import subscription from '../../model/Subscription';
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = Sequelize.Op;

class SubscriptionController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2, 3].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {subscriptionName = '', status} = ctx.query;
      ctx.body = await subscription.getList({
        subscriptionName: {[Op.like]: `%${subscriptionName}%`},
        status
      })
    }

  }

  async getListByAssigner(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 6) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await subscription.getListByAssigner({assignId});
    }
  }

  async add(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {subscriptionName = '', status} = ctx.request.body;
      ctx.body = await subscription.insert({subscriptionName, status})
    }
  }

  async delete(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await subscription.delete({id})
    }
  }

  async update(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {subscriptionName, status} = ctx.request.body;
      ctx.body = await subscription.update({id, subscriptionName, status})
    }
  }
}

export default new SubscriptionController()
