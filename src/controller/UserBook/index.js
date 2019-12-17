import db from '../../utils/db'
import {getQueryStr, getSqlArr} from '../../utils/Utils';
import userBookModel from '../../model/UserBook'
import Sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = Sequelize.Op;

class UserBookController {
  constructor(props) {
  }

  async getList(ctx) {
    const {account = '', realName = '', bookName = '', ISBN = '', className = '', session = '', collegeName = ''} = ctx.query;
    ctx.body = await userBookModel.getList({
      account: {[Op.like]: `%${account}%`},
      realName: {[Op.like]: `%${realName}%`},
      bookName: {[Op.like]: `%${bookName}%`},
      ISBN: {[Op.like]: `%${ISBN}%`},
      className,
      session,
      collegeName
    });
  }

  async add(ctx) {
  }

  async delete(ctx) {
  }

  async update(ctx) {
  }

  async getBookListByUserId(ctx) {
    const {userId} = ctx.params;

    ctx.body = await userBookModel.getBookListByUserId({userId})
  }

  async updateDetail(ctx) {
    const {id} = ctx.params;
    const {userBookList} = ctx.request.body;
    ctx.body = await userBookModel.updateUserBookByUserId({id, userBookList})
  }

  async getUserBookList(ctx) {
    const {_uid: userId} = JWTDecode(ctx.header.authorization);
    ctx.body = await userBookModel.getUserBookList({userId})
  }

  async handleUserBook(ctx) {
    const {_uid: userId} = JWTDecode(ctx.header.authorization);
    const {bookId, isPay,subscriptionId} = ctx.request.body;
    ctx.body = await userBookModel.handleUserBook({userId, bookId, isPay,subscriptionId})
  }

  async getUserBook(ctx) {
    const {_uid: userId} = JWTDecode(ctx.header.authorization);
    ctx.body = await userBookModel.getUserBook({userId})
  }

}

export default new UserBookController();
