const initialStore = {
  collection:""
};

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'COLLECTION':
      return {
        collection: action.collection
      };
    default:
      return state;
  }
};
