import operon from 'operon'

/**
 * The withProps op takes a React Component or renderable and applies props to it,
 * returning a React renderable (that is, something which can be returned
 * from `render`).
 */
const withProps = operon('withProps(Component|ReactRenderable, props) -> ReactElement (with props)')
export default withProps

// None becomes null under withProps (renders nothing).
import {None} from './maybe'
None [withProps] = () => null

// Objects which are React elements get cloned with additional props.
Object [adopts] (withProps) (
  (obj, props) => React.isValidElement(obj)
    ? React.cloneElement(obj, props)
    : null
)

// Arrays apply withProps to each of their children
Array [adopts] (withProps) (
  (ary, props) => ary.map(_ => withProps(_, props))
)

// Strings don't change when you apply props to them.
String [adopts] (withProps) (_ => _)

// We assume that functions are React components, and
// turn them into React elements with the provided props.
Function [adopts] (withProps) (
  (F, props) => <F {...props} />
)
