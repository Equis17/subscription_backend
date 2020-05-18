import orderModel from '../../model/Order'
import JWTDecode from 'jwt-decode';
import bookListModel from '../../model/BookList';
import userBookModel from '../../model/UserBook';

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
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id: quoteId} = ctx.request.body;
      ctx.body = await orderModel.insert({quoteId, time: new Date(), status: '0'})
    }
  }

  async getListById(ctx) {
    const {_auth: roleId, _uid: sellerId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await orderModel.getListById({sellerId})
    }
  }

  async updateBySeller(ctx) {
    const {_uid: sellerId} = JWTDecode(ctx.header.authorization);
    const {id} = ctx.params;
    const {status} = ctx.request.body;
    ctx.bodu = await orderModel.updateBySellerId({sellerId, id, status})
  }

  async deleteBySeller(ctx) {
    const {_uid: sellerId, _auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await orderModel.deleteBySeller({sellerId, id})
    }

  }

  async getListByUser(ctx) {
    const {_uid: userId, _auth: roleId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await orderModel.getListByUser({userId})
    }
  }
}

export default new OrderController()
