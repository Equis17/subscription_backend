import {Book, BookList, Quote} from '../model';
import _ from 'lodash'
import Sequelize from 'sequelize';
import stuClassModel from '../StuClass';

// const {Op} = Sequelize;

class BookModel {
  /**
   * @param {string} bookName
   * @param {string} ISBN
   * @param {string} status
   * @param {string} toggle
   * @return {Object}
   */
  async getList({bookName = '', ISBN = '', status = '', toggle = ''}) {
    const where = _.pickBy({bookName, ISBN, status, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const bookList = await Book.findAll({where, raw: true});
      return {code: 0, data: bookList}
    } catch (e) {
      console.log('MethodError: <BookModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} bookName
   * @param {string} ISBN
   * @param {string} status
   * @param {string} toggle
   * @return {Object}
   */
  async insert({bookName = '', ISBN = '', status = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({bookName, ISBN, status: ['1', '2', '3'].includes(status.toString()) ? status : '', toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Book.create({bookName, ISBN, status, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'};
    } catch (e) {
      console.log('MethodError: <BookModel.insert>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @return {Object}
   */
  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Book.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <BookModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} bookName
   * @param {string} ISBN
   * @param {string} status
   * @param {string} toggle
   * @return {Object}
   */
  async update({id = '', bookName = '', ISBN = '', status = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({id, bookName, ISBN, status: ['1', '2', '3'].includes(status.toString()) ? status : '', toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Book.update(
        {bookName, ISBN, status, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <BookModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getUserBook() {
    try {
      const bookList = await Book.findAll({
        where: {toggle: 1, status: 2},
        attributes: ['id', 'bookName', 'ISBN']
      });
      return {code: 0, data: bookList}
    } catch (e) {
      console.log(e)
    }
  }
//0为未征订,1:征订中,2:征订到的
  async getQuoteInfo() {
    try {
      const bookLists = await BookList.findAll({
        raw: true,
        attributes: [
          'bookIds',
        ]
      });

      const bookIdsList = bookLists.length > 0
        ? _.uniq(bookLists.map(i => i.bookIds).
          join(',').
          split(','))
        : [];

      const data = await Promise.all(bookIdsList.map(async id => {
          const quoteList = await Quote.findAll({
            raw: true,
            order: ['status'],
            where: {bookId: id},
            attributes: ['status']
          });
          return {
            id,
            ...await Book.findOne({
              raw: true,
              where: {id},
              attributes: ['bookName', 'ISBN'],
            }),
            status: quoteList.length > 0 ? quoteList[0]['status'] : 0
          }
        }
      ));
      return {code: 0, data}
    } catch (e) {
      console.log(e)
    }
  }
}


export default new BookModel()
