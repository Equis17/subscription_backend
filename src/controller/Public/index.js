import fs from 'fs'
import path from 'path'
import {decryptInfo} from '../../utils/Utils';
import svgCaptcha from 'svg-captcha'
import {setValue} from '../../config/RedisConfig';
import xlsx from 'node-xlsx'
import bookListModel from '../../model/BookList'
import JWTDecode from 'jwt-decode';
import _ from 'lodash'

class PublicController {
  constructor(props) {
  }

  async getPublicKey(ctx) {
    const publicKey = fs.readFileSync(path.join(__dirname, '../../public/rsa_public_key.pem'), 'utf-8');
    // const publicKey = fs.readFileSync(path.resolve(__dirname, '../dist/src/public/rsa_public_key.pem'), 'utf-8');
    ctx.body = {code: 0, data: {publicKey}}
  }

  async test(ctx) {
    ctx.body = {
      code: 0, data: {
        path: __dirname,
        name: __filename,
        who: path.resolve(__dirname),
        wholePath2: path.resolve(__dirname, '../dist/src/public/rsa_public_key.pem'),
        wholePath3: path.resolve(__dirname,'../dist/public/rsa_public_key.pem'),
      }
    }
  }

  async decrypt(ctx) {
    let keys = ctx.request.body.key.replace(/\s+/g, '+');
    const decryptedInfo = decryptInfo(keys);
    console.log(decryptedInfo);
  }

