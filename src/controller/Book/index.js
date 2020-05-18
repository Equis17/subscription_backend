import bookModel from '../../model/Book'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import classModel from '../../model/Class';

const Op = Sequelize.Op;

class BookController {
  constructor(props) {
  }

  async getList(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2,3].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookName = '', ISBN = '', status, toggle} = ctx.query;
      ctx.body = await bookModel.getList({bookName: {[Op.like]: `%${bookName}%`}, ISBN: {[Op.like]: `%${ISBN}%`}, status, toggle})
    }
  }

  async add(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookName, ISBN, status, toggle} = ctx.request.body;
      ctx.body = await bookModel.insert({bookName, ISBN, status, toggle});
    }
  }

  async delete(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await bookModel.deleteById({id})
    }
  }

  async update(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {bookName, ISBN, status, toggle} = ctx.request.body;
      ctx.body = await bookModel.update({id, bookName, ISBN, status, toggle})
    }
  }

  async getUserBook(ctx) {
    ctx.body = await bookModel.getUserBook();
  }

  async applyBook(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![3].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookName, ISBN} = ctx.request.body;
      ctx.body = await bookModel.insert({bookName, ISBN, status: '1', toggle: '0'});
    }
  }

  async getBookQuoteList(ctx) {
    ctx.body = await bookModel.getQuoteInfo();
  }
}

export default new BookController();
