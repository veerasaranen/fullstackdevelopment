const Course = ({courses}) => {
    return (
    courses.map( course => 
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((sum, part) => sum  + part.exercises, 0)} />
      </div>
    ))
  }

  const Header = ({ course }) => <h1>{course}</h1>

  const Total = ({ sum }) => <b>Total of {sum} exercises </b>

  const Content = ({ parts }) => 
    <>
      {parts.map(part => 
        <Part key={part.id}
          part={part} 
        />  
      )}
    </>

  const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>
  

export default Course 