export const None = {}

export default value =>
  value === null || typeof value === 'undefined'
    ? None
    : value

