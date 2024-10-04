import { useState, useEffect } from 'react'
import countryService from './services/countryService'
import SearchResults from './components/searchResults'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [country, setCountry] = useState(null)
  const [weatherData, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  const hook = () => {
    countryService
      .get()
      .then(countryList => {
        setCountries(countryList)
        setResults(countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())))
      })
  }

  const weatherHook = () => {
    if (country) {
      console.log("here")
      countryService
        .getWeather(country, api_key)
        .then(weather => {
          console.log('weather', weather)
          setWeather(weather)
          console.log('weatherData', weatherData)
        })
    }
  }

  useEffect(hook, [search])
  useEffect(weatherHook, [country])

  const handleChange = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
    if (results.length === 1) {
      console.log("country changed")
      setCountry(results[0])
    }
  }

  const handleShowing = (country) => {
    console.log("country changed")
    setSearch(country.name.common)
    setCountry(country.name.common)
  }

  if (country) {
  console.log('countryHERE', country.name.common)
  console.log('weathreHERE',weatherData)
  }

  //console.log(results.length)
/*    console.log(results.length)
    if (results.length === 1) {
      console.log("country changed")
      setCountry(results[0])
    }*/ 

  return (
    <div>
      <h1>Find countries</h1>
      <form>
        Search:  
        <input value={search} onChange={handleChange} />
      </form>
        <SearchResults list={results} show={handleShowing} weather={weatherData} />
    </div>
  )
  
}

export default App