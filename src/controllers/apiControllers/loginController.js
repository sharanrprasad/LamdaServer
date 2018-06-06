//@flow
import * as utils from '../../utils'
import type { $Request, $Response } from 'express';
import errCodes from '../../projectConstants';

const signIn = (request: $Request, response : $Response) => {
  console.log("In sign in");
  try{
    let username = request.body.username;
    let password = request.body.password;

    console.log(request.body);
    if(username !== "nwen406@ecs.com"){
      response.json(utils.ConstructMessage(errCodes.USER_NOT_PRESENT,{token:null}));
    }else if(password !== "nwen406@123"){
      response.json(utils.ConstructMessage(errCodes.INCORRECT_PASSWORD,{token:null}));
      return;
    }else{
      let token = utils.GetNewUserToken(username);
      response.json(utils.ConstructMessage(errCodes.SUCCESS,{token:token}));
      return;
    }

  }catch(err){
    response.json( utils.ConstructMessage(errCodes.GENERIC_ERROR,{userdata:null}));
    return;
  }


}


export default  signIn;
