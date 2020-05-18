import Sequelize from 'sequelize';
import MySQLConfig from '../config/MySQLConfig';

const conf = {
  host: MySQLConfig.host,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  },
  timezone: '+08:00'
};
conf.pool = {
  max: 10,//最大连接数量
  min: 0,//最小
  idle: 10000//10秒后释放
};

const seq = new Sequelize(MySQLConfig.database, MySQLConfig.user, MySQLConfig.password, conf);

export {seq}
