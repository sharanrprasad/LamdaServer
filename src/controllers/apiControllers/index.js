// @flow
import express from "express";
import loginController from './loginController';
import signUpController from './signUpController';
import { accessControl } from '../../utils';


const bodyParser = require("body-parser");
const router = express.Router();

//bodyparser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/sign-in',loginController);

router.use(accessControl);

export  default  router;
