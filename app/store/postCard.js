const initialStore = {
    like_post:[] ,
    deleted: []
  };

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'like_post':
      return {
        ...state,
        like_post: action.like_post,
      };
    case 'deleted':
      return {
        ...state,
        deleted: action.deleted,
      };
    default:
      return state;
  }
};
