// @flow
import express from "express";
import jwt from 'jsonwebtoken';
import type {$Request, $Response, NextFunction} from 'express';
import projectConstants from './projectConstants';

const JWT_SECRET_KEY = 'AABB987QWERTY5654';

export function CheckTokenAuth(request:$Request,response:$Response,next:NextFunction){
  try{

    let token:any = request.headers['x-access-token'];
    try {
      jwt.verify(token,"AABB987QWERTY5654",(err, decoded) =>{
        if(err){
          console.log("[CheckAuthToken]:token verification failed ",err.stack);
          let reply= ConstructMessage(projectConstants.SESSION_EXPIRED,{});
          response.json(reply);

        }else{
          console.log("[CheckAuthToken]:token verified successfully",decoded);
          next();
        }
      });

    }
    catch (e) {
      let reply= ConstructMessage(projectConstants.SESSION_EXPIRED,{});
      response.json(reply);
    }



  }
  catch (e){

    response.status(761).json({
      err:"Session Expired Login in Again"
    });
  }
}

export function ConstructMessage(msgType:string,data:any):ResponseMessage{

  let message :ResponseMessage = new ResponseMessage(msgType,data);
  return message;

}

export function GetNewUserToken(username:string):string{
  let token = jwt.sign({username:username,iat:Date.now()},JWT_SECRET_KEY,{expiresIn:"1d"});
  return token;
}


export function accessControl(req:$Request,res:$Response,next:NextFunction) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://34.218.234.60/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
}

export class ResponseMessage{
   message:string
   data:any

  constructor(message:string,data:any){
    this.message = message || '';
    this.data = data || {};
  }

   toJson():string{
    return  JSON.stringify(this);

  }

}
