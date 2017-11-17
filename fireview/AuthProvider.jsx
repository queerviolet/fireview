import React from 'react'
import Types from 'prop-types'

export default class AuthProvider extends React.Component {
  getChildContext() {
    return {auth: this.props.auth}
  }

  render() {
    return this.props.children
  }
}

export const context = {
  auth: Types.object
}

AuthProvider.childContextTypes = context