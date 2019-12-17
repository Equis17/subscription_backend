import {Quote, Seller, Book, BookList, Subscription, UserBook} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

const Op = Sequelize.Op;


class QuoteModel {


  async getList({bookId = '', sellerId = '', price = '', status = ''}) {
    const where = _.pickBy({bookId, sellerId, price, status}, _.identity);
    try {
      const quoteList = await Quote.findAll({
        raw: true,
        where,
        include: [
          {model: Seller, attributes: [], as: 'seller'},
          {model: Book, where: {toggle: 1, status: 2}, attributes: [], as: 'book'}
        ],
        attributes: [
          'id',
          'price',
          'time',
          'status',
          [Sequelize.col('book.id'), 'bookId'],
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          [Sequelize.col('seller.id'), 'sellerId'],
          Sequelize.col('seller.sellerName'),
          Sequelize.col('seller.source'),
          Sequelize.col('seller.phoneNumber'),
          Sequelize.col('seller.email'),
        ]
      });
      return {code: 0, data: quoteList}
    } catch (e) {
      console.log(e)
    }
  }

  async insert({bookId = '', sellerId = '', price = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({bookId, sellerId, price, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.create({bookId, sellerId, time: Date.now(), price, status});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log(e)
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <QuoteModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', bookId = '', sellerId = '', price = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({id, bookId, sellerId, price, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.update(
        {bookId, sellerId, time: Date.now(), price, status},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <QuoteModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async sub({sellerId = '', bookId = ''}) {
    if (!_.isEmpty(_.omitBy({sellerId, bookId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.update(
        {status: '3'},
        {where: {bookId}}
      );
      await Quote.update({status: '2'}, {where: {bookId, sellerId}});
      return {code: 0, message: '征订成功'};
    } catch (e) {
      console.log('MethodError: <QuoteModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getQuotedList({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const bookLists = await BookList.findAll({
        raw: true,
        include: [
          {model: Subscription, where: {status: {[Op.between]: [1, 4]}}, attributes: [], as: 'subscription'}
        ],
        attributes: [
          'bookIds',
          Sequelize.col('subscription.status')
        ]
      });


      let list = [];
      bookLists.map(bookList => list.push(...bookList.bookIds.split(',').
        map(id => ({bookId: id, bookListStatus: bookList.status}))));

      const bookIdsList = bookLists.length > 0
        ? _.uniq(bookLists.map(i => i.bookIds).
          join(',').
          split(','))
        : [];
      const uniqList = bookIdsList.map(item => _.maxBy(list.filter(book => book.bookId === item), o => o.bookListStatus));
      const quotedList = await Quote.findAll({
        raw: true,
        where: {sellerId: id, status: 2},
        include: [
          {model: Book, attributes: [], as: 'book'},
        ],
        attributes: [
          'id',
          'bookId',
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          'time',
          'status',
          'price'
        ]
      });
      const sellerQuotedList = quotedList.map(item => ({...item, bookListStatus: uniqList.filter(book => book.bookId.toString() === item.bookId.toString())[0].bookListStatus}));

      const data = await Promise.all(sellerQuotedList.map(async quote => {
        const userBook = await UserBook.findAndCountAll({
          raw: true,
          where: {bookId: quote.bookId, isPay: 1},
          include: [{model: Subscription, attributes: [], where: {status: 4}, as: 'subscription'}]
        });
        return {
          ...quote,
          count: userBook.count
        }
      }));

      return {code: 0, data}
    } catch (e) {
      console.log(e)
    }
  }

  async cancelQuote({sellerId, id}) {
    try {
      await Quote.destroy({where: {id, sellerId}});
      return {code: 0, message: '操作成功'}
    } catch (e) {
      console.log(e)
    }
  }
}

export default new QuoteModel()
