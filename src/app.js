import Koa from 'koa';
import path from 'path';

import JWT from 'koa-jwt'
import helmet from 'koa-helmet';
import statics from 'koa-static';
import cors from 'koa2-cors'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import errorHandle from './public/ErrorHandle';
import router from './routes/routes';
import {JWTConfig} from './config';


const app = new Koa();
const jwt = JWT(JWTConfig).
  unless({path: [/^\/api\/public/]});

const middleware = compose([
  bodyParser(),
  helmet(),
  cors(),
  statics(path.join(__dirname, '../public')),
  errorHandle,
  jwt
]);

app.use(middleware);
app.use(router());

app.listen(5000);
