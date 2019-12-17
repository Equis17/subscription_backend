import mysql from 'mysql'
import {mysqlConfig} from '../config'

export default (sql, val, isQuery = true) => {
  const pool = mysql.createPool(mysqlConfig);

  return new Promise((res, rej) => {
    pool.getConnection((err, connection) => {
      err && rej(err);
      connection.query(sql, val, (err, result) => {
        if (err) {
          console.log(err);
          res({code: 9999, message: '系统错误'});
        }
        isQuery
          ? res({code: 0, data: result})
          : res({code: 0, message: '操作成功'});
        connection.release();
      })
    })
  })
}

