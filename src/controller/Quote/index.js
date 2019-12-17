import quoteModel from '../../model/Quote'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import _ from 'lodash';
import {Book, Quote} from '../../model/model';
import {seq} from '../../model/seq';

const Op = sequelize.Op;

class QuoteController {
  constructor(props) {
  }

  async getList(ctx) {
    const {bookId, sellerId, price = '', status = ''} = ctx.query;
    ctx.body = await quoteModel.getList({bookId, sellerId, price: {[Op.like]: `%${price}%`}, status});
  }

  async add(ctx) {
    const {bookId, sellerId, price = '', status = ''} = ctx.request.body;
    ctx.body = await quoteModel.insert({bookId, sellerId, price, status});
  }


  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await quoteModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {bookId, sellerId, price = '', status = ''} = ctx.request.body;
    ctx.body = await quoteModel.update({id, bookId, sellerId, price, status})
  }

  async addQuote(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    const {id: bookId, price = ''} = ctx.request.body;

    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await quoteModel.insert({sellerId: id, bookId, price, status: 1})
    }
  }

  async getQuotedList(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await quoteModel.getQuotedList({id})
    }
  }

  async cancel(ctx) {
    const {_auth: roleId, _uid: sellerId} = JWTDecode(ctx.header.authorization);
    const {id} = ctx.request.body;
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await quoteModel.cancelQuote({sellerId, id})
    }
  }

  async sub(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    const {bookId, sellerId} = ctx.request.body;
    ctx.body = await quoteModel.sub({sellerId, bookId});
  }
}

export default new QuoteController()
