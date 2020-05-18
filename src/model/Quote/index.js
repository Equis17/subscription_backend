import {Quote, Seller, Book, BookList, Subscription, UserBook} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

const Op = Sequelize.Op;


class QuoteModel {


  async getList({bookId = '', sellerId = '', price = '', status = '',subscriptionId=''}) {
    const where = _.pickBy({bookId, sellerId, price, status,subscriptionId}, _.identity);
    try {
      const quoteList = await Quote.findAll({
        raw: true,
        where,
        include: [
          {model: Seller, attributes: [], as: 'seller'},
          {model: Book, where: {toggle: 1, status: 2}, attributes: [], as: 'book'},
          {model:Subscription,attributes:[],as:'subscription'}
        ],
        attributes: [
          'id',
          'price',
          'time',
          'status',
          [Sequelize.col('subscription.id'), 'subscriptionId'],
          Sequelize.col('subscription.subscriptionName'),
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

  async insert({bookId = '', sellerId = '', price = '', status = '',subscriptionId=''}) {
    if (!_.isEmpty(_.omitBy({bookId, sellerId, price, status,subscriptionId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.create({bookId, sellerId, time: Date.now(), price, status,subscriptionId});
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

  async sub({sellerId = '', bookId = '',subscriptionId=''}) {
    if (!_.isEmpty(_.omitBy({sellerId, bookId,subscriptionId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Quote.update(
        {status: '3'},
        {where: {bookId,subscriptionId}}
      );
      await Quote.update({status: '2'}, {where: {bookId, sellerId,subscriptionId}});
      return {code: 0, message: '征订成功'};
    } catch (e) {
      console.log('MethodError: <QuoteModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getQuotedList({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      //获取所有书单
    /*  const bookLists = await BookList.findAll({
        raw: true,
        include: [
          {model: Subscription, where: {status: {[Op.between]: [1, 4]}}, attributes: [], as: 'subscription'}
        ],
        attributes: [
          'id',
          'bookIds',
          Sequelize.col('subscription.status'),
          [          Sequelize.col('subscription.id'),'subscriptionId']
        ]
      });

      let list = [];
      bookLists.map(bookList => list.push(...bookList.bookIds.split(',').
        map(id => ({bookId: id, bookListStatus: bookList.status}))));
      console.log(list);
      const bookIdsList = bookLists.length > 0
        ? _.uniq(bookLists.map(i => i.bookIds).
          join(',').
          split(','))
        : [];
      console.log(bookIdsList);
      const uniqList = bookIdsList.map(item => _.maxBy(list.filter(book => book.bookId === item), o => o.bookListStatus));
      console.log(uniqList)
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
*/
      const quotedList=await Quote.findAll({
        raw: true,
        where: {sellerId: id, status: 2},
        include: [
          {model: Book, attributes: [], as: 'book'},
          {model:Subscription,attributes:[],as:'subscription'}
        ],
        attributes: [
          'id',
          'bookId',
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          [Sequelize.col('subscription.id'),'subscriptionId'],
          Sequelize.col('subscription.subscriptionName'),
          'time',
          [Sequelize.col('subscription.status'),'bookListStatus'],
          'price'
        ]
      });
      const data = await Promise.all(quotedList.map(async quote => {
        const userBook = await UserBook.findAndCountAll({
          raw: true,
          where: {bookId: quote.bookId, isPay: 1,subscriptionId:quote.subscriptionId},
          include: [{model: Subscription, attributes: [], as: 'subscription'}]
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
      const info =await Quote.findOne({
        raw:true,
        where:{id},
        attributes:['subscriptionId','bookId']
      });
      await Quote.destroy({where: {id, sellerId,status:2}});
      await Quote.update(
        {status:1},
        {where: { ...info}}
      );
      return {code: 0, message: '操作成功'}
    } catch (e) {
      console.log(e)
    }
  }

  async updateQuote({sellerId='', bookId='', price='',subscriptionId}) {
    try {
      await Quote.update(
        {price},
        {where: {sellerId,bookId,subscriptionId}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <BookModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new QuoteModel()
