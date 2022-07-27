const initialStore = {
    post_title: "",
    post_content: "",
    post_image: null,
    post_link: "",
    isPrivate:false,
  };

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'POST':
      return {
        post_title: action.post_title,
        post_content: action.post_content,
        post_image: action.post_image,
        post_link: action.post_link,
        isPrivate: action.isPrivate,
      }; 
    case 'postTitle':
      return {
        ...state, 
        post_title: action.post_title,
      }; 
    case 'postContent':
      return {
        ...state, 
        post_content: action.post_content,
      }; 
    case 'postLink':
      return {
        ...state, 
        post_link: action.post_link,
      }; 
    case 'postImage':
      return {
        ...state, 
        post_image: action.post_image,
      }; 
    case 'postPrivacy':
      return {
        ...state, 
        isPrivate: action.isPrivate,
      }; 
    default:
      return state;
  }
};
  