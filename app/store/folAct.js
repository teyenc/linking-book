const initialStore = {
  folAct:[],
  blockId:[],
};

export default (state = initialStore, action) => {
  switch ( action.type ) {
    case 'FOLACT':
      return {
        ...state,
        folAct: action.folAct
      };
    case 'block':
      return {
        ...state,
        blockId: action.blockId
      }; 
    default:
      return state;
  }
};
