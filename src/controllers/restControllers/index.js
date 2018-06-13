// @flow
import express from "express";
import * as utils from '../../utils';
import bodyParser from 'body-parser';
import lamdaRun from './lamdaRun';
import lamdaSingleRun from './lambdaSingleRun';


const router = express.Router();


//bodyparser
router.use(bodyParser.json());

router.use(utils.CheckTokenAuth);


router.post('/getresults', lamdaRun);

router.post('/getsingleLambda', lamdaSingleRun)

export default  router;

