import quoteModel from '../../model/Quote'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import _ from 'lodash';
import {Book, Quote} from '../../model/model';
import {seq} from '../../model/seq';
import classModel from '../../model/Class';

const Op = sequelize.Op;

class QuoteController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookId, sellerId, price = '', status = '',subscriptionId=''} = ctx.query;
      ctx.body = await quoteModel.getList({bookId, sellerId, price: {[Op.like]: `%${price}%`}, status,subscriptionId});
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookId, sellerId, price = '', status = ''} = ctx.request.body;
      ctx.body = await quoteModel.insert({bookId, sellerId, price, status});
    }
  }


  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await quoteModel.deleteById({id})
    }
  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {bookId, sellerId, price = '', status = ''} = ctx.request.body;
      ctx.body = await quoteModel.update({id, bookId, sellerId, price, status})
    }
  }

  async addQuote(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    const {id: bookId, price = '',subscriptionId} = ctx.request.body;
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await quoteModel.insert({sellerId: id, bookId, price, status: 1,subscriptionId})
    }
  }

  async updateQuote(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id: bookId} = ctx.params;
      const {price = '',subscriptionId} = ctx.request.body;
      ctx.body = await quoteModel.updateQuote({sellerId: id, bookId, price,subscriptionId})
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
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookId, sellerId,subscriptionId} = ctx.request.body;
      ctx.body = await quoteModel.sub({sellerId, bookId,subscriptionId});
    }
  }
}

export default new QuoteController()
