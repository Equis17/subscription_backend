import subscription from '../../model/Subscription';
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = Sequelize.Op;

class SubscriptionController {
  constructor(props) {
  }

  async getList(ctx) {
    const {subscriptionName = '', status} = ctx.query;
    ctx.body = await subscription.getList({
      subscriptionName: {[Op.like]: `%${subscriptionName}%`},
      status
    })
  }

  async getListByAssigner(ctx){
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    ctx.body=await subscription.getListByAssigner({assignId});
  }
  async add(ctx) {
    const {subscriptionName = '', status} = ctx.request.body;
    ctx.body = await subscription.insert({subscriptionName, status})
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await subscription.delete({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {subscriptionName, status} = ctx.request.body;
    ctx.body = await subscription.update({id, subscriptionName, status})
  }
}

export default new SubscriptionController()
