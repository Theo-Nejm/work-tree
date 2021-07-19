import React, { useState } from 'react';
import { Container, SearchWrapper, ResultsWrapper, SearchField, TaskWrapper } from './styled';
import { AiOutlineClockCircle } from 'react-icons/ai';

function formatDate(date){
  const splittedDate = date.split('-'), orderedDate = splittedDate.reverse()
  return orderedDate.join('/');
}

function Target() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='white'><path d="M6 12c0 2.206 1.794 4 4 4 1.761 0 3.242-1.151 3.775-2.734l2.224-1.291.001.025c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c1.084 0 2.098.292 2.975.794l-2.21 1.283c-.248-.048-.503-.077-.765-.077-2.206 0-4 1.794-4 4zm4-2c-1.105 0-2 .896-2 2s.895 2 2 2 2-.896 2-2l-.002-.015 3.36-1.95c.976-.565 2.704-.336 3.711.159l4.931-2.863-3.158-1.569.169-3.632-4.945 2.87c-.07 1.121-.734 2.736-1.705 3.301l-3.383 1.964c-.29-.163-.621-.265-.978-.265zm7.995 1.911l.005.089c0 4.411-3.589 8-8 8s-8-3.589-8-8 3.589-8 8-8c1.475 0 2.853.408 4.041 1.107.334-.586.428-1.544.146-2.18-1.275-.589-2.69-.927-4.187-.927-5.523 0-10 4.477-10 10s4.477 10 10 10c5.233 0 9.521-4.021 9.957-9.142-.301-.483-1.066-1.061-1.962-.947z"/></svg>
}

function TaskLi(props) {
  return (
    <TaskWrapper>
      <h4>{props.task.content}</h4>

      {props.task.date ?
      <div className="date-display">
        <AiOutlineClockCircle />
        {formatDate(props.task.date)}
      </div>
      : null
      }
    </TaskWrapper>
  )
}

function Search(props) {
  const [search, setSearch] = useState('')
  let [isSearch] = useState(false)

  if(!search) {
    isSearch = false;
  } else {
    isSearch = true;
  }

  const tasksObjArr = []
  const tasks = props.tasks
  const tasksArr = Object.keys(tasks)
  const contentsArr = []
  tasksArr.forEach(task => {
    tasksObjArr.push(tasks[task])
    contentsArr.push(tasks[task].content)
  })

  const filteredTasks = contentsArr.filter(task => task.toLowerCase().includes(search.toLowerCase()))
  const filteredObjs = []

  filteredTasks.forEach(content => {
    tasksArr.forEach(task => {
      if(tasks[task].content === content) {
        filteredObjs.push(tasks[task])
      }
    })
  })

  return (
    <SearchWrapper  className='search-field'>
      <SearchField>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg>
      <input
        type="text"
        placeholder='Busque: '
        value={search}
        onChange={ev => setSearch(ev.target.value)}
      />
    </SearchField>

    <ResultsWrapper>
        {
          isSearch
          ? filteredObjs.map(filteredObj => <TaskLi
            task={filteredObj}
          >
            {filteredObj.content}
          </TaskLi>)
          : null
        }
    </ResultsWrapper>
    </SearchWrapper>
  )
}

function Notifications() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="notifications"><path d="M15.137 3.945c-.644-.374-1.042-1.07-1.041-1.82v-.003c.001-1.172-.938-2.122-2.096-2.122s-2.097.95-2.097 2.122v.003c.001.751-.396 1.446-1.041 1.82-4.667 2.712-1.985 11.715-6.862 13.306v1.749h20v-1.749c-4.877-1.591-2.195-10.594-6.863-13.306zm-3.137-2.945c.552 0 1 .449 1 1 0 .552-.448 1-1 1s-1-.448-1-1c0-.551.448-1 1-1zm3 20c0 1.598-1.392 3-2.971 3s-3.029-1.402-3.029-3h6z"/></svg>
  )
}

export default function Header(props) {
  return (
    <Container>
      <h2>
        <Target />
        Work Tree
      </h2>

      <Search tasks={props.tasks} />

      <Notifications />
    </Container>
  )
}
