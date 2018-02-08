import React, {Component} from 'react'

import {connect} from 'react-redux'
import {web3Requested} from '../actions'

import Toolbar from '../components/Toolbar'

class App extends Component {
  componentDidMount() {
    this.props.requestWeb3()    
  }

  render() {
    return (
      <div>
          <Toolbar/>
          {this.props.web3 ? 'web3 injected' : 'please wait...'}
      </div>
    )
  }
}

export default connect(
  _ => ({
    web3: _.web3
  }),
  dispatch => ({requestWeb3: ()=>dispatch(web3Requested())}) 
)(App)
