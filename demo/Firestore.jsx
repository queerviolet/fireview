import React from 'react'
import {
  firestoreUserById as userById,
  firestoreMessagesForRoom as messagesForRoom,
  firestoreAddMessage as addMessage,
} from '~/fire'

import {withAuth} from '~/fireview'

import {Map} from '~/fireview'

export default ({room}) => {
  const messages = messagesForRoom(room)
  return <div>
    <ChatLog messages={messages} />
    <ChatEntry messages={messages} />
  </div>
}

const ChatLog = ({messages}) =>
  <Map from={messages.orderBy('timestamp')}
    Loading={() => 'Loading messages...'}
    Render={Message}
    Empty={() => 'No messages here.'}
  />

const User = ({id}) =>
  <Map from={userById(id)} Render={({displayName}) => displayName || ''} />

const Message = ({from, body, _ref, _user}) =>
  <div>
    <User id={from} />: {body}
  </div>

const ChatEntry = withAuth(
  ({messages, withAuth: {user}}) =>
    user
      ? <form onSubmit={submitMessage(messages, user)}>
          <Map from={userById(user.uid)} Empty={() => 'What?'} Render={DisplayNameEntry} />
          {user && user.id}
          <input name="body" />
          <input type="submit" />
        </form>
      : 'Sign in to say something.'
)

const submitMessage = (messages, user) => evt => {
  evt.preventDefault()
  addMessage(messages, {from: user.uid, body: evt.target.body.value})
  evt.target.body.value = ''
}

const DisplayNameEntry = ({_ref, displayName}) =>
<input defaultValue={displayName}
  onChange={setDisplayName(_ref)} />

const setDisplayName = ref => evt =>
  ref.set({displayName: evt.target.value}, {merge: true})
