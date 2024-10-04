import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deleting = (id) => {
  const address = `${baseUrl}/${id}`
  const request = axios.delete(address)
}

const change = (person) => {
  const address = `${baseUrl}/${person.id}`
  const request = axios.put(address, person)
  return request.then(response => response.data)
}

export default { getAll, create, deleting, change }