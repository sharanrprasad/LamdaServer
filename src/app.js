// @flow
import express from 'express';
import type {$Application} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import type { $Request, $Response, NextFunction } from 'express';

const app:$Application = express();

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie and sessions
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));



const globalErrHandler = (err,request: $Request,response: $Response, next: NextFunction) => {
  console.log('Error', err.stack);
  response.status(500).send('Something broke!');
}

app.use(globalErrHandler);

export default  app;
