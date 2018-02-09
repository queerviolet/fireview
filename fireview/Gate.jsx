import React from 'react'
import withAuth from './withAuth'
import maybe from './maybe'
import withProps from './withProps'

const beLoggedIn = user => !!user

class Gate extends React.Component {
  get login() {
    const {props: {Login}, childProps} = this
    return maybe(Login) [withProps] (childProps)
  }

  get loading() {
    const {props: {Loading}, childProps} = this
    return maybe(Loading) [withProps] (childProps)
  }

  get childProps() {
    return {
      withAuth: this.props.withAuth
    }
  }

  render() {    
    const {
      // withAuth contains {ready, user, auth}, as provided
      // by the withAuth HOC
      withAuth,
      
      // Must is the gating function. By default, the Gate requires
      // that someone is logged in.
      must=beLoggedIn
    } = this.props

    // Show loading while auth isn't ready.
    if (!withAuth.ready) return this.loading
    
    // If the currently logged in user fails the check,
    // return the login page.
    if (!this.props.must(withAuth.user)) return this.login
    
    // Otherwise, show our children.
    return this.props.children
  }
}

export default withAuth(Gate)
