import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?`

const get = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getWeather = (country, api) => {
  const url = `${apiUrl}lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api}`
  const request = axios.get(url)
  return request.then(response => response.data)
}

export default {get, getWeather}