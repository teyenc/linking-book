const initialStore = {
  token: "",
  token_refresh: "",
  name: "",
  email: "",
  id: "",
  phone_number: "",
  job:"",
  education:"",
  description:"",
  avatar:"",
  title: "",
  birthDate:"",
  gender:"",
};

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'LOGIN':
      return {
        token_refresh: action.token_refresh,
        token: action.token,
        name: action.name,
        email: action.email,
        id: action.id,
        phone_number: action.phone_number,
        job:action.job,
        education: action.education,
        description: action.description,
        avatar: action.avatar,
        title: action.title,
        birthDate: action.birthDate,
        gender: action.gender,
      };
    case 'REFRESH':
    return {
      token_refresh: action.token_refresh,
      token: action.token,
      name: action.name,
      email: action.email,
      id: action.id,
      phone_number: action.phone_number,
      job:action.job,
      education: action.education,
      description: action.description, 
      avatar: action.avatar,
      title: action.title,
      birthDate: action.birthDate,
      gender: action.gender,
    };
    case 'PROFILE':
    return {
      token: action.token,
      name: action.name,
      job:action.job,
      education: action.education,
      description: action.description,
      avatar: action.avatar,
      title: action.title,
    };
    case 'SIGNUP':
      return {
        token: action.token,
        token_refresh: action.token_refresh,
        name: action.name,
        email: action.email,
        id: action.id,
        phone_number: action.phone_number,
        avatar: action.avatar,
      };
    case 'renewAvatar':
      return {
        ...state, 
        avatar: action.avatar,
      };
    case 'psnlInfo':
      return {
        ...state, 
        birthDate: action.birthDate,
        gender: action.gender,
      };
    case 'signupAddedInfo':
      return {
        ...state, 
        avatar: action.avatar,
        title: action.title,
      };
    case 'LOGOUT':
      return {};
    case 'REFRESH_TOKEN':
      return {
        token: action.token,
        token_refresh: action.token_refresh,
      };
    default:
      return state;
  }
};
