import orderModel from '../../model/Order'
import JWTDecode from 'jwt-decode';

class OrderController {
  constructor() {
  }

  async getList(ctx) {
    ctx.body = await orderModel.getList();
  }

  async add(ctx) {
    const {quoteId, time, status} = ctx.request.body;
    ctx.body = await orderModel.insert({quoteId, time, status});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await orderModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {status} = ctx.request.body;
    ctx.body = await orderModel.update({id, status});
  }

  async addToOrder(ctx) {
    const {id: quoteId} = ctx.request.body;
    ctx.body = await orderModel.insert({quoteId, time: new Date(), status: '0'})
  }

  async getListById(ctx) {
    const {_uid: sellerId} = JWTDecode(ctx.header.authorization);
    ctx.body = await orderModel.getListById({sellerId})
  }

  async updateBySeller(ctx) {
    const {_uid: sellerId} = JWTDecode(ctx.header.authorization);
    const {id} = ctx.params;
    const {status} = ctx.request.body;
    ctx.bodu = await orderModel.updateBySellerId({sellerId, id, status})
  }

  async deleteBySeller(ctx) {
    const {_uid: sellerId} = JWTDecode(ctx.header.authorization);
    const {id} = ctx.params;
    ctx.body = await orderModel.deleteBySeller({sellerId, id})
  }

  async getListByUser(ctx) {
    const {_uid: userId} = JWTDecode(ctx.header.authorization);
    ctx.body = await orderModel.getListByUser({userId})
  }
}

export default new OrderController()
