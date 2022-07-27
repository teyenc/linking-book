import useAPI from './api';
import { BACKEND } from '../config/config';
import { getToken } from './functions';
import { useDispatch } from 'react-redux';

export const useGetCollection =  (userId) => {
  const [connection, connect] = useAPI(BACKEND+"/collection/profile/" + userId, 'json');

  const getCollection = () => {
    getToken("accessToken").then(t => {
      connect('GET',
      {},
      {'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t,});
    }) 
  };
  // console.log(connection)
  return [connection, getCollection];
};


export const useSavePost =  () => {
  const [connection, connect] = useAPI(BACKEND+"/collection_post", 'json');

  const save = (postId, collectionId) => {
    // console.log(postId, collectionId)
    getToken("accessToken").then(t => {
      connect('POST',
      JSON.stringify({
        "postId": postId,
        "collectionId": collectionId
      }),
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t,
      });
    }) 
  };
  // console.log(connection)
  return [connection, save];
};

export const useSaveNew =  () => {
  const [connection, connect] = useAPI(BACKEND+"/collection_post/save_new", 'json');

  const saveInNew = (collectionName, postId, isPrivate) => {
    // console.log(postId, collectionId)
    getToken("accessToken").then(t => {
      connect('POST',
      JSON.stringify({
        name: collectionName,
        postId: postId,
        isPrivate: isPrivate
      }),
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t,
      });
    }) 
  };
  // const LocalCollection = useSelector(state=> state.collections.collection)

  // if (connection.response){
  //   getData("collections").then(r => {
  //     dispatch(refreshCollection(LocalCollection))
  //     connection.response = null
  //   })
  // }

  return [connection, saveInNew];
};


export const useGetPost = (postId) => {
  const [connection, connect] = useAPI(BACKEND + "/post/" + postId, 'json');

  const getPost = () => {
    // console.log(postId, collectionId)
    getToken("accessToken").then(t => {
      connect('GET',
      {},
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t,
      });
    }) 
  };
  // console.log(connection)
  return [connection, getPost];
};

export const useDltPost =  (postId) => {
  const [connection, connect] = useAPI(BACKEND + "/post/" + postId, 'json');

  const dltPost = () => {
    // console.log(postId, collectionId)
    getToken("accessToken").then(t => {
      connect('DELETE',
      {},
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + t,
      });
    }) 
  };
  // console.log(connection)
  return [connection, dltPost];
};