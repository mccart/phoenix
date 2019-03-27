import BroadcastChannel from "broadcast-channel";
import Worker from "./queries.worker.js";
import { Observable } from "rxjs/Observable";
import { ofType } from "redux-observable";
import {
  CREATE_QUERY,
  RESUME_QUERY,
  PAUSE_QUERY,
  CANCEL_QUERY,
  DELETE_QUERY
} from "./QueryActions";
import _ from "lodash";

const initialState = {};
// eslint-disable-next-line import/no-webpack-loader-syntax
//const Worker = require("worker-loader!./queries.worker.js");

export const sharedWorkerProxyEpic = (action$, state$) => {
  const worker = new Worker();
  const bcast = new BroadcastChannel("query");
  //const port = worker.port;
  //worker.onerror = e => console.error("HUH", e);

  //This observable takes all responses from the shared worker,
  //assues they are actions, and passes them back to redux
  //If an error occurs, this will die
  const observable = new Observable(observer => {
    bcast.onmessage = function(e) {
      //console.log("Got message from worker", e.data.length / 1000000 + "MB");
      //console.time("Parsing data");
      let data = JSON.parse(e);
      if (_.isArray(data)) {
        _.each(data, action => observer.next(action));
      } else {
        observer.next(data);
      }
      //console.timeEnd("Parsing data");
    };
    bcast.onerror = function(e) {
      //TODO: We should put out some message that can be used to restart the worker,
      //or at least log it.
      console.error(
        "An error occured in the receiver, we should probably do something smart",
        e
      );
      observer.error(e);
    };
    worker.onerror = function(e) {
      //TODO: We should put out some message that can be used to restart the worker,
      //or at least log it.
      console.error(
        "An error occured in the shared worker, we should probably do something smart",
        e
      );
      observer.error(e);
    };
  });

  //Here, we take all whitelisted actions, and pass them to the worker
  action$
    .pipe(
      ofType(
        CREATE_QUERY,
        RESUME_QUERY,
        PAUSE_QUERY,
        DELETE_QUERY,
        CANCEL_QUERY
      )
    )
    .subscribe(action => {
      worker.postMessage(JSON.stringify(action));
    });

  //Finally, we start the port and return the observable. The observable is returned
  //because it is the stream of output actions from the worker
  //port.start();
  return observable;
};

export const handleCreateQuery = (state, action) => {
  console.log("CREATE QUERY", action);
  return {
    ...state,
    [action.id]: {
      paused: false,
      done: false,
      detail: "",
      id: action.id,
      name: action.name,
      source: action.source,
      query: action.query
    }
  };
};
export const handleResumeQuery = (state, action) => {
  return { ...state, [action.id]: { ...state[action.id], paused: false } };
};
export const handlePauseQuery = (state, action) => {
  return { ...state, [action.id]: { ...state[action.id], paused: true } };
};
export const handleCancelQuery = (state, action) => {
  console.log("Query cancelled", action);
  const { detail } = action;
  return { ...state, [action.id]: { ...state[action.id], detail, done: true } };
};
export const handleDeleteQuery = (state, action) => {
  const { [action.id]: toRemove, ...newState } = state;
  return newState;
};
export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUERY:
      return handleCreateQuery(state, action);
    case RESUME_QUERY:
      return handleResumeQuery(state, action);
    case PAUSE_QUERY:
      return handlePauseQuery(state, action);
    case CANCEL_QUERY:
      return handleCancelQuery(state, action);
    case DELETE_QUERY:
      return handleDeleteQuery(state, action);
    default:
      return state;
  }
}
