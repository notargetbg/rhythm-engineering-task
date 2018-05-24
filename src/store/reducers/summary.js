const DEFAULT_STATE = {
    data: null
};

const summary = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'ADD_SUMMARY_DATA':
            return {
                data: action.payload
            };

        case 'CLEAR_SUMMARY_DATA':
            return {
                data: null
            };

        default:
            return state;
    }
};
export default summary;