import sellerModel from '../../model/Seller'
import sequelize from 'sequelize';

const Op = sequelize.Op;

class SellerController {
  constructor(props) {
  }

  async getList(ctx) {
    const {sellerName = '', source = '', phoneNumber = '', email = '', address = '', toggle} = ctx.query;
    ctx.body = await sellerModel.getList({
      sellerName: {[Op.like]: `%${sellerName}%`},
      source: {[Op.like]: `%${source}%`},
      phoneNumber: {[Op.like]: `%${phoneNumber}%`},
      email: {[Op.like]: `%${email}%`},
      address: {[Op.like]: `%${address}%`},
      toggle
    });
  }

  async add(ctx) {
    const {sellerName, source, phoneNumber, email, address, password, toggle} = ctx.request.body;
    ctx.body = await sellerModel.insert({sellerName, source, phoneNumber, email, address, toggle, password})
  }

  async delete(ctx) {
    const {id} = ctx.params;
    ctx.body = await sellerModel.deleteById({id});
  }

  async update(ctx) {
    const {id} = ctx.params;
    const {sellerName, source, phoneNumber, email, address, toggle, password} = ctx.request.body;
    ctx.body = await sellerModel.update({id, sellerName, source, phoneNumber, email, address, toggle, password})
  }

  async getSelectList(ctx) {
    ctx.body = await sellerModel.getSelectList();
  }
}

export default new SellerController();
