import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/tasks').then(res => res.json()).then(data => setTasks(data)).catch(err => console.log(err));
  }, []);


  return (
     <div style={{padding:20}}>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(t => <li key={t.id || t._id}>{t.title}</li>)}
      </ul>
    </div>
  )
}

export default App
