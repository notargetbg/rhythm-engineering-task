const DEFAULT_STATE = {
    data: null
};

const summary = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'ADD_SUMMARY_DATA':
            return {
                data: action.payload
            };

        default:
            return state;
    }
};
export default summary;