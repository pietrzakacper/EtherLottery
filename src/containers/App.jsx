import React, {Component} from 'react'

import {connect} from 'react-redux'
import {web3Requested} from '../actionCreators'
import {mapDispatchToProps} from '../utils/reduxUtils'

import Toolbar from '../components/Toolbar'
import Lottery from './Lottery'

import {withStyles} from 'material-ui/styles'

import compose from 'lodash.compose'

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh'
  }
})

class App extends Component {
  componentDidMount() {
    this.props.actions.web3Requested()    
  }

  render() {
    const {web3, classes} = this.props

    return (
      <div>
          <Toolbar web3Loaded={!!web3}/>
          <div className={classes.container}>
          { !!web3 && <Lottery/> }
          </div>
      </div>
    )
  }
}

export default compose(
  connect(
    _ => ({
      web3: _.get('web3')
    }),
    mapDispatchToProps({web3Requested})
  ),
  withStyles(styles)
)(App)
