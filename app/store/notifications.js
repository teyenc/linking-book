const initialStore = {
  msgType: "",
  postId:"",
  userId:"",
};

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'background':
      return {
        ...state,
        msgType: action.msgType,
        postId: action.postId,
        userId:action.userId
      };
    case 'STATUS':
    return {
      status: action.status
    };
    default:
      return state;
  }
};
