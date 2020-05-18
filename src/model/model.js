import Sequelize from 'sequelize';
import {seq} from './seq'
//角色表
const Role = seq.define('role', {
  //角色名称
  roleName: {type: Sequelize.STRING, allowNull: false},
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

//路由表
const Router = seq.define('router', {
  //路由名称
  routerName: {type: Sequelize.STRING, allowNull: false},
  //路由地址
  routerUrl: {type: Sequelize.STRING, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.BOOLEAN, allowNull: false}
});

//菜单权限表
const Category = seq.define('category', {
  //角色id
  roleId: {type: Sequelize.INTEGER, allowNull: false},
  //路由id列表
  routerIds: {type: Sequelize.STRING, allowNull: false}
});

Category.belongsTo(Role, {foreignKey: 'roleId'});

//系统管理员表
const SysManager = seq.define('sysManager', {
    //角色id
    roleId: {type: Sequelize.INTEGER, allowNull: false},
    //账号
    account: {type: Sequelize.STRING, allowNull: false},
    //密码
    password: {type: Sequelize.STRING, allowNull: false},
    //姓名
    realName: {type: Sequelize.STRING, allowNull: false},
    //手机号
    phoneNumber: {type: Sequelize.STRING, allowNull: false},
    //是否启用
    toggle: {type: Sequelize.INTEGER, allowNull: false}
  }
);

SysManager.belongsTo(Role, {foreignKey: 'roleId'});

Role.hasMany(SysManager, {foreignKey: 'roleId', target: 'id'});

//学院表
const College = seq.define('college', {
  //学院名称
  collegeName: {type: Sequelize.STRING, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

//用户表
const User = seq.define('user', {
  //角色id
  roleId: {type: Sequelize.INTEGER, allowNull: false},
  //账号
  account: {type: Sequelize.STRING, allowNull: false},
  //真实姓名
  realName: {type: Sequelize.STRING, allowNull: false},
  //手机号
  phoneNumber: {type: Sequelize.STRING, allowNull: false},
  //密码
  password: {type: Sequelize.STRING, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

User.belongsTo(Role, {foreignKey: 'roleId'});

Role.hasMany(User, {foreignKey: 'roleId', target: 'id'});

//班级表
const Class = seq.define('class', {
  //学院id
  collegeId: {type: Sequelize.INTEGER, allowNull: false},
  //班级名称
  className: {type: Sequelize.STRING, allowNull: false},
  //年级
  session: {type: Sequelize.STRING, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

Class.belongsTo(College, {foreignKey: 'collegeId'});

College.hasMany(Class, {foreignKey: 'collegeId', target: 'id'});

//学生班级表
const StuClass = seq.define('stuClass', {
  //班级id
  classId: {type: Sequelize.INTEGER, allowNull: false},
  //用户id
  userId: {type: Sequelize.INTEGER, allowNull: false}
});

StuClass.belongsTo(Class, {foreignKey: 'classId'});

StuClass.belongsTo(User, {foreignKey: 'userId'});

//课程表
const Course = seq.define('course', {
  //用户id
  userId: {type: Sequelize.INTEGER, allowNull: false},
  //学院id
  collegeId: {type: Sequelize.INTEGER, allowNull: false},
  //课程名
  courseName: {type: Sequelize.STRING, allowNull: false},
  //上课时间
  courseTime: {type: Sequelize.STRING, allowNull: false},
  //学院id列表
  collegeIds: {type: Sequelize.STRING, allowNull: false},
  //年级列表
  sessions: {type: Sequelize.STRING, allowNull: false}
});

Course.belongsTo(User, {foreignKey: 'userId'});

User.hasMany(Course, {foreignKey: 'userId', target: 'id'});

Course.belongsTo(College, {foreignKey: 'collegeId'});

College.hasMany(Course, {foreignKey: 'collegeId', target: 'id'});

//批发商列表
const Seller = seq.define('seller', {
  //批发商名称
  sellerName: {type: Sequelize.STRING, allowNull: false},
  //角色
  roleId: {type: Sequelize.INTEGER, allowNull: false},
  //来源
  source: {type: Sequelize.STRING, allowNull: false},
  //手机号
  phoneNumber: {type: Sequelize.STRING, allowNull: false},
  //密码
  password: {type: Sequelize.STRING, allowNull: false},
  //邮箱
  email: {type: Sequelize.STRING, allowNull: false},
  //地址
  address: {type: Sequelize.STRING, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

Seller.belongsTo(Role, {foreignKey: 'roleId'});

Role.hasMany(Seller, {foreignKey: 'roleId', target: 'id'});
const Book = seq.define('book', {
  //教材名称
  bookName: {type: Sequelize.STRING, allowNull: false},
  //isbn
  ISBN: {type: Sequelize.STRING, allowNull: false},
  //状态 {1:审批中,2:审批未通过,3:审批通过}
  status: {type: Sequelize.INTEGER, allowNull: false},
  //是否启用
  toggle: {type: Sequelize.INTEGER, allowNull: false}
});

//课程教材列表
const CourseBook = seq.define('courseBook', {
  //课程id
  courseId: {type: Sequelize.INTEGER, allowNull: false},
  //教材id
  bookId: {type: Sequelize.INTEGER, allowNull: false},
  //状态{1:审核中,2:审核不通过,3:审核通过}
  status: {type: Sequelize.INTEGER, allowNull: false}
});

CourseBook.belongsTo(Course, {foreignKey: 'courseId'});

Course.hasMany(CourseBook, {foreignKey: 'courseId', target: 'id'});

CourseBook.belongsTo(Book, {foreignKey: 'bookId'});

Book.hasMany(CourseBook, {foreignKey: 'bookId', target: 'id'});

//用户教材列表
const UserBook = seq.define('userBook', {
  //用户id
  userId: {type: Sequelize.INTEGER, allowNull: false},
  //教材id
  bookId: {type: Sequelize.INTEGER, allowNull: false},
  //是否支付
  isPay: {type: Sequelize.BOOLEAN, allowNull: false},
  //
  subscriptionId: {type: Sequelize.INTEGER, allowNull: false}
});

UserBook.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(UserBook, {foreignKey: 'userId', target: 'id'});
UserBook.belongsTo(Book, {foreignKey: 'bookId'});
Book.hasMany(UserBook, {foreignKey: 'bookId', target: 'id'});

const Quote = seq.define('quote', {
  bookId: {type: Sequelize.INTEGER, allowNull: false},
  sellerId: {type: Sequelize.INTEGER, allowNull: false},
  subscriptionId: {type: Sequelize.INTEGER, allowNull: false},
  price: {type: Sequelize.STRING, allowNull: false},
  time: {type: Sequelize.DATE, allowNull: false},
  status: {type: Sequelize.INTEGER, allowNull: false}
});

Quote.belongsTo(Book, {foreignKey: 'bookId'});
Book.hasMany(Quote, {foreignKey: 'bookId', target: 'id'});
Quote.belongsTo(Seller, {foreignKey: 'sellerId'});
Seller.hasMany(Quote, {foreignKey: 'sellerId', target: 'id'});

const SellerOrder = seq.define('sellerOrder', {
  quoteId: {type: Sequelize.INTEGER, allowNull: false},
  time: {type: Sequelize.DATE, allowNull: false},
  status: {type: Sequelize.INTEGER, allowNull: false},
});

SellerOrder.belongsTo(Quote, {foreignKey: 'quoteId'});
Quote.hasMany(SellerOrder, {foreignKey: 'quoteId', target: 'id'});

//年级书单表
const BookList = seq.define('bookList', {
  bookListName: {type: Sequelize.STRING, allowNull: false},
  collegeId: {type: Sequelize.INTEGER, allowNull: false},
  toggle: {type: Sequelize.INTEGER, allowNull: false},
  bookIds: {type: Sequelize.STRING, allowNull: false},
  classIds: {type: Sequelize.STRING, allowNull: false},
});
BookList.belongsTo(College, {foreignKey: 'collegeId'});

//分配列表
const Assign = seq.define('assign', {
  userId: {type: Sequelize.INTEGER, allowNull: false},
  classId: {type: Sequelize.INTEGER, allowNull: false},
  status: {type: Sequelize.INTEGER, allowNull: false},
  assignId: {type: Sequelize.INTEGER, allowNull: false}
});


Assign.belongsTo(Class, {foreignKey: 'classId'});
Assign.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Assign, {foreignKey: 'assignId', target: 'id'});

const Subscription = seq.define('subscription', {
  subscriptionName: {type: Sequelize.STRING, allowNull: false},
  status: {type: Sequelize.INTEGER, allowNull: false},
});
Quote.belongsTo(Subscription, {foreignKey: 'subscriptionId'});
Subscription.hasMany(Quote, {foreignKey: 'subscriptionId', target: 'id'});
BookList.belongsTo(Subscription, {foreignKey: 'subscriptionId'});
Subscription.hasMany(BookList, {foreignKey: 'subscriptionId', target: 'id'});

UserBook.belongsTo(Subscription, {foreignKey: 'subscriptionId'});
Subscription.hasMany(UserBook, {foreignKey: 'subscriptionId', target: 'id'});


export {Role, Router, Category, SysManager, College, User, Class, StuClass, Seller, Book, UserBook, Quote, SellerOrder, BookList, Assign, Subscription}
