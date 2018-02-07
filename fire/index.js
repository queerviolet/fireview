'use strict'

import * as firebase from 'firebase'
import 'firebase/firestore'

import config from './config'
import {firestore} from 'firebase'

firebase.initializeApp(config)

export default firebase
export const db = firebase.firestore()
export const rt = firebase.database()
export const auth = firebase.auth()

/*
 * In this example, we're setting up parallel models for Firestore and
 * the realtime DB. You'll probably just use one in your project, but this demo
 * demonstrates both. 
 */

////---- Firestore models ----////
export const firestoreRoomById = id => db.collection('rooms').doc(id)
export const firestoreMessagesForRoom = room => room.collection('messages')
export const firestoreAddMessage = (messages, {from, body}) =>
  messages.add({
    from, body,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })
export const firestoreUserById = id => db.collection('users').doc(id)

////---- Realtime DB models ----////
export const realtimeRoomById = id => rt.ref('rooms').child(id)
export const realtimeMessagesForRoom = room => room.child('messages')
export const realtimeAddMessage = (messages, {from, body}) =>
  messages.push({
    from, body,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  })
export const realtimeUserById = id => rt.ref('users').child(id)

////---- Auth ----////
export const signInAnonymously = () => auth.signInAnonymously()

const google = new firebase.auth.GoogleAuthProvider
export const signInWithGoogle = () => auth.signInWithPopup(google)

// Whenever someone signs in or out, run initUser with their user object.
auth.onAuthStateChanged(initUser)

function initUser(user) {
  console.log('User logged in:', user)

  if (!user) {
    // Nobody is logged in, so just bail.
    // You could also automatically log someone in, by
    // calling signInAnonymously here:
    // signInAnonymously()    
    return
  }

  const displayName = user.displayName || 'Anonymous'

  // Set the user data in firestore.
  firestoreUserById(user.uid).set({displayName}, {merge: true})

  // Set the user data in the realtime DB.
  realtimeUserById(user.uid).update({displayName})

  // (In a real app, you'd just need to do one of these.)
}