# Fireview

A quick helper to map data in Firebase to React views. Supports Cloud Firestore.

Requires React 16, since the `<Map>` component renders an array.

## Example

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
