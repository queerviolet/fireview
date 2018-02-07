# Fireview

A quick helper to map data in Firebase to React views. Supports Cloud Firestore.

Requires React 16, since the `<Map>` component renders an array.

## Example

[This very repo](https://github.com/queerviolet/fireview) is an example of how to use
Fireview:
  * [`demo/Firestore.jsx`](./demo/Firestore.jsx) contains views for a Firestore db
  * [`demo/Realtime.jsx`](./demos/Realtime.jsx) contains views for a Realtime db
  * [`fire/index.js`](./fire/index.js) contains models for both

In an ideal world, our views wouldn't care about what DB they're rendering. And, indeed, the views are almost identical. A future version of Fireview will likely change the API to allow them to be entirely identical.

Here's our message component:

```jsx
  // Message.jsx
  // from and body are fields in the database.
  // _ref is the reference we're rendering. We can use this
  // to mutate the database.
  const Message = ({from, body, _ref}) =>
    <li>
      <strong>{from}:</strong> {body}
      <a onClick={() => _ref.set(null)}>⛔️</a>  { /* Delete this message */ }
    </li>
```

We're going to map a collection of messages to it.

Whether you're using Firestore or the legacy Realtime database, `<Map>`
listens to the reference you provide and updates the view when the database changes.

### With Cloud Firestore

```jsx  
  // Messages-Firestore.jsx
  import {Map} from 'fireview'

  export default () => 
    <ul>
      <Map from={
          // In a real app, you'd probably take in this reference
          // as a prop.

          // from accepts any Firestore query.
          firebase.firestore()
            .collection('messages')
        }
        // Loading takes a component that is displayed while
        // the first snapshot is loading.
        Loading={() => 'Loading...'}

        // Render takes a component that renders each document in
        // the returned query
        Render={Message}

        // Empty takes a component displayed if the collection is empty.
        Empty={() => 'No messages here.'}
      />
    </ul>
```

`<Map>` renders your `Render` component once for each Document in the query
you provide it (so if your query references a single Document, you only get
that one.)

### With the Realtime Database

Using the Realtime DB is very similar. One difference is that you need to
give `<Map>` an `each` prop if you want your `Render` component to be mounted
once per each child (rather than once for the entire path).

(This is because the Realtime Database doesn't distinguish between "Documents"
and regular values.)

```jsx
  // Messages-Realtime.jsx 
  import {Map} from 'fireview'

  export default () =>
    <ul>      
      <Map each from={firebase.database().ref('/chatrooms/welcome')}
        // ⬆️ "each" means we'll map over all children of this path
        // Everything else behaves the same.
        Loading={() => 'Loading...'}
        Render={Message}
        Empty={() => 'No messages here.'}
      />
    </ul>
```

## Using AuthProvider

You tend to need information about the currently logged in user in various
places around your app.

`<AuthProvider>` provides auth information.

`withAuth` is a HOC that takes this auth
information and adds a `withAuth` prop to the component it wraps. This prop
has the shape:

```js
{
  // The current user
  user: firebase.auth.User,
  
  // The firebase Auth interface
  auth: firebase.auth.Auth,

  // True once the auth state has resolved (once
  // onAuthStateChanged has emitted at least once).
  ready: bool,
}
```

(Note: the HOC also adds `_user`, `_auth`, and `_authReady` props, but
these are uglier and will be removed in the future. Use the nested
object instead.)

```jsx
import * as firebase from 'firebase'

import {AuthProvider, withAuth} from 'fireview'

export default () =>
  <AuthProvider auth={firebase.auth()}>
    {/* ShowUid is a direct child here, but it doesn't have to be. */}
    <ShowUid />
  </AuthProvider>

const ShowUid = withAuth(
  ({withAuth: {user, auth}}) =>
    user
      ? user.uid
      : <a onClick={() => auth.signInAnonymously()}>
          Sign in
        </a>
)
```
