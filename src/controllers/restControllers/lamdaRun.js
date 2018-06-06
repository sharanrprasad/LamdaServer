// @flow
import * as utils from "../../utils";
import type { $Request, $Response, NextFunction } from "express";
import errCodes from "../../projectConstants";
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

const lamdaRun = (request: $Request, response: $Response, next : NextFunction) => {

  try {
    const {
      maxPrime,
      numLoops,
      numOfExecutions
    } = request.body;
    console.log("Running aws lamda api ", maxPrime, numLoops,numOfExecutions,request.body);
    let observableArray: Array<Rx.Observable<any>> = [];
    for (var api in apis) {
      for (let i = 0; i < numOfExecutions; i++) {
        observableArray.push(getObservable(api, maxPrime, numLoops));
      }
    }
    let finalResult = {
      "128": 0,
      "256": 0,
      "512": 0,
      "1024": 0,
      err: 0
    };

    Rx.Observable.forkJoin(observableArray).subscribe(result => {
      result.forEach(val => {
        if (!val.isError) {
          finalResult[val.api] += val.durationSeconds;
        } else {
          finalResult.err++;
        }
      });
      const responseObject = getResponseObject(finalResult,numOfExecutions);
      console.log(responseObject);
      response.json(utils.ConstructMessage(errCodes.SUCCESS, responseObject));
    });
  } catch (err) {
    console.log(err.toString());
    response.json(utils.ConstructMessage(errCodes.GENERIC_ERROR, {}));
  }
};

function getUrlQueryParameters(url, max, loops) {
  const result = url + `?max=${max}&loops=${loops}`;
  return result;
}

function getObservable(api, maxPrime, numLoops) {
  return Rx.Observable.fromPromise(
    fetch(getUrlQueryParameters(apis[api], maxPrime, numLoops),{
      headers : {
        "x-api-key": 'yruBDqvlA54Lq0xQefXWJ4kGWo0lekC35jPOUOMy'
      }
    })
  )
    .mergeMap(response => Rx.Observable.fromPromise(response.json()))
    .map(jsonValue => {
      jsonValue.api = api;
      return jsonValue;
    })
    .catch(err =>
      Rx.Observable.of({
        isError: true
      })
    );
}


function getResponseObject(finalResult : any, numofExecutions : number) {
  console.log(finalResult);
  const costPerSecond = 0.00001667;
  const costPerRequest = 0.0000002;
  let responseObj = {
    dataSet : [],
    err : finalResult.err
  }

  let arr = [128,256, 512,1024];
  arr.forEach(val => {
    responseObj.dataSet.push({
      ram: val,
      totalTime: finalResult[val.toString()],
      averageTime: finalResult[val.toString()]/numofExecutions,
      cost: (numofExecutions * costPerRequest) +((val/1024) * finalResult[val.toString()] * costPerSecond)
    })
  })

  return responseObj;
}


export default lamdaRun;
