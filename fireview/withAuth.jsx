import React from 'react'
import {operon, adopts} from 'operon'
import {context} from './AuthProvider'

const withAuth = operon('withAuth HOC')
export default withAuth

// As a HOC, adds _user and _auth to the props of its
// wrapped component.
Function [adopts] (withAuth) (
  Wrapped => {
    class HOC extends React.Component {
      get auth() {
        return this.context.auth
      }

      get user() {
        return this.state && this.state.user
      }

      componentDidMount() {
        this.unsubscribe =
          this.auth.onAuthStateChanged(user => this.setState({user}))
      }

      componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
      }

      render() {
        const childProps = {...this.props}
        delete childProps.auth
        return <Wrapped
          _auth={this.auth}
          _user={this.user}
          _authReady={!!this.state}
          {...this.props} />
      }
    }
    HOC.contextTypes = context
    HOC.displayName = `WithAuth(${Wrapped.displayName || Wrapped.name})`
    return HOC
  }
)

// As a Component, withAuth adds _user and _auth
// to all its children.
Object [adopts] (withAuth) (
  withAuth(({children, _auth, _user}) => applyPropsDeep(children, {_auth, _user}))
)

const applyPropsDeep = (children, props) => React.Children.map(children,
  child => React.cloneElement(child, {
    ...props,
    children: applyPropsDeep(child.children, props)
  })
)
