import bookListModel from '../../model/BookList'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';
import userModel from '../../model/User';

const Op = sequelize.Op;

class BookListController {
  constructor() {
  }

  async getList(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2, 3].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookIds = '', bookListName = '', toggle, collegeId, classIds = '', startTime = '', endTime = ''} = ctx.query;
      ctx.body = await bookListModel.getList({
        bookListName: {[Op.like]: `%${bookListName}%`},
        bookIds: {[Op.like]: `%${bookIds}%`},
        classIds: {[Op.like]: `%${classIds}%`},
        toggle,
        startTime,
        endTime,
        collegeId
      });
    }
  }

  async add(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {bookIds, bookListName, classIds, toggle, subscriptionId, collegeId} = ctx.request.body;
      ctx.body = await bookListModel.insert({bookIds, classIds, toggle, bookListName, subscriptionId, collegeId});
    }
  }

  async delete(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      ctx.body = await bookListModel.deleteById({id})
    }
  }


  async update(ctx) {
    const {_auth: authId} = JWTDecode(ctx.header.authorization);
    if (![1, 2].includes(authId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {bookIds, classIds, bookListName, subscriptionId, toggle, collegeId} = ctx.request.body;
      ctx.body = await bookListModel.update({id, bookListName, bookIds, toggle, classIds, subscriptionId, collegeId});
    }
  }

  async getBookListInfo(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    if (roleId !== 4) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {status} = ctx.query;
      ctx.body = await bookListModel.getBookListInfo({id, status})
    }
  }

  async edit(ctx) {
    const {_auth: roleId} = JWTDecode(ctx.header.authorization);
    if (![1, 2, 3].includes(roleId)) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      const {id} = ctx.params;
      const {classIds, bookIds} = ctx.request.body;
      ctx.body = await bookListModel.edit({id, classIds, bookIds})
    }
  }

  async getToSubList(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await bookListModel.getToSubList({id});
    }
  }

  async getAssignerBookList(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 6) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await bookListModel.getAssignerBookList({assignId})
    }
  }

  async getAssignerBookListWithClass(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
    if (roleId !== 6) {
      ctx.body = {code: 9999, message: '你无权进行此操作'}
    } else {
      ctx.body = await bookListModel.getAssignerBookListWithClass({assignId})
    }
  }

}

export default new BookListController()
