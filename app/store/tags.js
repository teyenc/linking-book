const initialStore = {
    tags: [],
    exploreTags:[],
    editPostTags:[],
  };

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'TAGS':
      return {
        ... state,
        tags: action.tags,
      };
    case 'EXPLORETAGS':
      return {
        ... state,
        exploreTags: action.exploreTags,
      };
    case 'EDITPOSTTAGS':
      return {
        ... state,
        editPostTags: action.editPostTags,
      }; 
    default:
      return state;
  }
};
