import { useState } from 'react';
import './App.css';

const App = () => {
  const [userName, setUserName] = useState('');
  const [taskLabel, setTaskLabel] = useState('');
  const [usertodos, setUserTodos] = useState([]);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [flagerror, setFlagError] = useState(false);

  const createUser = async () => {
    const api_url_create_user = `https://playground.4geeks.com/todo/users/${userName}`;

    const userData = {
      name: userName,
    };

    try {
      const userResponse = await fetch(api_url_create_user, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userCreated = await userResponse.json();
        console.log('Usuario creado con éxito:', userCreated);
        setIsUserCreated(true); 
      } else {
        const errorData = await userResponse.json();
        console.error('Error al crear usuario:', errorData);
        setFlagError(true);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setFlagError(true);
    }
  };

  const createTask = async () => {
    const api_url_add_task = `https://playground.4geeks.com/todo/todos/${userName}`;
    const taskData = {
      label: taskLabel,
      is_done: false,
    };

    try {
      const taskResponse = await fetch(api_url_add_task, {
        method: 'POST',
        body: JSON.stringify(taskData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (taskResponse.ok) {
        const taskCreated = await taskResponse.json();
        console.log('Tarea creada con éxito:', taskCreated);
        setUserTodos(prev => [...prev, taskCreated]); 
        setTaskLabel(''); 
      } else {
        const errorData = await taskResponse.json();
        console.error('Error al agregar tarea:', errorData);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const deleteTask = async (todoId) => {
    const api_url_delete_task = `https://playground.4geeks.com/todo/todos/${todoId}`; 

    try {
      const response = await fetch(api_url_delete_task, {
        method: 'DELETE',
      });

      if (response.ok) {
        const successMessage = await response.text(); 
        console.log('Tarea eliminada con éxito:', successMessage);
        
        setUserTodos(prev => prev.filter(task => task.id !== todoId));
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar tarea:', errorData);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <main>
      <header className='header'>
        <h1>Todo App</h1>
      </header>
      {flagerror ?
        <section className='error-notice'>
          <div className="oaerror danger">
            <strong>Error:</strong> Ha ocurrido un error en la carga del listado de tareas
          </div>
        </section>
        :
        <>
          {!isUserCreated ? (
            <section className='user-input-section'>
              <input
                type='text'
                placeholder='Nombre de usuario'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button onClick={createUser}>Crear Usuario</button>
            </section>
          ) : (
            <>
              <section className='task-input-section'>
                <input
                  type='text'
                  placeholder='Nueva tarea'
                  value={taskLabel}
                  onChange={(e) => setTaskLabel(e.target.value)}
                />
                <button onClick={createTask}>Agregar Tarea</button>
              </section>
              <section className='todo-list-section'>
                {usertodos && usertodos.length ? (
                  <ul id='todo-list'>
                    {usertodos.map((todo) => (
                      <li className='todo-item' key={todo.id}>
                        <span className='task-text'>{todo.label}</span>
                        <button className='delete-button' onClick={() => deleteTask(todo.id)}>Eliminar</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No hay tareas en la lista.</div>
                )}
              </section>
            </>
          )}
        </>
      }
    </main>
  );
}

export default App;









