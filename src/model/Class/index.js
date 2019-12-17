import {Assign, Class, College} from '../model'
import _ from 'lodash'
import Sequelize from 'sequelize';

class ClassModel {
  /**
   * @param {string} collegeId
   * @param {string} className
   * @param {string} session
   * @param {string} toggle
   * @return {Object}
   */
  async getList({collegeId = '', className = '', session = '', toggle = ''}) {
    const where = _.pickBy({collegeId, className, session, toggle: toggle === '1' ? '1' : toggle === '0' ? '0' : ''}, _.identity);
    try {
      const classList = await Class.findAll({
        where,
        include: [{model: College, attributes: [], as: 'college'}],
        raw: true,
        attributes: ['id', 'collegeId', Sequelize.col('college.collegeName'), 'className', 'session', 'toggle']
      });
      return {code: 0, data: classList}
    } catch (e) {
      console.log('MethodError: <ClassModel.getList>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} collegeId
   * @param {string} className
   * @param {string} session
   * @param {string} toggle
   * @return {Object}
   */
  async insert({collegeId = '', className = '', session = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({collegeId, className, session, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Class.create({collegeId, className, session, toggle: toggle.toString() === '1' ? '1' : '0'});
      return {code: 0, message: '添加成功'}
    } catch (e) {
      console.log('MethodError: <ClassModel.insert>');
      return {code: 9999, message: '系统内部错误'}
    }
  }

  /**
   * @param {string} id
   * @return {Object}
   */
  async deleteById({id = ''}) {
    if (!_.isEmpty(_.omitBy({id}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Class.destroy({where: {id}});
      return {code: 0, message: '删除成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.deleteById>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  /**
   * @param {string} id
   * @param {string} collegeId
   * @param {string} className
   * @param {string} session
   * @param {string} toggle
   * @return {Object}
   */
  async update({id = '', collegeId = '', className = '', session = '', toggle = ''}) {
    if (!_.isEmpty(_.omitBy({id, collegeId, className, session, toggle}, _.identity))) return {code: 9999, message: '参数不能为空'};
    try {
      await Class.update(
        {collegeId, className, session, toggle: toggle.toString() === '1' ? '1' : '0'},
        {where: {id}}
      );
      return {code: 0, message: '更新成功'};
    } catch (e) {
      console.log('MethodError: <ClassModel.update>');
      return {code: 9999, message: '系统内部错误'};
    }
  }

  async getUserClassList() {
    try {
      const classList = await Class.findAll({
        raw: true,
        where: {toggle: 1},
        include: [
          {model: College, attributes: [], as: 'college'}
        ],
        attributes: ['id', 'className', 'session', Sequelize.col('college.collegeName')]
      });
      return {code: 0, data: classList}
    } catch (e) {
      console.log(e)
    }
  }

  async getAssignerClassList({assignId}) {
    try {
      const classList = await Assign.findAll({
        raw: true,
        where: {assignId, status: 1},
        attributes: ['classId']
      });
      const idList = [...new Set(classList.map(item => item.classId))];
      const data = await Promise.all(idList.map(async id => {
        return Class.findAll({
          raw: true,
          where: {id},
          include: [
            {model: College, attributes: [], as: 'college'}
          ],
          attributes: ['id', 'className', 'collegeId', Sequelize.col('college.collegeName')]
        });
      }));
      return {code: 0, data:_.flatten(data)}
    } catch (e) {
      console.log(e)
    }
  }

}

export default new ClassModel()
