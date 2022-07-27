export const login = ( token_refresh, token, name, email, id, phone_number, job, education, description, avatar,title, birthDate, gender) => (
  {
    type: 'LOGIN',
    token_refresh,
    token,
    name,
    email,
    id,
    phone_number,
    job,
    education,
    description,
    avatar,
    title,
    birthDate,
    gender,
  } 
);

export const signup = ( token, token_refresh, name, email, id, phone_number, avatar) => (
  {
    type: 'SIGNUP',
    token,
    token_refresh,
    name,
    email,
    id,
    phone_number,
    avatar,
  }
);

export const signupAddedInfo = ( avatar, title) => (
  {
    type: 'signupAddedInfo',
    avatar,
    title
  }
);

export const refresh = (token, token_refresh, name, email, id, phone_number, job, education, description, avatar, title, birthDate, gender) => (
  {
    type: 'REFRESH',
    token,
    token_refresh,
    name,
    email,
    id,
    phone_number, 
    job,
    education,
    description, 
    avatar,
    title,
    birthDate,
    gender,
  }
);

export const renewAvatar = (avatar) => (
  {
    type: 'renewAvatar',
    avatar,
  }
);

export const psnlInfo = (birthDate, gender) => (
  {
    type: 'psnlInfo',
    birthDate,
    gender
  }
);

export const post = ( post_title, post_content, post_image, post_link, isPrivate) => (
  {
    type: 'POST',
    post_title,
    post_content,
    post_image,
    post_link,
    isPrivate
  }
);

export const postTitle = (post_title) => ( 
  {
    type: 'postTitle',
    post_title,
  }
);

export const postContent = (post_content) => ( 
  {
    type: 'postContent',
    post_content,
  }
);

export const postLink = (post_link) => ( 
  {
    type: 'postLink',
    post_link,
  }
);

export const postImage = (post_image) => ( 
  {
    type: 'postImage',
    post_image,
  }
);

export const postPrivacy = (isPrivate) => ( 
  {
    type: 'postPrivacy',
    isPrivate,
  }
);

// tags
export const dispatchtags = (tags) => ( 
  {
    type: 'TAGS',
    tags,
  }
);

export const exploreTags = (exploreTags) => ( 
  {
    type: 'EXPLORETAGS',
    exploreTags,
  }
);

export const editPostTags = (editPostTags) => ( 
  {
    type: 'EDITPOSTTAGS',
    editPostTags,
  }
);

export const ColtModal = (ModalState) => ( 
  {
    type: 'ColtModal',
    ModalState,
  }
);

export const tagModalState = (TagModalState) => ( 
  {
    type: 'TagModal',
    TagModalState,
  }
);

export const exploreTagState = (exploreTagState) => ( 
  {
    type: 'exploreTagState',
    exploreTagState,
  }
);

export const EditPostModalState = (EditPostModalState) => ( 
  {
    type: 'EditPostModalState',
    EditPostModalState,
  }
);

export const like_post = (like_post) => (
  {
    type: 'like_post',
    like_post
  }
);

export const deleted = (deleted) => (
  {
    type: 'deleted',
    deleted
  }
);

export const refreshCollection = (collection) => ( 
  {
    type: 'COLLECTION',
    collection,
  }
);

export const bgNtfc = ( msgType, postId, userId) => (
  {
    type :'background',
    msgType,
    postId,
    userId
  }
)

export const setFolAct = (folAct) => ( 
  {
    type: 'FOLACT',
    folAct,
  }
);

export const setBlock = (blockId) => ( 
  {
    type: 'block',
    blockId,
  }
);



export const logout = () => ({type: 'LOGOUT'});
