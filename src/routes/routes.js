import combineRoutes from 'koa-combine-routers';
import {sysRouterRouter} from './Router'
import {sysRoleRouter} from './Role'
import {sysCategoryRouter, clientCategoryRouter} from './Category'
import {sysSysManagerRouter} from './SysManager'
import publicRouter from './Public'
import {sysCollegeRouter} from './College'
import {sysUserRouter, clientUserRouter} from './User'
import {sysClassRouter, clientClassRouter} from './Class'
import {sysBookRouter, clientBookRouter} from './Book'
import {sysCourseRouter, clientCourseRouter} from './Course'
import {sysSellerRouter, clientSellerRouter} from './Seller'
import {sysUserBookRouter, clientUserBookRouter} from './UserBook'
import {sysBookListRouter, clientBookListRouter} from './BookList'
import {sysQuoteRouter, clientQuoteRouter} from './Quote'
import {sysAssignRouter} from './Assign'
import {sysSubscriptionRouter,clientSubscriptionRouter} from './Subscription'
import {sysOrderRouter, clientOrderRouter} from './Order'

const sysRouterList = [
  sysRouterRouter,
  sysRoleRouter,
  sysCategoryRouter,
  sysSysManagerRouter,
  publicRouter,
  sysCollegeRouter,
  sysUserRouter,
  sysClassRouter,
  sysBookRouter,
  // sysCourseRouter,
  sysSellerRouter,
  sysUserBookRouter,
  sysBookListRouter,
  sysAssignRouter,
  sysQuoteRouter,
  sysSubscriptionRouter,
  sysOrderRouter
];

const clientRouterList = [
  // clientRouterRouter,
  // clientRoleRouter,
  clientCategoryRouter,
  // clientSysManagerRouter,
  // clientPublicRouter.
  // clientCollegeRouter,
  clientUserRouter,
  clientClassRouter,
  clientBookRouter,
  // clientCourseRouter,
  clientSellerRouter,
  clientUserBookRouter,
  clientBookListRouter,
  clientQuoteRouter,
  clientOrderRouter,
  clientSubscriptionRouter
];

export default combineRoutes([...sysRouterList, ...clientRouterList]);
