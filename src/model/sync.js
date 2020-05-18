import {seq} from './seq'
import './model'
seq.authenticate().
  then(() => console.log('ok')).
  catch((err) => console.log(err));

seq.sync({force: true}).
  then(() => process.exit());