  async getCaptcha(ctx) {
    const {sid} = ctx.query;
    const newCaptcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      color: true,
      ignoreChars: '0oOiIlL',
      noise: Math.floor(Math.random() * 3 + 2),
      width: 195,
      height: 40
    });
    setValue(sid, newCaptcha.text, 90);
    ctx.body = {
      code: 200,
      data: newCaptcha.data
    }
  }

  async createExcel(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.params.auth);
    const data = await bookListModel.createExcelBookList({assignId});
    if (data && data.data.length <= 0) {
      ctx.body = {code: 0, message: '暂无书单'}
    }

    let dataSheets = [];
    data.data.map(item => {
      const {subscriptionName, className, bookList} = item;
      const dataSheet = [
        [subscriptionName],
        [className, null, null, null, null, null, null, null, null, '日期:', new Date()],
        ['ISBN', null, '教材名称', null, '批发商', null, '手机号', '邮箱', null, '地址', null, '单价', '数量'],
        ...bookList.map(item => {
          const {ISBN, bookName, sellerName, phoneNumber, email, address, count, price, source} = item;
          return [ISBN, null, bookName, null, `${source}-${sellerName}`, null, phoneNumber, email, null, address, null, price, count]
        })
      ];
      const range = [
        {s: {c: 0, r: 0}, e: {c: 12, r: 0}},
        {s: {c: 0, r: 1}, e: {c: 4, r: 1}},
        {s: {c: 10, r: 1}, e: {c: 12, r: 1}},
        {s: {c: 0, r: 2}, e: {c: 1, r: 2}},
        {s: {c: 2, r: 2}, e: {c: 3, r: 2}},
        {s: {c: 4, r: 2}, e: {c: 5, r: 2}},
        {s: {c: 7, r: 2}, e: {c: 8, r: 2}},
        {s: {c: 9, r: 2}, e: {c: 10, r: 2}},
      ];
      const cols = [
        {wch: 7.5},
        {wch: 15},
        {wch: 15},
        {wch: 15},
        {wch: 7.5},
        {wch: 7.5},
        {wch: 15},
        {wch: 7.5},
        {wch: 7.5},
        {wch: 15},
        {wch: 15},
        {wch: 10},
        {wch: 5}
      ];
      bookList.map((item, index) => {
        range.push(
          {s: {c: 0, r: 2 + index + 1}, e: {c: 1, r: 2 + index + 1}},
          {s: {c: 2, r: 2 + index + 1}, e: {c: 3, r: 2 + index + 1}},
          {s: {c: 4, r: 2 + index + 1}, e: {c: 5, r: 2 + index + 1}},
          {s: {c: 7, r: 2 + index + 1}, e: {c: 8, r: 2 + index + 1}},
          {s: {c: 9, r: 2 + index + 1}, e: {c: 10, r: 2 + index + 1}}
        )
      });
      range.push(
        {s: {c: 0, r: 6}, e: {c: 1, r: 6}},
        {s: {c: 0, r: 7}, e: {c: 1, r: 7}},
      );
      let priceAmount = 0, countAmount = 0;
      bookList.map(item => {
        priceAmount += item.count * item.price;
        countAmount += item.count
      });
      dataSheet.push(
        [`分配员:${data.assignerInfo.realName}`],
        [`联系方式:${data.assignerInfo.phoneNumber}`, null, null, null, null, null, null, null, null, null, '合计:', priceAmount, countAmount]
      );
      const sheetOptions = {'!merges': range, '!cols': cols};
      dataSheets.push({name: `${subscriptionName}-${className}`.slice(0,31), data: dataSheet, options: sheetOptions})
    });

    const buffer = xlsx.build(dataSheets);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', 'attachment; filename=bookList.xlsx');
    ctx.body = buffer
  }
  async createExcelDetail(ctx) {
    const {_auth: roleId, _uid: assignId} = JWTDecode(ctx.params.auth);
    const data = await bookListModel.createExcelDetailBookList({assignId});
    if (data && data.data.length <= 0) {
      ctx.body = {code: 0, message: '暂无书单'}
    }
    let dataSheets = [];
    data.data.map(item => {
      const {subscriptionName, className, bookList} = item;
      const dataSheet = [
        [subscriptionName],
        [className, null, null, null, null, null, null, null, null, '日期:', new Date()],
        ['ISBN', null, '教材名称', null, '批发商', null, '手机号', '学号', null, '学生手机号', null, '姓名', '单价'],
        ..._.flatten(bookList.map(item => {
          const {ISBN, bookName, sellerName, phoneNumber, userInfoList, price, source} = item;

          return userInfoList.map(userBook=>{
            const {realName,account,phoneNumber:stuPhoneNumber}=userBook;
            return [ISBN, null, bookName, null, `${source}-${sellerName}`, null, phoneNumber, account, null, stuPhoneNumber, null, realName, price]
          })
        }))
      ];
      console.log(dataSheet);
      const range = [
        {s: {c: 0, r: 0}, e: {c: 12, r: 0}},
        {s: {c: 0, r: 1}, e: {c: 4, r: 1}},
        {s: {c: 10, r: 1}, e: {c: 12, r: 1}},
        {s: {c: 0, r: 2}, e: {c: 1, r: 2}},
        {s: {c: 2, r: 2}, e: {c: 3, r: 2}},
        {s: {c: 4, r: 2}, e: {c: 5, r: 2}},
        {s: {c: 7, r: 2}, e: {c: 8, r: 2}},
        {s: {c: 9, r: 2}, e: {c: 10, r: 2}},
      ];
      const cols = [
        {wch: 7.5},
        {wch: 15},
        {wch: 15},
        {wch: 15},
        {wch: 7.5},
        {wch: 7.5},
        {wch: 15},
        {wch: 7.5},
        {wch: 7.5},
        {wch: 15},
        {wch: 15},
        {wch: 10},
        {wch: 5}
      ];
      bookList.map((item, index) => {
        range.push(
          {s: {c: 0, r: 2 + index + 1}, e: {c: 1, r: 2 + index + 1}},
          {s: {c: 2, r: 2 + index + 1}, e: {c: 3, r: 2 + index + 1}},
          {s: {c: 4, r: 2 + index + 1}, e: {c: 5, r: 2 + index + 1}},
          {s: {c: 7, r: 2 + index + 1}, e: {c: 8, r: 2 + index + 1}},
          {s: {c: 9, r: 2 + index + 1}, e: {c: 10, r: 2 + index + 1}}
        )
      });
      range.push(
        {s: {c: 0, r: 6}, e: {c: 1, r: 6}},
        {s: {c: 0, r: 7}, e: {c: 1, r: 7}},
      );
      let priceAmount = 0, countAmount = 0;
      bookList.map(item => {
        priceAmount += item.count * item.price;
        countAmount += item.count
      });
      dataSheet.push(
        [`分配员:${data.assignerInfo.realName}`],
        [`联系方式:${data.assignerInfo.phoneNumber}`, null, null, null, null, null, null, null, null, null, null, null, null]
      );
      const sheetOptions = {'!merges': range, '!cols': cols};
      dataSheets.push({name: `${subscriptionName}-${className}`.slice(0,31), data: dataSheet, options: sheetOptions})
    });

    const buffer = xlsx.build(dataSheets);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', 'attachment; filename=bookList.xlsx');
    ctx.body = buffer
  }

}

export default new PublicController();
