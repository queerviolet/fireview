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

      get ready() {
        return !!this.state
      }

      componentDidMount() {
        this.unsubscribe =
          this.auth.onAuthStateChanged(user => this.setState({user}))
      }

      componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
      }

      render() {
        const {auth, user, ready} = this
            , withAuth = {auth, user, ready}
        return <Wrapped
          withAuth={withAuth}
          _auth={auth}
          _user={user}
          _authReady={ready}
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
  withAuth(({children, withAuth}) => applyPropsDeep(children, withAuth))
)

const applyPropsDeep = (children, props) => React.Children.map(children,
  child => React.cloneElement(child, {
    ...props,
    children: applyPropsDeep(child.children, props)
  })
)
