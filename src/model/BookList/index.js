import {Assign, Book, BookList, Class, College, Quote, Seller, StuClass, Subscription, User, UserBook} from '../model';
import _ from 'lodash';
import Sequelize from 'sequelize';

class BookListModel {
  async getList({bookIds = '', classIds = '', toggle = '', bookListName = '', collegeId = '', subscriptionId = ''}) {
    const where = _.pickBy({bookIds, classIds, subscriptionId, toggle, bookListName, collegeId}, _.identity);
    try {
      const bookLists = await BookList.findAll({
        where,
        raw: true,
        include: [
          {model: College, attributes: [], as: 'college'},
          {model: Subscription, attributes: [], as: 'subscription'}
        ],
        attributes: [
          'id',
          'bookListName',
          'collegeId',
          'toggle',
          'bookIds',
          'classIds',
          Sequelize.col('collegeName'),
          'subscriptionId',
          Sequelize.col('subscription.subscriptionName'),
          Sequelize.col('subscription.status')
        ]
      });
      return {code: 0, data: bookLists};
    } catch (e) {
      console.log(e);
      console.log('MethodError: <BookListModel.getList>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async insert({bookIds = '', classIds = '', toggle = '', bookListName = '', collegeId = '', subscriptionId = ''}) {
    if (!_.isEmpty(_.omitBy({classIds, toggle, subscriptionId, bookListName, collegeId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await BookList.create({bookListName, bookIds, classIds, subscriptionId, collegeId, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await BookList.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async update({id = '', bookIds = '', classIds = '', toggle = '', subscriptionId = '', bookListName = '', collegeId = ''}) {
    if (!_.isEmpty(_.omitBy({id, bookIds, classIds, subscriptionId, toggle, bookListName, collegeId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await BookList.update(
        {bookListName, bookIds, classIds, subscriptionId, collegeId, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async edit({id = '', bookIds = '', classIds = ''}) {
    if (!_.isEmpty(_.omitBy({id, bookIds, classIds}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await BookList.update(
        {bookIds, classIds},
        {where: {id, toggle: 1}}
      );
      return {code: 0, message: '编辑成功'};
    } catch (e) {
      console.log('MethodError: <BookListModel.edit>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getBookListInfo({id = '', status = ''}) {
    try {
      const classInfo = await StuClass.findOne({raw: true, where: {userId: id}, attributes: ['classId']});
      if (!classInfo) return {code: 0, data: {}};
      const bookList = await BookList.findAll({
        raw: true,
        where: {toggle: 1},
        include: [
          {model: College, attributes: [], as: 'college'},
          {model: Subscription, where: {status}, attributes: [], as: 'subscription'}
        ],
        attributes: [
          'id',
          'bookListName',
          Sequelize.col('college.collegeName'),
          'bookIds',
          'classIds',
          'subscriptionId',
          Sequelize.col('subscription.subscriptionName'),
          Sequelize.col('subscription.status')
        ]
      });
      return {
        code: 0,
        data: bookList.filter(book => book.classIds.split(',').
        includes(classInfo.classId.toString()))
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getToSubList({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};

    try {
      const bookList = await BookList.findAll({
        raw: true,
        where: {
          toggle: 1
        },
        include: [
          {model: Subscription, where: {status: '1'}, attributes: [], as: 'subscription'}
        ],
        attributes: [
          'bookIds',
          [Sequelize.col('subscription.id'), 'subscriptionId'],
          Sequelize.col('subscription.subscriptionName'),
          [Sequelize.col('subscription.status'), 'subscriptionStatus']
        ]
      });
      const subscriptionList = bookList.map(item => ({subscriptionId: item.subscriptionId, subscriptionName: item.subscriptionName, subscriptionStatus: item.subscriptionStatus}));
      const idList = _.uniqWith(subscriptionList, _.isEqual);
      if (idList.length === 0) {
        return {code: 0, data: []};
      } else {
        const data = await Promise.all(idList.map(async subscription => {
          const subscriptionList = bookList.filter(i => i.subscriptionId === subscription.subscriptionId);
          const uniqList = _.uniq(subscriptionList.map(i => i.bookIds).
            join(',').
            split(',')
          );

          const toSubList = await Promise.all(uniqList.map(async id =>
            await Book.findOne({
              raw: true,
              where: {id},
              attributes: ['id', 'bookName', 'ISBN']
            })
          ));
          return await Promise.all(toSubList.map(async book => ({
            ...book,
            ...await Quote.findOne({
              raw: true,
              where: {bookId: book.id, sellerId: id, subscriptionId: subscription.subscriptionId},
              attributes: ['price', 'status']
            }),
            ...subscription
          })));
        }));
        return {code: 0, data};
      }
      // const uniqList = bookList.length > 0
      //   ? _.uniq(bookList.map(i => i.bookIds).
      //     join(',').
      //     split(','))
      //   : [];
      // const toSubList = await Promise.all(uniqList.map(async id =>
      //   await Book.findOne({
      //     raw: true,
      //     where: {id},
      //     attributes: ['id', 'bookName', 'ISBN']
      //   })
      // ));
      //
      // const data = await Promise.all(toSubList.map(async book => ({
      //   ...book,
      //   ...await Quote.findOne({
      //     raw: true,
      //     where: {bookId: book.id, sellerId: id},
      //     attributes: ['price', 'status']
      //   })
      // })));
      //
      // return {code: 0, data}
    } catch (e) {
      console.log(e);
    }
  }

  async getAssignerBookList({assignId = ''}) {
    if (!_.isEmpty(_.omitBy({assignId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const classIdList = await Assign.findAll({
        raw: true,
        where: {assignId, status: 1},
        attributes: ['classId']
      });
      const classIds = [...new Set(classIdList.map(item => item.classId))];
      const bookLists = await BookList.findAll({
        raw: true,
        where: {toggle: 1},
        include: [
          {model: Subscription, attributes: [], where: {status: 4}, as: 'subscription'},
          {model: College, attributes: [], as: 'college'}
        ],
        attributes: [
          'id',
          'bookListName',
          'collegeId',
          Sequelize.col('college.collegeName'),
          'bookIds',
          'classIds',
          'subscriptionId',
          Sequelize.col('subscription.subscriptionName'),
          Sequelize.col('subscription.status')
        ]
      });

      const data = bookLists.filter(item => item.classIds.split(',').
      some(id => classIds.includes(parseInt(id, 10))));

      return {code: 0, data};
    } catch (e) {
      console.log(e);
    }
  }

  //TODO 带上subscription 导出
  async getAssignerBookListWithClass({assignId = ''}) {
    if (!_.isEmpty(_.omitBy({assignId}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const classIdList = await Assign.findAll({
        raw: true,
        where: {assignId, status: 1},
        attributes: ['classId']
      });
      const classIds = [...new Set(classIdList.map(item => item.classId))];
      //所有书的信息
      const bookList = await Promise.all(classIds.map(async id => {
        //本班级的用户的名单
        const userList = await StuClass.findAll({
          raw: true,
          where: {classId: id},
          include: [{model: Class, attributes: [], as: 'class'}],
          attributes: ['userId', Sequelize.col('class.className')]
        });

        //一位用户的所有书
        const userBookList = await Promise.all(userList.map(async user => {
          return UserBook.findAll({
            raw: true,
            where: {userId: user.userId, isPay: 1},
            attributes: ['bookId', 'subscriptionId']
          });
        }));
        const data = _.groupBy(_.flatten(userBookList), 'subscriptionId');

        for (let key in data) {
          if (!data.hasOwnProperty(key)) continue;
          data[key] = _.countBy(data[key], 'bookId');
        }
        return {data, classId: id};
      }));
      const data = bookList.filter(item => JSON.stringify(item.data) !== '{}').
      map(item => {
        const objList = Object.keys(item.data).
        reduce((ret, key) => {
          const data = {
            subscriptionId: key,
            bookList: Object.keys(item.data[key]).
            reduce((retBook, bookKey) => {
              retBook.push({bookId: bookKey, count: item.data[key][bookKey]});
              return retBook;
            }, []),
            classId: item.classId
          };
          ret.push(data);
          return ret;
        }, []);
        /*  const subscriptionId = _.findKey(item['data']);
          const bookList = [];
          for (let i in item['data'][subscriptionId]) {
            if (!item['data'][subscriptionId].hasOwnProperty(i)) continue;
            bookList.push({bookId: i, count: item['data'][subscriptionId][i]});
          }*/
        return objList;
      });
      return {code: 0, data: _.flatten(data)};
    } catch (e) {
      console.log(e);
    }
  }

  async createExcelBookList({assignId = ''}) {
    try {
      const result = await this.getAssignerBookListWithClass({assignId});
      const assignerInfo = await Assign.findOne({
        raw: true,
        where: {assignId},
        include: [
          {model: User, attributes: [], as: 'user'}
        ],
        attributes: [
          Sequelize.col('user.realName'),
          Sequelize.col('user.phoneNumber')
        ]
      });
      const allList = result.data;
      const data = await Promise.all(allList.map(async item => {
        const subscriptionInfo = await Subscription.findOne({
          raw: true,
          where: {id: item.subscriptionId, status: 4},
          attributes: ['subscriptionName']
        });
        if (!subscriptionInfo) {
          return
        };
        const subscriptionName = subscriptionInfo.subscriptionName;
        const classInfo = await Class.findOne({
          raw: true,
          include: [
            {model: College, attributes: [], as: 'college'}
          ],
          where: {id: item.classId},
          attributes: ['className', Sequelize.col('college.collegeName')]
        });
        const className = `${classInfo.collegeName}-${classInfo.className}`;

        const bookList = await Promise.all(item.bookList.map(async userBook => {
          const quoteInfo = await Quote.findOne({
            raw: true,
            where: {status: 2, bookId: userBook.bookId, subscriptionId: item.subscriptionId},
            include: [
              {model: Seller, as: 'seller', attributes: []},
              {model: Book, as: 'book', attributes: []}
            ],
            attributes: [
              'sellerId',
              Sequelize.col('book.bookName'),
              Sequelize.col('book.ISBN'),
              Sequelize.col('seller.sellerName'),
              Sequelize.col('seller.phoneNumber'),
              Sequelize.col('seller.address'),
              Sequelize.col('seller.source'),
              Sequelize.col('seller.email'),
              'price'
            ]
          });
          return {...quoteInfo, count: userBook.count};
        }));
        return {subscriptionName, className, bookList};
      }));
      return {data:data.filter(item=>!!item), assignerInfo};
    } catch (e) {
      console.log(e);
    }
  }

  async createExcelDetailBookList({assignId = ''}) {
    try {
      const result = await this.getAssignerBookListWithClass({assignId});
      const assignerInfo = await Assign.findOne({
        raw: true,
        where: {assignId},
        include: [
          {model: User, attributes: [], as: 'user'}
        ],
        attributes: [
          Sequelize.col('user.realName'),
          Sequelize.col('user.phoneNumber')
        ]
      });
      const allList = result.data;
      const data = await Promise.all(allList.map(async item => {
        const subscriptionInfo = await Subscription.findOne({
          raw: true,
          where: {id: item.subscriptionId, status: 4},
          attributes: ['subscriptionName']
        });
        if (!subscriptionInfo) {
          return
        };
        const subscriptionName = subscriptionInfo.subscriptionName;
        const classInfo = await Class.findOne({
          raw: true,
          include: [
            {model: College, attributes: [], as: 'college'}
          ],
          where: {id: item.classId},
          attributes: ['className', Sequelize.col('college.collegeName')]
        });
        const className = `${classInfo.collegeName}-${classInfo.className}`;
        const bookList = await Promise.all(item.bookList.map(async userBook => {
          const {subscriptionId} = item;
          const quoteInfo = await Quote.findOne({
            raw: true,
            where: {status: 2, bookId: userBook.bookId, subscriptionId},
            include: [
              {model: Seller, as: 'seller', attributes: []},
              {model: Book, as: 'book', attributes: []}
            ],
            attributes: [
              'sellerId',
              'bookId',
              Sequelize.col('book.bookName'),
              Sequelize.col('book.ISBN'),
              Sequelize.col('seller.sellerName'),
              Sequelize.col('seller.phoneNumber'),
              Sequelize.col('seller.address'),
              Sequelize.col('seller.source'),
              Sequelize.col('seller.email'),
              'price'
            ]
          });
          const userInfoList = await UserBook.findAll({
            raw: true,
            where: {bookId: quoteInfo.bookId, subscriptionId, isPay: 1},
            include: [
              {model: User, as: 'user', attributes: []}
            ],
            attributes: [
              'id',
              'userId',
              Sequelize.col('user.account'),
              Sequelize.col('user.realName'),
              Sequelize.col('user.phoneNumber')
            ]
          });
          return {...quoteInfo, userInfoList};
        }));
        return {subscriptionName, className, bookList};
      }));
      return {data:data.filter(item=>!!item), assignerInfo};
    } catch (e) {
      console.log(e);
    }
  }
}

// //TODO 生成excel表格
//  new BookListModel().createExcelBookList({assignId: 13}).
//    then(res => console.log(res));

export default new BookListModel();
