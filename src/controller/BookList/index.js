import bookListModel from '../../model/BookList'
import sequelize from 'sequelize';
import JWTDecode from 'jwt-decode';

const Op = sequelize.Op;

class BookListController {
  constructor() {
  }

  async getList(ctx) {
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

  async add(ctx) {
    const {bookIds, bookListName, classIds, toggle, subscriptionId, collegeId} = ctx.request.body;
    ctx.body = await bookListModel.insert({bookIds, classIds, toggle, bookListName, subscriptionId, collegeId});
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await bookListModel.deleteById({id})
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {bookIds, classIds, bookListName, subscriptionId, toggle, collegeId} = ctx.request.body;
    ctx.body = await bookListModel.update({id, bookListName, bookIds, toggle, classIds, subscriptionId, collegeId});
  }

  async getBookListInfo(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    const {status} = ctx.query;
    ctx.body = await bookListModel.getBookListInfo({roleId, id, status})
  }

  async edit(ctx) {
    const {id} = ctx.params;
    const {classIds, bookIds} = ctx.request.body;
    ctx.body = await bookListModel.edit({id, classIds, bookIds})
  }

  async getToSubList(ctx) {
    const {_auth: roleId, _uid: id} = JWTDecode(ctx.header.authorization);
    if (roleId !== 5) {
      ctx.body = {code: 9999, message: '你无此操作权限'}
    } else {
      ctx.body = await bookListModel.getToSubList({id});
    }
  }

 async getAssignerBookList(ctx){
   const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);
   ctx.body=await  bookListModel.getAssignerBookList({assignId})
 }

 async getAssignerBookListWithClass(ctx){
   const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.header.authorization);

    ctx.body=await bookListModel.getAssignerBookListWithClass({assignId})
 }

}

export default new BookListController()
