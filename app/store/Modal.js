const initialStore = {
        ModalState:false,
        TagModalState:false,
        exploreTagState:false,
        EditPostModalState:false,
};

export default (state = initialStore, action) => {
        switch ( action.type ) {
                case 'ColtModal':
                        return { ...state, ModalState: action.ModalState };
                case 'TagModal':
                        return { ...state ,TagModalState: action.TagModalState };
                case 'exploreTagState':
                        return { ...state ,exploreTagState: action.exploreTagState };                        
                case 'EditPostModalState':
                        return { ...state ,EditPostModalState: action.EditPostModalState };
                default:  
                return state;
                
        }
};
