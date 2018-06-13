
// @flow
import * as utils from "../../utils";
import type { $Request, $Response, NextFunction } from "express";
import projectConstants from "../../projectConstants";
import Rx from "rxjs";
import fetch from 'node-fetch';

const apis = {
  "128":
    "https://l6nd6ca19f.execute-api.us-west-2.amazonaws.com/prod/eratosthenes-128",
  "256":
    "https://l6nd6ca19f.execute-api.us-west-2.amazonaws.com/prod/eratosthenes-256",
  "512":
    "https://l6nd6ca19f.execute-api.us-west-2.amazonaws.com/prod/eratosthenes-512",
  "1024":
    "https://l6nd6ca19f.execute-api.us-west-2.amazonaws.com/prod/eratosthenes-1024"
};

const lamdaSingleRun = (request: $Request, response: $Response, next : NextFunction) => {

  try {
    const {
      maxPrime,
      numLoops,
      memory,
    } = request.body;
    console.log("Running aws lamda api ", maxPrime, numLoops, memory, request.body);

    let url = apis[memory] || apis["128"];
    fetch(getUrlQueryParameters(url, maxPrime, numLoops),{
      headers : {
        "x-api-key": '5y4pd4Nwuv2AHe7FfWONJ4RwkT98Vuc53HINwKdX'
      }
    })
      .then(resp => resp.json())
      .then(json => {
          let result = {};
          if(json.message){
                result = {
                  message : projectConstants.GENERIC_ERROR
                }
          }else{
            result = {
              message: projectConstants.SUCCESS,
              data : {
                durationSeconds : json.durationSeconds,
                loops : json.loops,
                memory: memory

              }
            }
          }
          response.json(result);
      }).catch(err => {
         let res = {
           message : projectConstants.GENERIC_ERROR,
         }
         response.json(res);

    })
  }catch (err) {
    let res = {
      message : projectConstants.GENERIC_ERROR,
    }
    response.json(res);
  }

};

function getUrlQueryParameters(url, max, loops) {
  const result = url + `?max=${max}&loops=${loops}`;
  return result;
}



export default lamdaSingleRun;

