import {UserBook, Book, User, Seller, Quote, BookList, Subscription} from '../model'
import stuClassModel from '../StuClass'
import _ from 'lodash'
import Sequelize from 'sequelize';
import {seq} from '../seq';

const Op = Sequelize.Op;

class UserBookModel {
  async getList({account = '', realName = '', bookName = '', ISBN = '', className = '', session = '', collegeName = ''}) {
    const userWhere = _.pickBy({realName, account}, _.identity);
    const bookWhere = _.pickBy({bookName, ISBN}, _.identity);
    try {
      const bookingList = await UserBook.findAll({
        raw: true,
        where: {isPay: 1},
        include: [
          {model: User, attributes: [], as: 'user', where: userWhere},
          {model: Book, attributes: [], as: 'book', where: bookWhere}
        ],
        attributes: [
          'id',
          'userId',
          'bookId',
          Sequelize.col('user.realName'),
          Sequelize.col('user.account'),
          Sequelize.col('user.phoneNumber'),
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN')
        ]
      });

      const data = await Promise.all(bookingList.map(async booking => {
        const data = {
          ...booking,
          ...await stuClassModel.getInfoByUserId({
            userId: booking.userId,
            className: {[Op.like]: `%${className}%`},
            session: {[Op.like]: `%${session}%`},
            collegeName: {[Op.like]: `%${collegeName}%`}
          })
        };
        return data.className && data.session && data.collegeName ? data : ''
      }));

      return {code: 0, data: data.filter(item => item)}
    } catch (e) {
      return {code: 9999, message: '系统内部错误'}
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await UserBook.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <UserBookModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getBookListByUserId({userId}) {
    if (!_.isEmpty(_.omitBy({userId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const userBookList = await UserBook.findAll({
        where: {userId},
        raw: true,
        include: [
          {model: Book, attributes: [], as: 'book'},
          {model: Subscription, attributes: [], as: 'subscription'},
        ],
        attributes: [
          'id',
          'isPay',
          [Sequelize.col('book.id'), 'bookId'],
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          Sequelize.col('book.status'),
          'subscriptionId',
          Sequelize.col('subscription.subscriptionName')
        ]
      });
      return {code: 0, data: userBookList}
    } catch (e) {
      console.log(e)
    }
  }

  async updateUserBookByUserId({id = '', userBookList = []}) {
    const listFlag = userBookList.some(item => !_.isEmpty(_.omitBy({
      bookId: item.bookId.toString(),
      isPay: item.isPay.toString()
    }, _.identity)));
    const idFlag = !_.isEmpty(_.omitBy({id}, _.identity));
    if (listFlag || idFlag) return {code: 9999, message: '参数不能为空'};
    return seq.transaction({}, (t) =>
      UserBook.destroy({where: {userId: id}}, {transaction: t}).
        then((t) => UserBook.bulkCreate(userBookList.map(item => ({...item, userId: id}))))
    ).
      then(() => ({code: 0, message: '更新成功'})).
      catch((e) => {
        console.log('TransactionError: <UserBookModel.updateUserBookByCourseId>');
        return {code: 9999, message: '系统内部错误'};
      });
  }

  async getUserBookList({userId}) {
    if (!_.isEmpty(_.omitBy({userId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const bookList = await UserBook.findAll({raw: true, where: {userId}, attributes: ['id', 'userId', 'bookId', 'isPay','subscriptionId']});
      return {code: 0, data: bookList}
    } catch (e) {
      console.log(e)
    }
  }

  async handleUserBook({userId = '', bookId = '', isPay = '', subscriptionId = ''}) {
    if (!_.isEmpty(_.omitBy({userId, bookId, isPay, subscriptionId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      console.log(userId);
      const bookInfo = await UserBook.findOne({raw: true, where: {bookId, userId, subscriptionId}});
      bookInfo
        ? await UserBook.update({isPay}, {where: {bookId, userId, subscriptionId}})
        : await UserBook.create({userId, bookId, isPay, subscriptionId});
      return {code: 0, message: '操作成功'}
    } catch (e) {
      console.log(e)
    }
  }

  async getUserBook({userId = ''}) {
    try {
/*      const userClassInfo = await stuClassModel.getInfoByUserId({
        userId,
        className: {[Op.like]: '%%'},
        session: {[Op.like]: '%%'},
        collegeName: {[Op.like]: '%%'}
      });
      const bookLists = await BookList.findAll({
        raw: true,
        where: {toggle: 1},
        include: [
          {model: Subscription, attributes: [], as: 'subscription'}
        ],
        attributes: ['bookIds', 'classIds', Sequelize.col('subscription.status'),[Sequelize.col('subscription.id'),'subscriptionId'],Sequelize.col('subscription.subscriptionName')]
      });
      const userBookList = bookLists.filter(bookList => bookList.classIds.split(',').
        includes(userClassInfo.classId.toString()))[0];
      console.log(userBookList);
      const data = await Promise.all(userBookList.bookIds.split(',').
        map(async id => ({
          id,
          status: userBookList.status,
          ...await Quote.findOne({
            raw: true,
            where: {bookId: id, status: 2},
            include: [
              {model: Seller, attributes: [], as: 'seller'}
            ],
            attributes: [
              Sequelize.col('seller.sellerName'),
              Sequelize.col('seller.source'),
              'price'
            ]
          }),
          ...await UserBook.findOne({
            raw: true,
            where: {userId, isPay: 1, bookId: id},
            include: [
              {model: Book, attributes: [], as: 'book'},
              {model: Subscription, attributes: [], as: 'subscription'}
            ],
            attributes: [
              ['id', 'userBookId'],
              'bookId',
              Sequelize.col('book.bookName'),
              Sequelize.col('book.ISBN'),
              'subscriptionId',
              Sequelize.col('subscription.subscriptionName'),
              Sequelize.col('subscription.status'),
            ]
          })
        })));

      return {code: 0, data: data.filter(item => item.userBookId)}*/
      const userBookInfoList =await UserBook.findAll({
        raw:true,
        where:{userId,isPay:1},
        include:[
          {model:Subscription,attributes:[],as:'subscription'},
          {model:Book,attributes:[],as:'book'}
        ],
        attributes:[
          'id',
          'bookId',
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          'subscriptionId',
          Sequelize.col('subscription.subscriptionName'),
          Sequelize.col('subscription.status')

        ]
      });
      const userBookList =await Promise.all(userBookInfoList.map(async item=>{
        //TODO 介入报价表的价格
        const quoteInfo=await Quote.findOne({
          raw:true,
          where:{subscriptionId:item.subscriptionId,status:2},
          include:[
            {model:Seller,attributes:[],as:'seller'}
          ],
          attributes:[
            'sellerId',
            'price',
            Sequelize.col('seller.sellerName'),
            Sequelize.col('seller.source')
          ]
        });
        return{
          ...item,
          ...quoteInfo
        }
      }))
      return {code:0,data:userBookList}
    } catch (e) {
      console.log(e)
    }
  }
}

export default new UserBookModel()
