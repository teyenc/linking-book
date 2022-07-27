import {useReducer} from 'react';
import { BACKEND } from '../config/config';
import { getNew, getToken, storeToken } from './functions';

const initialState = ({
  status: NaN,
  resopnse: null,
  errMsg: null,
  loading: false,
  success: false,
  error: false, 
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      return {...state, loading: true};
    case 'SUCCESS':
      return ({
        status: action.status || 200,
        response: action.response,
        errMsg: null,
        loading: false,
        success: true,
        error: false,
      });
    case 'ERROR':
      return ({
        status: action.status || 400,
        response: null,
        errMsg: action.errMsg || '',
        loading: false,
        success: false,
        error: true,
      });
    default:
      throw new Error('Invalid Action Type');
  }
};

export default (url, responseType) => {
  const [conn, dispatch] = useReducer(reducer, initialState);
  const connect = async (method, body, headers) => {
    dispatch({type: 'CONNECT'});
    let data;
    if (method == "GET") data = {method, headers}
    else data = {method, body, headers}
    fetch(url, data).then((res) => {
      // console.log("B_B")
      // console.log(url)
      // console.log(res.status)
      // console.log("B_B")
      // res.json().then(r => console.log(r))
      if (res.status === 403 ) { 
        getToken("refreshToken").then( refresh_token => {
          fetch(BACKEND + '/user/refresh-token', getNew(refresh_token))
          .then( t => {
            t.json().then( t => {
              storeToken("accessToken", t.accessToken)
              data.headers.Authorization = 'Bearer ' + t.accessToken
              fetch(url, data).then((r) => {
                // console.log(r.status)
                if (r.status !== 200 && r.status !== 201) {
                  r.text().then((errMsg) => {
                    dispatch({
                      type: 'ERROR',
                      status: r.status,
                      errMsg,
                    });
                  });
                } 
                else {
                  let thenable = null;
                  switch (responseType) {
                    case 'json':
                      thenable = r.json();
                      break;
                    case 'text':
                      thenable = r.text();
                      break;
                    default:
                      return dispatch({type: 'SUCCESS'});
                  }
                  thenable.then((data) => {
                    dispatch({
                      type: 'SUCCESS',
                      response: data,
                    });
                  }).catch((err) => {
                    console.error(err);
                    dispatch({
                      type: 'ERROR',
                      errMsg: 'Response type Error',
                    });
                  });
                }
              })
            })
          })
        })
      }
      // console.log(res.status)
      else if (res.status !== 200 && res.status !== 201) {
        res.text().then((errMsg) => {
          dispatch({
            type: 'ERROR',
            status: res.status,
            errMsg,
          });
        });
      } 
      else {
        let thenable = null;
        switch (responseType) {
          case 'json':
            thenable = res.json();
            break;
          case 'text':
            thenable = res.text();
            break;
          default:
            return dispatch({type: 'SUCCESS'});
        }
        thenable.then((data) => {
          // console.log(data)
          dispatch({
            type: 'SUCCESS',
            response: data,
          });
        }).catch((err) => {
          console.error(err);
          dispatch({
            type: 'ERROR',
            errMsg: 'Response type Error',
          });
        });
      }
    }).catch((err) => {
      console.error(err);
      dispatch({
        type: 'ERROR',
        errMsg: 'Connection Error',
      });
    });
  };
  return [conn, connect];
};


