const SearchResults = ({list, show, weather}) => {
  if (list.length === 1) {
    const country = list[0]
    console.log('WEATHER', weather)

    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} </p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map( language => 
            <li key={`${language}${country.ccn3}`}>{language}</li>
          )}
        </ul>
        <img src={`${country.flags.png}`} alt={country.flags.alt}></img>
        <h3> Weather in {country.capital} </h3>
      </div>
    )
  } else if (list.length <= 9 && list.length > 0) {
    return (
      <ul>
        {list.map(country => 
          <div key={country.ccn3}>
            <li> {country.name.common} </li>
            <button onClick={() => show(country)}>Show</button>
          </div>
        )}
      </ul>
    )
  } else {
    return (
      <p> Too many matches. Type more. </p>
    )
  }
}
/*
{console.log('weatherHere', weatherNow.main.temp)}
        <p> Temperature: {weatherNow.main.temp} </p>
*/

export default SearchResults