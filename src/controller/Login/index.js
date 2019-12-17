import {SysManager, User, Seller} from '../../model/model'
import jsonwebtoken from 'jsonwebtoken'
import {checkCode, decryptInfo} from '../../utils/Utils'
import JWTConfig from '../../config/JWTConfig';

class LoginController {
  constructor() {
  }

  async login(ctx) {
    const {captcha, sid, account, password, roleId} = ctx.request.body;
    const result = await checkCode(sid, captcha);

    if (result) {
      let user = await {
        1: async () => SysManager.findOne({where: {account, roleId, toggle: 1}}),
        2: async () => SysManager.findOne({where: {account, roleId, toggle: 1}}),
        3: async () => User.findOne({where: {account, roleId, toggle: 1}}),
        4: async () => User.findOne({where: {account, roleId, toggle: 1}}),
        5: async () => Seller.findOne({where: {phoneNumber: account, roleId, toggle: 1}}),
        6: async () => User.findOne({where: {account, roleId, toggle: 1}})
      }[roleId]();

      const checkPassword = user
        ? decryptInfo(user.password) === decryptInfo(password)
        : false;

      if (checkPassword) {
        const {account = '', roleId, realName = '', sellerName = '', phoneNumber = '', id = ''} = user.dataValues;
        //token签名
        let token = jsonwebtoken.sign({_id: account || phoneNumber, _auth: roleId, _uid: id, _userName: realName || sellerName}, JWTConfig.secret, {expiresIn: '6h'});
        ctx.body = {code: 200, message: '登录成功', token}
      } else {
        ctx.body = {code: 404, message: '用户名或者密码错误'}
      }
    } else {
      ctx.body = {code: 401, message: '图片验证码不正确'}
    }
  }
}

export default new LoginController()
