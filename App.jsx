import React from 'react'
import * as firebase from 'firebase'
import 'firebase/firestore'

window.firebase = firebase

firebase.initializeApp({
  apiKey: 'AIzaSyBzz-Wq2dzMgM7E8cdSYnYoX5fbVUT-XQo',
  authDomain: 'firebones-6bc2a.firebaseapp.com',
  databaseURL: 'https://firebones-6bc2a.firebaseio.com',
  projectId: 'firebones-6bc2a',
  storageBucket: 'firebones-6bc2a.appspot.com',
  messagingSenderId: '1030378391678'
})

const db = firebase.firestore()   
const messages = db.collection('messages')

import {Map} from './Map'

const Message = ({from, body, _ref}) =>
  <div>
    <h2>{from}</h2>
    {body}
  </div>

const rt = firebase.database()


window.fire = firebase
export default () =>
  <div>
    <Map from={messages}
      Loading={() => 'Loading...'}
      Render={Message}
      Empty={() => 'No messages here.'}
    />
    <Map each from={rt.ref('/chatrooms/welcome')}
      Loading={() => 'Loading...'}
      Render={Message}
      Empty={() => 'No messages here.'}
    />
  </div>