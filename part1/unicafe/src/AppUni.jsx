import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value}) => {
  
  return (
    <table> 
      <tbody>
        <tr>
          <td width="100px">{text}: </td>
          <td width="100px">{value}</td>
       </tr>
      </tbody>
    </table>
  )

}

const Statistics = ({good, neutral, bad}) => {
  
  const total = () => good + neutral + bad

  const average = () => {
    if (total() === 0) {
      return 0
    } else {
      return (good + (-1 * bad)) / total()
    }
  }

  const positive = () => {
    if (total() === 0) {
      return 0
    } else {
      return good/total() * 100 + "%" 
    }
  }

  if (total() === 0) {
    return (
      <div>
        <p>no feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="total" value={total()} />
        <StatisticLine text="average" value={average()} />
        <StatisticLine text="positive" value={positive()} />
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setter = (feedback, adder) => {
    adder(feedback + 1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setter(good, setGood)} text="good" />
      <Button handleClick={() => setter(neutral, setNeutral)} text="neutral" />
      <Button handleClick={() => setter(bad, setBad)} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App