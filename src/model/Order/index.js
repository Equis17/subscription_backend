import {Book, Quote, Seller, SellerOrder, Subscription, UserBook} from '../model';
import Sequelize from 'sequelize';
import _ from 'lodash';

class OrderModel {

  async getList() {
    try {

      const orderList = await SellerOrder.findAll({
        raw: true,
        include: [
          {
            model: Quote,
            attributes: [],
            include: [
              {model: Book, attributes: [], as: 'book'},
              {model: Seller, attributes: [], as: 'seller'}
            ],
            as: 'quote'
          },
        ],
        attributes: [
          'id',
          'quoteId',
          'time',
          'status',
          Sequelize.col('quote.price'),
          Sequelize.col('quote.bookId'),
          Sequelize.col('quote.book.bookName'),
          Sequelize.col('quote.book.ISBN'),
          Sequelize.col('quote.sellerId'),
          Sequelize.col('quote.seller.sellerName'),
          Sequelize.col('quote.seller.source'),
          Sequelize.col('quote.seller.email'),
          Sequelize.col('quote.seller.phoneNumber'),
          Sequelize.col('quote.seller.address')
        ]
      });

      const data = await Promise.all(orderList.map(async order => {
        const userBook = await UserBook.findAndCountAll({
          raw: true,
          where: {bookId: order.bookId, isPay: 1},
          include: [{model: Subscription, attributes: [], where: {status: 4}, as: 'subscription'}]
        });
        return {
          ...order,
          count: userBook.count
        }
      }));
      return {code: 0, data}
    } catch (e) {
      console.log(e)
    }
  }

  async getListById({sellerId = ''}) {
    try {
      const orderList = await SellerOrder.findAll({
        raw: true,
        include: [
          {
            model: Quote,
            attributes: [],
            where: {sellerId},
            include: [
              {model: Book, attributes: [], as: 'book'},
              {model: Seller, attributes: [], as: 'seller'}
            ],
            as: 'quote'
          },
        ],
        attributes: [
          'id',
          'quoteId',
          'time',
          'status',
          Sequelize.col('quote.price'),
          Sequelize.col('quote.bookId'),
          Sequelize.col('quote.book.bookName'),
          Sequelize.col('quote.book.ISBN'),
          Sequelize.col('quote.sellerId'),
          Sequelize.col('quote.seller.sellerName'),
          Sequelize.col('quote.seller.source'),
          Sequelize.col('quote.seller.email'),
          Sequelize.col('quote.seller.phoneNumber'),
          Sequelize.col('quote.seller.address')
        ]
      });
      const data = await Promise.all(orderList.map(async order => {
        const userBook = await UserBook.findAndCountAll({
          raw: true,
          where: {bookId: order.bookId, isPay: 1},
          include: [{model: Subscription, attributes: [], where: {status: 4}, as: 'subscription'}]
        });
        return {
          ...order,
          count: userBook.count
        }
      }));
      return {code: 0, data}
    } catch (e) {
      console.log(e)
    }
  }

  async getListByUser({userId = ''}) {
    try {
      const userBookList = await UserBook.findAll({raw: true, where: {userId}, attributes: ['userId', 'bookId', 'isPay', 'subscriptionId']});
      const data = await Promise.all(userBookList.map(async book => {
          const info = await SellerOrder.findOne({
            raw: true,
            include: [
              {
                model: Quote,
                attributes: [],
                where:{status:2,bookId:book.bookId},
                include: [
                  {model: Book,  attributes: [], as: 'book'},
                  {model: Seller, attributes: [], as: 'seller'}
                ],
                as: 'quote',
              }
            ],
            attributes: [
              'id',
              'quoteId',
              'time',
              'status',
              Sequelize.col('quote.price'),
              Sequelize.col('quote.book.bookName'),
              Sequelize.col('quote.book.ISBN'),
              Sequelize.col('quote.sellerId'),
              Sequelize.col('quote.seller.sellerName'),
              Sequelize.col('quote.seller.source'),
              Sequelize.col('quote.seller.email'),
              Sequelize.col('quote.seller.phoneNumber'),
              Sequelize.col('quote.seller.address')
            ]
          });
          return info
            ? {...book, ...info}
            : {}
        }
      ));
      return {code: 0, data:data.filter(item=>JSON.stringify(item)!=='{}')}
    } catch (e) {
      console.log(e)
    }
  }

  async insert({quoteId = '', time = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({quoteId, time, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const info = await SellerOrder.findOne({raw: true, where: {quoteId}});
      if (info) {
        return {code: 0, message: '订单已存在'}
      } else {
        await SellerOrder.create({quoteId, time, status});
        return {code: 0, message: '添加成功'}
      }
    } catch (e) {
      console.log('MethodError: <ClassModel.insert>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await SellerOrder.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async deleteBySeller({sellerId = '', id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await SellerOrder.destroy({where: {id}, include: [{model: Quote, where: {sellerId}}]});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.deleteById>');
      console.log(e)
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await SellerOrder.update(
        {status},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async updateBySellerId({sellerId = '', id = '', status = ''}) {
    if (!_.isEmpty(_.omitBy({sellerId, status}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await SellerOrder.update(
        {status},
        {where: {id}, include: {model: Quote, where: {sellerId}}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.update>');
      console.log(e)
      return {code: 9999, message: '系统内部错误'};
    }
  }
}

export default new OrderModel()
