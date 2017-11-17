import React from 'react'
import {operon, adopts} from 'operon'

import * as firebase from 'firebase'
import 'firebase/firestore'

// Selection interface
const
    // Map over selection. Will return another selection. If this
    // is a multiple selection, you'll get a multiple selection back.
    map = operon('map(Snapshot<I>, I->O) -> Selection<O>')

    // Explicitly map over a snapshot's children
    , mapEachChild = operon('map(Snapshot<I>, I->O) -> Selection<O>')
    , isEmpty = operon('Snapshot is empty?')

    // Get data from a snapshot
    , key = operon('key(Snapshot<T>) -> String')
    , value = operon('value(Snapshot<T>) -> T')    

    // Listen to a selection
    , listen = operon('listen(ref: Selection<I>, onSnapshot: Snapshot<I> -> ()) -> unsubscribe()')

const {firestore, database: realtime} = firebase

//// Cloud Firestore
firestore.Query [adopts] (listen) (
  (query, onSnapshot) => query.onSnapshot(onSnapshot)
)

firestore.DocumentReference [adopts] (listen) (
  (doc, onSnapshot) => doc.onSnapshot(onSnapshot)
)

firestore.QuerySnapshot [adopts] (map) (
  ({docs}, mapper) => docs.map(mapper)
)

firestore.QuerySnapshot [adopts] (isEmpty) (
  ({empty}) => empty
)

firestore.QuerySnapshot [adopts] (value) (_ => _.data())

firestore.QuerySnapshot.prototype [mapEachChild] =
  firestore.QuerySnapshot.prototype [map]

firestore.DocumentSnapshot [adopts] (map) (
  (_, mapper) => mapper(_)
)

firestore.DocumentSnapshot [adopts] (isEmpty) (
  ({exists}) => !exists
)

firestore.DocumentSnapshot [adopts] (key) (_ => _.id)
firestore.DocumentSnapshot [adopts] (value) (_ => _.data())

firestore.DocumentSnapshot.prototype [mapEachChild] =
  firestore.DocumentSnapshot.prototype [map]

//// Realtime DB
realtime.Query [adopts] (listen) (
  (query, onSnapshot) => {
    const wrapped = RealtimeSnapshot.wrap(onSnapshot)
    query.on('value', wrapped)
    return () => query.off('value', wrapped)
  }
)

// The RealtimeDB doesn't expose DataSnapshot, which is unfortunate.
class RealtimeSnapshot {
  static wrap(onSnapshot) {
    return snap => onSnapshot(new RealtimeSnapshot(snap))
  }

  constructor(snapshot) {
    this.snapshot = snapshot
  }

  [isEmpty]() {
    return !this.snapshot.exists()
  }

  [map](mapper) {
    return mapper(this)
  }

  [key]() {
    return this.snapshot.key
  }

  get ref() {
    return this.snapshot.ref
  }

  [mapEachChild](mapper) {
    const {snapshot} = this
    const out = new Array(snapshot.numChildren())
    let i = 0
    snapshot.forEach(childSnap => {
      out[i++] = mapper(new RealtimeSnapshot(childSnap))
    })
    return out
  }

  [value]() {
    return this.snapshot.val()
  }
}

const withProps = operon('withProps(Component|ReactElement, props) -> ReactElement (with props)')
Object [adopts] (withProps) (
  (obj, props) => React.isValidElement(obj)
    ? React.cloneElement(obj, props)
    : null
)

Function [adopts] (withProps) (
  (F, props) => <F {...props} />
)

const None = {
  [withProps]() { return null }
}

const Maybe = value =>
  value === null || typeof value === 'undefined'
    ? None
    : value

export default class Map extends React.Component {
  state = {snapshot: null}

  componentDidMount() {
    this.listen(this.props)
    this.listenAuth(this.props)
  }

  componentWillReceiveProps(next) {
    const {from, auth} = this.props
    if (next.from !== from) this.listen(next)
    if (next.auth !== auth) this.listenAuth(next)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
    this.unsubscribeAuth && this.unsubscribeAuth()
  }

  listen({from}) {
    if (this.unsubscribe) this.unsubscribe()
    if (!from) return // No ref to listen to
    this.unsubscribe =
      from [listen] (snapshot => this.setState({snapshot}))
  }

  listenAuth({auth}) {
    if (this.unsubscribeAuth) this.unsubscribeAuth()
    if (!auth) return // No auth to listen to
    this.unsubscribeAuth =
      auth.onAuthStateChanged(user => this.setState({user}))
  }

  render() {
    const {from,
           each, // For the realtime DB, explicilty iterate over children
           children,
           auth,
           Render,
           Loading,
           Empty} = this.props
        , {snapshot, user} = this.state

    const mapOp = each
      ? mapEachChild
      : map
    
    if (!from)
      return Maybe(Render) [withProps] ({
        _user: user,
        _auth: auth,
        children
      })

    if (!snapshot)
      return Maybe(Loading) [withProps] ({
          _ref: from,
          _auth: auth,
          _user: user,
          children
      })
    
    if (snapshot[isEmpty]())
      return Maybe(Empty) [withProps] ({
        _snap: snapshot,
        _auth: auth,
        _user: user,
        children
      })

    if (!Render) return null
    return snapshot [mapOp] (_ =>
      Render [withProps] ({
        key: _[key](),
        _user: user,
        _auth: auth,
        _ref: _.ref,
        _snap: _,
        ..._[value](),
        children
      })
    )
  }
}
