import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleVotes = () => {
    const copiedVotes = [...votes]
    copiedVotes[selected] += 1
    setVotes(copiedVotes)
  }

  //the code allows for the same anecdote to be generated
  const handleSelected = () => {
    setSelected(Math.floor(Math.random() * (anecdotes.length)));
  }

  const text = () => {
    if (votes[selected] === 1) {
      return "vote"
    } else {
      return "votes"
    }
  }

  //if the anecdotes have the same amount of votes then 
  // one is randomly shown.

  const mostVotes = () => {
    let max = 0
    let maxIndex = 0
    for (let i = 0; i < votes.length; i++) {
      if (max < votes[i]) {
        max = votes[i]
        maxIndex = i
      }
    }
    if (max === 0) {
      return "No votes yet. Vote for your favorite." 
    } else {
      return anecdotes[maxIndex]
    }
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} {text()}</p>
      <button onClick={() => handleSelected()}>generate an anecdote</button>
      <button onClick={() => handleVotes()}>vote</button>
      <h2>Anecdote with the most votes</h2>
      <p>{mostVotes()}</p>
    </div>
  )
}

export default App
