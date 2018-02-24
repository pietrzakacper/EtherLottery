import React, {Component} from 'react'

import {connect} from 'react-redux'
import {ethRequested} from '../actionCreators'
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
    this.props.actions.ethRequested()    
  }

  render() {
    const {eth, classes} = this.props

    return (
      <div>
          <Toolbar ethLoaded={!!eth}/>
          <div className={classes.container}>
          { !!eth && <Lottery/> }
          </div>
      </div>
    )
  }
}

export default compose(
  connect(
    _ => ({
      eth: _.get('eth')
    }),
    mapDispatchToProps({ethRequested})
  ),
  withStyles(styles)
)(App)
