import bookModel from '../../model/Book'
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

class BookController {
  constructor(props) {
  }

  async getList(ctx) {
    const {bookName = '', ISBN = '', status, toggle} = ctx.query;
    ctx.body = await bookModel.getList({bookName: {[Op.like]: `%${bookName}%`}, ISBN: {[Op.like]: `%${ISBN}%`}, status, toggle})
  }

  async add(ctx) {
    const {bookName, ISBN, status, toggle} = ctx.request.body;
    ctx.body = await bookModel.insert({bookName, ISBN, status, toggle});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await bookModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {bookName, ISBN, status, toggle} = ctx.request.body;
    ctx.body = await bookModel.update({id, bookName, ISBN, status, toggle})
  }

  async getUserBook(ctx) {
    ctx.body = await bookModel.getUserBook();
  }

  async applyBook(ctx) {
    const {bookName, ISBN} = ctx.request.body;
    ctx.body = await bookModel.insert({bookName, ISBN, status: '1', toggle: '0'});
  }

  async getBookQuoteList(ctx) {
    ctx.body = await bookModel.getQuoteInfo();
  }
}

export default new BookController();
