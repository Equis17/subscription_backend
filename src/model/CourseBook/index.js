import {CourseBook, Book} from '../model';
import {seq} from '../seq'
import _ from 'lodash'
import Sequelize from 'sequelize';

class CourseBookModel {
  /**
   * @param {string} id
   * @return {Object}
   * */
  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await CourseBook.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <CourseBookModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @return {Object}
   * */
  async getCourseBookByCourseId({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      const courseBookList = await CourseBook.findAll({
        where: {courseId: id},
        include: [{model: Book, attributes: [], as: 'book'}],
        raw: true,
        attributes: [
          'id',
          'courseId',
          'bookId',
          'status',
          Sequelize.col('book.bookName'),
          Sequelize.col('book.ISBN'),
          Sequelize.col('book.toggle')
        ]
      });
      return {code: 0, data: courseBookList}
    } catch (e) {
      console.log('MethodError: <CourseBookModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} id
   * @param {Array} courseBookList
   * @return {Object}
   * */
  async updateCourseBookByCourseId({id = '', courseBookList = []}) {
    const listFlag = courseBookList.some(item => !_.isEmpty(_.omitBy({
      bookId: item.bookId,
      status: item.status
    }, _.identity)));
    const idFlag = !_.isEmpty(_.omitBy({id}, _.identity));
    if (listFlag || idFlag) return {code: 9999, message: '参数不能为空'};
    return seq.transaction({}, (t) =>
      CourseBook.destroy({where: {courseId: id}}, {transaction: t}).
        then((t) => CourseBook.bulkCreate(courseBookList.map(item => ({...item, courseId: id}))))
    ).
      then(() => ({code: 0, message: '更新成功'})).
      catch((e) => {
        console.log('TransactionError: <CourseBookModel.updateCourseBookByCourseId>');
        return {code: 9999, message: '系统内部错误'};
      });
  }
}

export default new CourseBookModel()
