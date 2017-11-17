import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import {
  auth,
  signInAnonymously,
  signInWithGoogle,
  firestoreRoomById,
  realtimeRoomById} from '~/fire'

import {AuthProvider} from '~/fireview'

import FirestoreChat from '~/demo/Firestore'
import RealtimeChat from '~/demo/Realtime'

export default () =>
  <AuthProvider auth={auth}>
    <nav>
      <button onClick={signInAnonymously}>Sign in Anonymously</button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </nav>,
    <Router>
      <main>
        <Route path="/firestore/:id" component={
          ({match: {params: {id}}}) =>
            <FirestoreChat room={firestoreRoomById(id)} />
        } />
        <Route path="/realtime/:id" component={
          ({match: {params: {id}}}) =>
            <RealtimeChat room={realtimeRoomById(id)} />
        } />
      </main>
    </Router>
  </AuthProvider>
