import {bindActionCreators} from 'redux'

export const mapDispatchToProps = actions => dispatch => ({
    actions: bindActionCreators(actions, dispatch)   
})