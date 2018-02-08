const reducer = (state = {}, action) => {
    switch(action.type) {
        case 'WEB3_REQUESTED':
            return {}
        case 'WEB3_INJECTED':
            return {web3: action.web3}
        default: 
            return {}
    }
}

export default reducer