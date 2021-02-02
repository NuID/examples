const url = path => `${process.env.REACT_APP_API_HOST}${path}`

export const post = (path, data, status = 200) => {
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  }
  return fetch(url(path), opts).then(res => {
    return res.status === status
      ? res.json()
      : Promise.reject({ message: `Unexpected status ${res.status}`, res: res })
  })
}
