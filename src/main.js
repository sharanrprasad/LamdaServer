// @flow
import express from 'express';
import type {$Request, $Response} from 'express';
import app from './app';
import restControllers from './controllers/restControllers';
import apiControllers from './controllers/apiControllers';
import path from 'path'
import * as utils from './utils';

const port: string = process.env.PORT || '3000';

app.use(utils.accessControl);
app.use("/rest-api",restControllers);
app.use("/api", apiControllers);

app.use(express.static(path.join(__dirname, '/../client/build')));

// $FlowFixMe
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

app.listen(port, () => console.log('Example app listening on port', port))
