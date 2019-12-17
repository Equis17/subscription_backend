/**
 * @description 存储配置
 * @author Equis
 * */
import redis from 'redis'
import {promisifyAll} from 'bluebird'

const config = {
  host: '101.132.159.200',
  port: 15001,
  password: '123456'
};

const options = {
  ...config,
  detect_buffers: true,
  no_ready_check:true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
};

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options));
client.on('error', (err) => console.log('Redis Client Error:' + err));

/**
 * @param {string} key key
 * @param {string} value value
 * @param {number} time 过期时间, 单位s
 * */
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).
      forEach((item) => client.hset(key, item, value[item], redis.print))
  }
};

const getValue = (key) => client.getAsync(key);

const getHValue = (key) => client.hgetallAsync(key);

const delValue = (key) => client.del(key, (err, res) => res === 1
  ? console.log('delete successfully')
  : console.log('delete redis key error:' + err));

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}
