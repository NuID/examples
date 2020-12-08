import * as R from 'ramda'

const url = path => `${process.env.REACT_APP_API_HOST}${path}`

export const post = (path, data, opts = {}) =>
  fetch(
    url(path),
    R.merge(
      {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(data)
      },
      opts
    )
  ).then(res => res.json())
