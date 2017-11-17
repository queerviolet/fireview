import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader';

import * as firebase from 'firebase'
import 'firebase/firestore'

// For debugging
window.firebase = firebase

import App from '~/App'

function main() {
  render(
    <AppContainer><App/></AppContainer>,
    document.getElementById('main'))
}

main()

module.hot && module.hot.accept('~/App', main)
