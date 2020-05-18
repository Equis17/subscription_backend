import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {getValue} from '../config/RedisConfig'

export const decryptInfo = (key) => {
  const privateKey = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem'), 'utf-8');
  // const privateKey = fs.readFileSync(path.resolve(__dirname, '../dist/src/public/rsa_private_key.pem'), 'utf-8');
  let buffer2 = Buffer.from(key, 'base64');
  let decrypted = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, buffer2);
  return decrypted.toString('utf-8')
};

export const getSqlArr = (filter) => [`SELECT ${filter.output} FROM ${filter.input}`];

export const getQueryStr = (sqlArr, strArr) => {
  strArr.length > 0 && sqlArr.push(' WHERE ');
  sqlArr.push(strArr.join(' AND '));
  return sqlArr.join('');
};

export const checkCode = async (key, value) => {
  const redisData = await getValue(key);
  if (redisData != null) {
    return redisData.toLowerCase() === value.toLowerCase();
  } else {
    return false
  }

};
