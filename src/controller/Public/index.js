import fs from 'fs'
import path from 'path'
import {decryptInfo} from '../../utils/Utils';
import svgCaptcha from 'svg-captcha'
import {setValue} from '../../config/RedisConfig';

class PublicController {
  constructor(props) {
  }

  async getPublicKey(ctx) {
    const publicKey = fs.readFileSync(path.join(__dirname, '../../public/rsa_public_key.pem'), 'utf-8');
    ctx.body = {code: 0, data: {publicKey}}
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

}

export default new PublicController();
